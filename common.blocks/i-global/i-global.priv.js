var BEM = BEM || {},
    blocks = {},
    global = {};

/**
 * Оборачивает блоки проекта |blocks| в обёртку try-catch для того, чтобы если блок при выполнении
 * вылетит с ошибкой - то не прерывать выполнение всей странице и вылетать с ошибкой, а локализовать
 * ошибку в одном месте и возвратить либо пустой блок, либо debug-сообщение об ошибке
 *
 * @param {Object} blocks - Блоки проекта.
 *
 */
function wrapBlocksTryCatch(blocks) {

    if (blocks._tryCatchWrapped) {
        return blocks;
    }

    for (var i in blocks) {
        if (blocks.hasOwnProperty(i)) {
            var b = blocks[i];

            if (Object.prototype.toString.call(b) !== '[object Function]') {
                continue;
            }

            blocks[i] = (function(b, i) {

                return function() {
                    var data = arguments[0];

                    try {
                        return b.apply(this, arguments);
                    } catch (e) {
                        var error = [
                            '\n\n==============',
                            'JavaScript error: in',
                                'blocks["' + i + '"]',
                            e.message,
                            e.stack,
                            '==============\n\n'
                        ].join('\n');
                        console.error(error);
                        return true ?
                            [
                            '<pre>',
                                'JS Exception: ' + Text.xmlEscape(e.message) + ' in blocks[\'' + i + '\']()',
                                '\nblocks[\'' + i + '\'] = ' + Text.xmlEscape(b.toString()) + '\n',
                            Text.xmlEscape(e.stack),
                            '</pre>'
                            ].join('\n')
                            : '';
                    }
                };

            })(b, i);

        }
    }

    blocks._tryCatchWrapped = true;

}

function main(data) {

    wrapBlocksTryCatch(blocks);

    return blocks['i-response'](data);

}

exports.blocks = blocks;
exports.main = main;
