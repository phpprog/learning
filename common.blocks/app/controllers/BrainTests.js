var vow = require('vow'),
    _ = require('lodash'),
    User = require('./User'),
    Subjects = require('./Subjects'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с тестами
 *
 * @returns {BrainTests}
 * @constructor
 */
var BrainTests = function() {
    return this;
};

/**
 * Возвращает вопрос для заданного класса, на который пользователь ещё не отвечал
 *
 * @param {Object} db
 * @param {Number} userId - id пользователя
 * @param {Number} classNum - класс [1..11]
 *
 * @returns {Promise}
 */
BrainTests.getRandomQuestionForUser = function(db, userId, classNum) {
    return new Promise((resolve, reject) => {

        db.models['brain-tests'].count({ class: classNum }, (err, n) => {

            db.models['brain-tests-answers'].find({
                classNum: classNum,
                userId: utils.oId(userId)
            }).only('questionId').run((err, data) => {
                n -= data.length;

                if (n <= 0) {
                    return reject([]);
                }

                let r = Math.floor(Math.random() * (n <= 0 ? 0 : n - 1));

                db.models['brain-tests'].find({
                    class: classNum,
                    _id: {
                        $nin: _.map(data, function (a) {
                            return utils.oId(a.questionId);
                        })
                    }
                }).limit(1).skip(r).run(function (err, data) {
                    if (!data.length) {
                        return reject([]);
                    }

                    // TODO: нормализовать данные с предметами
                    data[0].subj = { name: data[0].subj };
                    return resolve(data[0]);
                });

            });

        });

    });
};

/**
 * Инкриментирует количество жалоб
 *
 * @param BTestsModel
 * @param {Number} qId - id вопроса
 *
 * @returns {Promise}
 */
BrainTests.incQuestionComplaints = function(BTestsModel, qId) {
    var deferred = vow.defer();

    BTestsModel.find({ _id: utils.oId(qId) }).limit(1).run(function (err, data) {

        if (err) throw err;

        if (_.isEmpty(data)) {
            deferred.reject(false);
        } else {
            data[0].complaints += 1;

            data[0].save(function(err) {
                if (err) throw err;
            });

            deferred.resolve(true);
        }

    });

    return deferred.promise();
};



/**
 * Создать запись в таблице об ответе пользователя
 *
 * @param BAnswersModel
 * @param {Number} userId
 * @param {Number} questionId
 * @param {Boolean} isRight
 * @param {Number} classNum
 * @returns {*}
 */
BrainTests.createAnswerRow = function(BAnswersModel, userId, questionId, isRight, classNum) {
    var deferred = vow.defer();

    BAnswersModel.create({
        userId: utils.oId(userId),
        questionId: utils.oId(questionId),
        classNum: parseInt(classNum, 10),
        answer: Boolean(isRight)
    }, function (err) {
        if (err) throw err;

        deferred.resolve();
    });

    return deferred.promise();
};

/**
 * Получить количество ответов для данного класса.
 *
 * @param BAnswersModel
 * @param {Number} userId
 * @param {Number} classNum
 * @param {Number} toRightAnswer [0|1] - получить количество правильных или не правильных ответов
 *
 * @returns {*}
 */
BrainTests.getStatsForUserClass = function(BAnswersModel, userId, classNum, toRightAnswer) {
    var deferred = vow.defer();

    BAnswersModel.find({ userId: utils.oId(userId), answer: Boolean(toRightAnswer), classNum: classNum })
        .count(function(err, data) {
            if (err) throw err;
            deferred.resolve(data);
        });

    return deferred.promise();
};


/**
 * Получить первый трёх человек из рейтинга
 * @param db
 * @param userId
 * @param classNum
 * @returns {*}
 */
BrainTests.getStatsRating = function(db, userId, classNum) {
    var deferred = vow.defer();

    db.models['brain-tests-answers'].proxy('aggregate', 'brain-tests-answers', [[
        { $match: { answer: true , classNum: classNum } },
        {
            $group : {
                _id: "$userId",
                cnt: { "$sum": 1 }
            }
        },
        { $sort : { cnt: -1 } },
        { $limit : 3 }
    ], function (err, data) {

        if (err) throw err;

        if (_.isEmpty(data)) {
            deferred.resolve([]);
        } else {
            _.forEach(data, function(item, k) {
                data[k].RowNumber = k;
            });

            // Если юзер есть в одном из трёх первых, то возвращаем их и выходим
            for (var k in data) {
                if (utils.oId(userId).equals(data[k]['_id'])) {
                    deferred.resolve(data);
                    return;
                }
            }

            BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], userId, classNum, 1)
                .then(function(uStat) {
                    // Здесь вписано _id, но это в group подставляется userId
                    data.push({ RowNumber: 100500, _id: userId, cnt: uStat });
                    deferred.resolve(data);
                });
        }

    }]);

    return deferred.promise();
};


/**
 * Получить стату для пользователя.
 *
 * TODO: тут ещё надо будет всё перепроверить и написать тестов.
 *
 * @param db
 * @param userId
 * @param classNum
 * @returns {*}
 */
BrainTests.getUserForStat = function(db, userId, classNum) {
    var deferred = vow.defer();

    BrainTests.getStatsRating(db, userId, classNum).then(function(uStat) {
        var userIds = [];
        for (var k in uStat) {
            userIds.push(uStat[k]._id); // Здесь вписано _id, но это в group подставляется userId
        }

        User.getById(db.models['users'], userIds, '_id,vkid,first_name,photo_100').then(function(users) {
            for (var i in uStat) {
                uStat[i]._id = utils.oId(uStat[i]._id);
                for (var k in users) {
                    users[k]._id = utils.oId(users[k]._id);
                    // Здесь вписано _id, но это в group подставляется userId
                    if (uStat[i]._id.equals(users[k]._id)) {
                        uStat[i].user = users[k];
                    }
                }
            }

            deferred.resolve(uStat);
        }, function() {
            deferred.resolve([]);
        });

    });

    return deferred.promise();
};


module.exports = BrainTests;
