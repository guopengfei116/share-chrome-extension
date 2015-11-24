
/*
* 负责加载nice_share页
* */
$(function () {

    /*
    * 监听插件事件
    * */
    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

        var id = sender.id;

        if (request.greeting && request.greeting == 'login') {
            loadShare();
        } else if (request.greeting && request.greeting == 'cancel') {
            $('#nice-share-iframe-page').hide();
        } else {

        }

        console.log(arguments);
    });

    /*
    * 监听iframe事件
    * */
    window.addEventListener('message', function (e) {
        var data = e.data;

        if(!data) {
            return;
        }

        // 窗口显示隐藏
        if(!data.iframe) {
            $('#nice-share-iframe-page').hide();
            return;
        }
        if(data.iframe) {
            $('#nice-share-iframe-page').show();
            return;
        }

    }, false);


    /*
    * 添加iframe
    * 监听iframe-load事件
    * */
    function loadShare () {

        // 已存在iframe开关
        var $hiddenNiceShareIframePage = $('#nice-share-iframe-page' + ':hidden');
        var $visibleNiceShareIframePage = $('#nice-share-iframe-page' + ':visible');

        if ($hiddenNiceShareIframePage.length) {
            $hiddenNiceShareIframePage.show();
            return;
        }else if ($visibleNiceShareIframePage.length) {
            $visibleNiceShareIframePage.hide();
            return;
        }

        /*
        * 创建添加iframe
        * */
        var $iframe = $('<iframe id="nice-share-iframe-page"></iframe>');
        $iframe.attr('src', 'http://www.nice_share.co:9800/share_web')
            .css({position : "fixed", left : 0, top : 0, right : 0, bottom : 0, 'z-index' : 8888, 'width' : '100%', 'height' : '100%'});
        $iframe.appendTo('body');
    }
});
