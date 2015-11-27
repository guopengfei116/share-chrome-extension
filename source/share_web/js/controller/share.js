/*
* 分享页控制器
* */
niceShare.Controller.controller('shareCtrl', [
    '$scope',
    '$timeout',
    'UPLOAD_PHOTO_INTERFACE',
    function ($scope, $timeout, UPLOAD_PHOTO_INTERFACE) {

        // 初始化显示状态
        $scope.status = {
            photoUpload : false,
            photoFormatError : false,
            shareSuccess : false
        };

        // 关闭按钮
        $scope.cancel = function () {
            top.postMessage(JSON.stringify({ iframe : 'off' }), "*");
        };

        /*
        * 图片上传
        * */
        function uploadImg (file, cb) {
            var uploadImg = new UploadFile({
                file : file,
                uploadName : UPLOAD_PHOTO_INTERFACE.NAME,
                interfaceUrl : UPLOAD_PHOTO_INTERFACE.URL,
                onComplete : cb,
                onError : function(ret){
                    console.log('erroe');
                }
            });
            uploadImg.run();
        }

        /*
        * @Listener   file表单change
        * @*          格式效验，回显
        * */
        $('#photo_upload_input').change(function (event) {
            var file = this.files[0];
            var reader = new FileReader();

            // 文件读取
            reader.onload = function(event){

                if(file.type.indexOf('image') != -1 || 0){
                    /*
                    * 上传文件
                    * 回调回显
                    * */
                    uploadImg(file, function (result) {
                        console.log(result);
                        if(typeof result == 'string') {
                            try {
                                result = JSON.parse(result);
                            }catch (e) {
                                result = null;
                            }
                        }
                        if(result && result.data) {
                            var imgBase64 = event.target.result;
                            $('#media-picture').attr('src', imgBase64);
                            $('#upload-picture').attr('src', imgBase64);
                            $scope.feed.picture = result.data.pic;
                        }else {
                            console.log('图片上传失败！');
                        }
                    });
                }else{
                    // 图片类型错误提示
                    $scope.$apply(function () {
                        $scope.status.photoFormatError = true;
                    });
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.status.photoFormatError = false;
                        });
                    }, 1000);
                }
            };
            reader.readAsDataURL(file);
        });

        // 输入框错误提示
        var blink = (function () {
            var number, blinkTimer, $textarea = $('#message-textarea');
            return function (cbk) {
                number = 0;
                clearInterval(blinkTimer);
                blinkTimer = setInterval(function (){
                    if(number > 6){
                        clearInterval(blinkTimer);
                        $textarea.removeClass('textarea-warning');
                        cbk && cbk();
                    }else if(number % 2 === 0){
                        $textarea.addClass('textarea-warning');
                    }else {
                        $textarea.removeClass('textarea-warning');
                    }
                    number++;
                }, 50);
            };
        })();

        // 分享按钮
        $scope.share = function (type) {

            // message效验
            if(!/^.{1,150}$/.test($scope.feed.message || '')) {
                blink();
                return;
            }

            // 发送分享到第三方应用
            switch (type) {
                case 'facebook' :
                    console.log('facebook接口');
                    FB.api('/me/feed', 'POST', {
                        message : $scope.feed.message,
                        link : $scope.feed.link,
                        picture : $scope.feed.picture,
                        name : $scope.feed.title,
                        description : $scope.feed.description || $scope.feed.link
                        //caption : $scope.feed.title,
                    }, function (response) {
                        console.log(response);
                        console.log(response.id);
                        if(response && response.id) {
                            $scope.$apply(function () {
                                $scope.status.shareSuccess = true;
                                $timeout(function () {
                                    $scope.status.shareSuccess = false;
                                }, 1000);
                            });
                        }
                    });
                    break;
                case 'google+' :
                    console.log('google+');
                    break;
            }
            // 上报分享操作
            report.infinite('share_clikc');
        };

        /*
        * 获取网站信息
        * 发送message到父窗口对象，
        * 接收来自父窗口对象中content_script带来的数据进行页面初始化
        * */
        top.postMessage(JSON.stringify({ getData : true }), "*");
        window.addEventListener('message', function (e) {

            if(e && /^.*\.facebook\.com$/.test(e.origin)) {
                console.log('iframe阻止facebook事件');
                return;
            }

            console.log('iframe接收' + e.origin + 'message');

            // 数据解析
            var data = e.data;
            if(!data) {
                return;
            }
            if(typeof data !== 'object') {
                try {
                    data = JSON.parse(data);
                    if(typeof data !== 'object') {
                        throw Error('iframe所需站点数据格式错误');
                    }
                }catch (error) {
                    console.log(error);
                }
            }
            $scope.$apply(function () {
                $scope.feed = data;
            });
        });

        /*
        * 获取用户信息
        * */
        if(window.FB) {
            window.FB.api('/me', { fields : ['picture', 'name']}, function (result) {
                $scope.$apply(function () {
                    $scope.user.avatar = result.picture && result.picture.data && result.picture.data.url;
                });
            });
        }else {

        }
    }
]);
