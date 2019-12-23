
let settings = JSON.parse(localStorage.getItem('settings')) || {};
const Cfg = {
    designW: settings.designW || 1920, //设计图宽度
    designH: settings.designH || 1080, //设计图高度
    zoomMode: settings.zoomMode || (innerWidth < 768 ? 'cover' : 'contain'),
    notebookOptim: [undefined, true].includes(settings.notebookOptim),
};
let hasGetWeather = false;
let scale = 1;
let notebookOptim = true;
let colonShow = true;
let [pageH, pageW] = [$(window).height(), $(window).width()];
const Public = {
    //页面缩放
    pageResize() {
        [pageH, pageW] = [$(window).height(), $(window).width()];
        let isWider = pageW / pageH > Cfg.designW / Cfg.designH;
        let [scaleW, scaleH] = [pageW / Cfg.designW, pageH / Cfg.designH];
        let $container = $("#container");
        switch (Cfg.zoomMode) {
            case "contain":
                if (isWider) {
                    $container.css({width: pageH * Cfg.designW / Cfg.designH, height: '100%'});
                } else {
                    $container.css({height: pageW * Cfg.designH / Cfg.designW, width: '100%'});
                }
                scale = isWider ? scaleH : scaleW;
                break;
            case 'cover':
                $("html,body").css('overflow', 'initial');
                if (isWider) {
                    $container.css({height: pageW * Cfg.designH / Cfg.designW, width: '100%'});
                } else {
                    $container.css({width: pageH * Cfg.designW / Cfg.designH, height: '100%'});
                }
                scale = isWider ? scaleW : scaleH;
                break;
            case 'stretch':
                scale = isWider ? scaleH : scaleW;
                $container.css({width: '100%'}, {height: '100%'});
                break;
        }
        $("html").css("font-size", scale * 16 + "px").css("opacity", 1);
        notebookOptim = !(Cfg.notebookOptim === false || scale > .75);
        // console.log("~~~~~~~~~窗口高度：" + pageH + ",\n宽度:" + pageW + " \nbody字号：" + scale)
    },
    //图表缩放
    chartsResize(charts, param) {
        $(window).resize(() => {
            Object.keys(charts).forEach(id => {
                if (param && param.notResize.includes(id)) {
                    return
                }
                charts[id].resize();
            })
        });
    },
};


Public.pageResize();
if (window.addEventListener) {
    window.addEventListener('resize', function () {
        Public.pageResize();
    }, false)
  }
// $(window).resize(() => {
//     Public.pageResize();
// });
