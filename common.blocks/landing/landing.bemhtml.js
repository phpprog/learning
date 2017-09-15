block('landing').elem('title').replace()(function() {
    var content = {
        elem: 'title',
        content: this.ctx.isFemale
            ? 'Ты пришла в класс, осмотрелась по сторонам и увидела, что ты можешь развиваться в следующих возможностях'
            : 'Ты пришёл в класс, осмотрелся по сторонам и увидел, что ты можешь прокачиваться в следующих возможностях'
    };
    return content;
})

block('landing').elem('statuses').replace()(function() {

    var content,
        item;

    content = [{
        block: 'landing',
        elem: 'plus-point'
    }];

    content.push(this.ctx.statuses.map(function(item, k) {
        var male = item[this.ctx.isFemale ? 'f' : 'm'];

        return {
            block: 'link',
            mods: {
                ajax: 'yes'
            },
            url: item.url,
            content: {
                block: 'landing',
                elem: 'status',
                elemMods: {
                    num: k
                },
                content: [{
                        block: 'image',
                        mix: {
                            block: 'landing',
                            elem: 'thumb'
                        },
                        url: male.img
                    }, {
                        tag: 'br'
                    }, {
                        elem: 'progress',
                        val: this.ctx.progress !== 0 ? 2 : item.defVal
                    },
                    male.name, {
                        block: 'landing',
                        elem: 'status-descr',
                        num: k,
                        content: item.descr
                    }
                ]
            }
        };
    }.bind(this)));

    return content;

})


block('landing').elem('status-descr').content()(function() {

    var content = {
        block: 'landing',
        elem: 'status-descr',
        js: true,
        mods: {
            popup: 'yes',
            item: this.ctx.num
        },
        mix: [{
            block: 'popup',
            mods: {
                theme: 'islands',
                target: 'anchor',
                autoclosable: true
            }
        }],
        content: this.ctx.content || 'empty'
    };

    return applyCtx(content);

})


block('landing').elem('progress').content()(function() {
    var content = {
        block: 'progressbar',
        mods: {
            theme: 'islands',
            color: this.ctx.val < 25 ? 'red' : this.ctx.val >= 75 ? 'green' : 'yellow'
        },
        val: this.ctx.val
    };

    return content;
})


block('landing').elem('plus-point').content()('+1')
