blocks['page'] = function (data) {

    if (!data || !data.pageName) {
        return '404';
    }

    var isLocalServer = data.req.headers.host.indexOf('.com') === -1;

    return data.isAjax ? BEMPRIV.create(data.pageName, data).json() :
        {
            block: 'page',
            js: true,
            title: 'Школьник.com',
            favicon: '/favicon.ico',
            head: [
                { elem: 'meta', attrs: { name: 'description', content: 'Проект, который помогает детям найти взаимопонимание, похвалу и компромисс у родителей.' }},
                {
                    elem: 'js',
                    content: [
                        ';(function(d,e,c,n,w,v,f){',
                        'e=d.documentElement;',
                        'c="className";',
                        'n="createElementNS";',
                        'f="firstChild";',
                        'w="http://www.w3.org/2000/svg";',
                        'e[c]+=" i-ua_svg_"+(!!d[n]&&!!d[n](w,"svg").createSVGRect?"yes":"no");',
                        'v=d.createElement("div");',
                        'v.innerHTML="<svg/>";',
                        'e[c]+=" i-ua_inlinesvg_"+((v[f]&&v[f].namespaceURI)==w?"yes":"no");',
                        '})(document);'
                    ].join('')
                },
                {
                    elem: 'css',
                    url: '/index/_index.css'
                }
            ],
            content: [
                BEMPRIV.create('header', data).json(),
                {
                    block: 'page',
                    elem: 'content',
                    content: BEMPRIV.create(data.pageName, data).json()
                },
                BEMPRIV.create('footer', data).json()
            ],
            scripts: [
                {
                    elem: 'js',
                    url: isLocalServer
                        ? '/socket.io/socket.io.js'
                        : 'https://cdn.socket.io/socket.io-1.4.5.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                },
                {
                    elem: 'js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    },
                    content: 'window.socket = io();'
                },
                // Для локалхоста берём jquery не из CDN,
                // т.к. может не быть соединения.
                {
                    elem: 'js',
                    url: isLocalServer
                        ? '/js/jquery.min.js'
                        : 'https://yastatic.net/jquery/2.1.4/jquery.min.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                },
                {
                    elem: 'js',
                    url: '/index/_index.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                },
                {
                    elem: 'js',
                    url: '//vk.com/js/api/share.js?93',
                    attrs: {
                        async: 'async',
                        charset: 'utf-8'
                    }
                },
                blocks['page__get-metrica']()
            ]
        };
};

blocks['page__get-metrica'] = function() {
    return '<script type="text/javascript" > (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter45977685 = new Ya.Metrika({ id:45977685, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/45977685" style="position:absolute; left:-9999px;" alt="" /></div></noscript>';
}