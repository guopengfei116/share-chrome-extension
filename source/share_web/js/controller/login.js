/*
 * 登陆页控制器
 * */
niceShare.Controller.controller('loginCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    function ($rootScope, $scope, $location) {
        var cookie = require('Cookie');

        // 授权登陆
        $scope.login = function (type) {
            switch (type) {
                case 'facebook' :
                    var facebookLogin = function () {
                        FB.login(function (response) {
                            console.log(response);
                            if (response.status === 'connected') {
                                console.log('Logged in.');
                                $scope.$apply(function () {
                                    $rootScope.user['logined'] = true;
                                    $location.path('/share');
                                });
                            }
                            else {
                                console.log('Logged out.');
                            }
                        }, {scope : 'public_profile, publish_actions'});
                    };
                    if(FB) {
                        facebookLogin();
                    }else {
                        setTimeout(facebookLogin, 2000);
                    }
                    break;
                case 'google+' :
                    console.log('google+');
                    break;
            }
            // 上报授权登陆
            report.infinite('button_click');
        };

        // 关闭按钮
        $scope.cancel = function () {
            top.postMessage(JSON.stringify({ iframe : 'off' }), "*");
        };

        // 语言切换
        $scope.languageChange = function (language) {
            $rootScope.$broadcast('languageChange', {
                newLanguage :  language
            });
            // 上报语言切换操作
            report.infinite('edit');
        };
    }
]);
