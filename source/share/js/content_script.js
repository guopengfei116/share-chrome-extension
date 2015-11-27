
/*
* 负责加载nice_share页
* */
$(function () {

    /*
    * 监听插件事件
    * */
    //chrome.extension.onMessage.addListener(function (data) {
    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {

        /*
         * iframe初始化方法
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
            var onlineUrl = 'http://niceshare.goextension.com';
            var testUrl = onlineUrl + ':9800/share_web';

            // 设置iframe地址
            $iframe.attr('src', onlineUrl)
                .css({position : "fixed", left : 0, top : 0, right : 0, bottom : 0, 'z-index' : 8888, 'width' : '100%', 'height' : '100%'});

            $iframe.load(function () {
                console.log('iframe加载成功');
            });
            $iframe.error(function () {
                console.log('iframe onerror');
            });

            $iframe.appendTo('body');
        }

        // 状态控制
        if (request.greeting && request.greeting == 'login') {
            loadShare();
        } else if (request.greeting && request.greeting == 'cancel') {
            $('#nice-share-iframe-page').hide();
        } else {
            var id = sender.id;
            console.log(id);
        }
    });

    /*
    * 监听iframe事件
    * */
    window.addEventListener('message', function (e) {

        if(e && /^.*\.facebook\.com$/.test(e.origin)) {
            console.log('content阻止facebook事件');
            return;
        }

        console.log('content接收' + e.origin + 'message');

        /*
        * 获取网站信息方法
        * */
        function getPageData () {
            var data = {
                link : window.location.href,
                title : $('title').text(),
                picture : '',
                description : $('meta[name=description]').attr('content')
            };
            // 获取一张图片src
            $('img').each(function (i, e) {
                if(/^.*\.(jpg|jpeg|gif|png){1}(\?.*)?$/.test(this.src) && !data.picture) {
                    var width = this.width;
                    var height = this.height;
                    if(width * height > 5000) {
                        data.picture = this.src;
                        return false;
                    }
                }
            });
            return data;
        }

        // 数据解析
        try {
            var data = e.data;
            if(!data) {
                return;
            }
            data = JSON.parse(data);
            if(typeof data !== 'object') {
                throw Error('content_message接受类型错误');
            }
        }catch (error) {
            console.log(error);
        }
        console.log(data);

        // 窗口显示隐藏
        if(data.iframe) {
            if(data.iframe === 'off') {
                $('#nice-share-iframe-page').hide();
            }else {
                $('#nice-share-iframe-page').show();
            }
        }

        // 获取网站数据
        if(data.getData) {
            var sendData = getPageData();
            var iframe = document.getElementById('nice-share-iframe-page');
            if(iframe) {
                iframe.contentWindow.postMessage(sendData, '*');
            }else {
                throw Error('iframe 初始化失败');
            }
        }
    }, false);
});
