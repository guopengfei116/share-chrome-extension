/*
* 分享页控制器
* */
niceShare.Controller.controller('shareCtrl', [
    '$scope',
    function ($scope) {

        $scope.status = {
            photoUpload : true,
            photoFormatError : false,
            shareSuccess : false
        };

        // 关闭按钮
        $scope.cancel = function () {
            top.postMessage(JSON.stringify({ iframe : 'off' }), "*");
        };

        // 分享按钮
        $scope.share = function (type) {
            if(!$scope.feed.message) {
                $scope.status.photoFormatError = true;
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.status.photoFormatError = false;
                    });
                }, 1000);
                return;
            }else if($scope.feed.message.length > 150) {
                $scope.status.photoFormatError = true;
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.status.photoFormatError = false;
                    });
                }, 1000);
                return;
            }

            switch (type) {
                case 'facebook' :
                    FB.api('/me/feed', 'POST', {
                        message : $scope.feed.message,
                        link : $scope.feed.link,
                        description : $scope.feed.title,
                        picture : $scope.feed.picture
                    }, function (response) {
                        if(response.error) {
                            alert(Ui.alert(response.error));
                        }
                    });
                    break;
                case 'google+' :
                    console.log('google+');
                    break;
            }
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
