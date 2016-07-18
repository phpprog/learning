var fs = require('fs'),
    PATH = require('path'),
    VM = require('vm'),
    express = require('express'),
    app = express(),
    Vow = require('vow'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'index'),
    pathToStatic = PATH.join('.', 'public'),

    session = require('express-session'),
    _SECRET = 'nosecret',
    mySession = new session.MemoryStore(),

    cookieParser = require('cookie-parser'),
    myCookieParser = cookieParser(_SECRET),

    redirects = require('./routes/redirects'),

    User = require('./controllers/User'),
    BrainTests = require('./controllers/BrainTests'),
    Complaints = require('./controllers/Complaints'),
    Poems = require('./controllers/Poems'),
    Consultor = require('./controllers/Consultor'),
    SpeakerLearnPoem = require('./controllers/SpeakerLearnPoem'),
    Authors = require('./controllers/Authors'),

    settings = require('./settings'),

    models   = require('./models/'),

    routes = require('./routes/'),

    url = require('url'),
    querystring = require('querystring'),

    http = require('http').Server(app),
    io = require('socket.io')(http),

    SessionSockets = require('session.socket.io'),
    sessionSockets,

    orm = require('orm'),

    _ = require('lodash'),

    bodyParser = require("body-parser"),

    utils = require('./utils'),

    server;

// html/css/js кэшируем на день, картинки на год.
//app.use(express.static(pathToBundle, { maxAge: 86400000 }));

app.use(express.static(PATH.join('.', 'desktop.bundles'), { extensions: ['js', 'css'], maxAge: 86400000 }));
app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(myCookieParser);
app.use(session({ secret: _SECRET, store: mySession }));

app.use(bodyParser.urlencoded({ extended: false }));


sessionSockets = new SessionSockets(io, mySession, myCookieParser);



// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/config/environment.js#L12-L21
app.use(function (req, res, next) {
    models(function (err, db) {
        if (err) return next(err);

        req.models = db.models;
        req.db     = db;

        return next();
    });
});

app.use(redirects);

var context = VM.createContext({
    console: console,
    Vow: Vow
});

app.use(routes, function(req, res) {

    res.searchObj = url.parse(req.url, true).query;
    res.user || (res.user = {});

    var content;

    res.isAjax = res.searchObj && (res.searchObj.format === 'json' || res.searchObj.ajax === 'yes');

    if (res.html) {
        content = res.html;
    } else if (res.priv) {

        _.assign(req.session, req.cookies);

        content = res.priv.main({
            pageName: res.pageName,
            searchObj: res.searchObj,
            cookies: req.cookies,
            session: req.session,
            user: res.user,
            appId: res.appId || 0,
            req: req,
            res: res,
            isAuth: res.user.isAuth,
            isFemale: res.user.sex == 1,
            isAjax: res.isAjax
        });

        if (res.isAjax) {
            res.set('Content-Type', 'application/json');
        } else {
            res.set('Content-Type', 'text/html');
            content = res.BEMHTML.apply(content);
        }

        res.send(content);
        content = '';

    }

    res.end(content);

});

server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


models(function (err, db) {

    // Это всё "безобразие" начинает разрастаться ;(
    // TODO: разнести по контроллерам, структурировать, написать комментариев
    sessionSockets.on('connection', function(err, socket, session) {
        console.log('connected');

        socket.on('disconnect', function() {
            console.log('disconnected');
        });

        var sid = session && session[settings.vk.cookieName];

        if (!sid) {
            return;
        }

        var user = new User(db.models['users'], { sid: sid }, function() {

            if (!user || !user._id) {
                user = {};
                return;
            }

            /* DATA-PROVIDER START */

            socket.on('provider:act:find-author', function (query) {
                Authors.findByQuery(db.models['authors'], query, user._id)
                    .then(function (authors) {
                        socket.emit('provider:data:author', authors);
                    });
            });

            socket.on('provider:act:find-poem', function (query, author) {
                Poems.findPoemByAuthorANDQuery(db.models['poems'], db.models['authors'], query, author, user._id)
                    .then(function(poems) {
                        socket.emit('provider:data:poem', poems);
                    });
            });
            //window.socket.emit('provider:act:' + params.act, params.val);


            /* DATA-PROVIDER END */



            /* LANDING START */

            db.models['brain-tests-answers'].count({userId: utils.oId(user._id), answer: 1}, function (err, rightAnswers) {
                db.models['brain-tests-answers'].count({userId: utils.oId(user._id)}, function (err, answers) {
                    socket.emit('user:rating', {
                        0: {
                            countAnswers: answers,
                            rightAnswers: rightAnswers
                        }
                    });
                });
            });

            /* LANDING END */


            /* S-SPEAKER START */

            socket.on('s-speaker:get-poem', function (poemId) {
                Poems.getById(db.models['poems'], db.models['authors'], poemId)
                    .then(function (poem) {
                        socket.emit('s-speaker:poem', poem);
                    });
            });

            /* S-SPEAKER END */

            /* SELECT-POEM START */

            // Получить стих по точному вхождению имени и автора
            socket.on('select-poem:getPoemByNameAndAuthor', function (params) {
                Poems.getPoemByNameAndAuthor(db.models['poems'], db.models['authors'], params.name, params.author, user._id)
                    .then(function(poem) {
                        socket.emit('select-poem:getPoem', poem);
                    });
            });

            // Получить стих по ID
            socket.on('select-poem:getPoemById', function (id) {
                Poems.getById(db.models['poems'], db.models['authors'], id)
                    .then(function (poem) {
                        if (err) throw err;
                        socket.emit('select-poem:getPoemById', poem);
                    });
            });

            function createOrSaveProgress(params, answerName) {
                SpeakerLearnPoem
                    .getDataOfProgressOrCreate(db.models['speaker-learn-poem'], params.poemId, params.act, user._id)
                    .then(function (poem) {
                        socket.emit(answerName || 'select-poem:saveFirstStep', params.poemId);
                    });
            }


            // TODO: объединить эти события
            socket.on('s-speaker-read:save', function (params) {
                createOrSaveProgress(params, 's-speaker-read:save');
            });

            socket.on('s-speaker-sort-lines:save', function (params) {
                createOrSaveProgress(params, 's-speaker-sort-lines:save');
            });

            socket.on('s-speaker-repeat:save', function (params) {
                createOrSaveProgress(params, 's-speaker-repeat:save');
            });

            socket.on('s-speaker-finish:save', function (params) {
                createOrSaveProgress(params, 's-speaker-finish:save');
            });

            // Отправить данные о прогрессе для завершения изучения стихотворения
            socket.on('s-speaker-finish:get-progress', function (poemId) {
                SpeakerLearnPoem
                    .saveProgress(db.models['speaker-learn-poem'], poemId, '', user._id)
                    .then(function(progress) {
                        socket.emit('s-speaker-finish:progress', progress);
                    });
            });

            // Сохраняем статус для изучения стиха
            // Если стихотворения нет, то добавляем его в БД
            socket.on('select-poem:saveFirstStep', function (params) {

                //if (params.poemId) {
                //    createOrSaveProgress(params);
                //} else {
                    _.forEach(params, function(item, k) {
                        params[k] = _.trim(item);
                    });

                    if (!_.isEmpty(params.author) && !_.isEmpty(params.name) && !_.isEmpty(params.poem)) {

                        Poems.getPoemByNameAndAuthor(db.models['poems'], db.models['authors'], params.name, params.author, user._id)
                            .then(function (poem) {
                                params.poemId = poem && poem._id;

                                if (params.poemId) {
                                    createOrSaveProgress(params);
                                } else {
                                    Authors.create(db.models['authors'], params.author, user._id).then(function(author) {

                                        Poems.create(db.models['poems'], params.name, author._id, user._id, params.poem).then(function(success) {
                                            if (success) {
                                                Poems.getPoemByNameAndAuthor(db.models['poems'], db.models['authors'], params.name, params.author, user._id)
                                                    .then(function (poem) {
                                                        params.poemId = poem._id;

                                                        createOrSaveProgress(params);
                                                    });
                                            }
                                        });
                                    });
                                }
                            });

                    } else {
                        socket.emit('select-poem:saveFirstStep', 0);
                    }
                //}

            });

            /* SELECT-POEM END */


            /* BRAIN-TEST START */

            var cookie = {},
                rating = {};

            socket.on('class-select:change', function (classNum) {
                cookie['classNum'] = classNum;
                getTest(cookie.classNum);
            });

            socket.on('s-braint:nextQuestion', function () {
                getTest(cookie.classNum);
            });

            socket.on('s-braint:checkAnswer', function (answerData) {

                db.models['brain-tests'].find({
                    _id: utils.oId(answerData._id),
                    rightanswernum: parseInt(answerData.num, 10)
                }).limit(1).run(function (err, data) {
                    var isRight = false;

                    if (!_.isEmpty(data)) {
                        isRight = true;

                        db.models['brain-tests-answers'].count({
                            userId: utils.oId(user._id),
                            answer: 1
                        }, function (err, rightAnswers) {
                            db.models['brain-tests-answers'].count({userId: utils.oId(user._id) }, function (err, answers) {
                                socket.emit('user:rating', {
                                    0: {
                                        countAnswers: answers,
                                        rightAnswers: rightAnswers
                                    }
                                });
                            });
                        });

                    }

                    BrainTests.createAnswerRow(db.models['brain-tests-answers'], user._id, answerData._id, isRight, cookie.classNum)
                        .then(function () {
                            socket.emit('s-brain:setAnswer', isRight);
                        });
                });

            });

            function getTest(classNum) {
                var find = {};

                if (!classNum) {
                    classNum = cookie['classNum'];
                }

                if (classNum) {
                    classNum = parseInt(classNum, 10);
                    classNum >= 1 && classNum <= 11 && (find.class = classNum);
                }

                BrainTests.getUserForStat(db, user._id, classNum).then(function (data) {
                    socket.emit('rating:rating', data);
                });

                BrainTests.getRandomQuestionForUser(db, user._id, classNum)
                    .then((data) => {
                        socket.emit('s-brain:question', data);
                    }, () => {
                        BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], user._id, find.class, 1)
                            .then(function (rightAnswers) {
                                BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], user._id, find.class, 0)
                                    .then(function (falseAnswers) {
                                        socket.emit('s-brain:question-end', {
                                            rightAnswers: rightAnswers,
                                            falseAnswers: falseAnswers
                                        });
                                    });
                            });
                    });

            }

            /* BRAIN-TEST END */

            /* S-CONSULTOR START */
            socket.on('s-consultor:sendQuestion', function(data) {
                Consultor.create(db.models['s-consultor'], data.question, user._id)
                    .then(function(question) {
                        socket.emit('s-consultor:addedQuestion', true);
                    })
                    .fail(function() {
                        socket.emit('s-consultor:addedQuestion', false);
                    });
            });

            socket.on('s-consultor:showQuestion', function(data) {
                Consultor.getById(db.models['s-consultor'], data.id)
                    .then(function(question) {
                        socket.emit('s-consultor:question', question);
                    });
            });

            // Обновить количество лайков у вопроса
            socket.on('s-consultor:setLikeCnt', function(data) {
                // TODO: ajax обновление на странице
                Consultor.updateLikeCount(db.models['s-consultor'], data.qId, data.likes);
            });

            socket.on('s-consultor:setCommentsCount', function(data) {
                // TODO: ajax обновление на странице
                Consultor.updateCommentsCount(db.models['s-consultor'], data.qId, data.commentsCount);
            });
            /* S-CONSULTOR END */

        });

    });

});
