
/*
* 负责加载nice_share页
* */
$(function () {

    /*
    * 监听事件
    * */
    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

        loding();

        if (request.greeting && request.greeting == 'login') {
            loadShare();
        } else if (request.greeting && request.greeting == 'cancel') {
            $('#nice-share-iframe-page').hide();
            $('#nice-share-loding').hide();
        } else {
            $('#nice-share-loding').hide();
        }

        console.log(arguments);
    });

    /*
    * iframe 加载loding
    * */
    function loding () {

        // 已存在
        var $loding = $('#nice-share-loding');
        if ($loding.length) {
            $loding.show();
            return;
        }

        // 创建添加loding
        var tpl =
            '<div id="nice-share-loding"> \
                <img src="" />\
            </div>';
        $(tpl).appendTo('body');
    }

    /*
    * 添加iframe
    * 监听iframe-load事件
    * */
    function loadShare () {
        console.log('开始加载share_page');

        // 已存在
        var $niceShareIframePage = $('#nice-share-iframe-page');
        if ($niceShareIframePage.length) {
            $niceShareIframePage.show();
            return;
        }

        /*
        * 创建添加iframe
        * */
        var $iframe = $('<iframe id="nice-share-page"></iframe>');
        $iframe.attr('src', 'http://www.nice_share.co')
            .css({position : "fixed", left : 0, top : 0, right : 0, bottom : 0, 'z-index' : 8888});
        $iframe.load(function () {
            $('#nice-share-loding').hide();
        });
        $iframe.appendTo('body');
    }
});
