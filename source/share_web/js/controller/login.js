niceShare.Controller.controller('loginCtrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        var cookie = require('Cookie');

        // 登陆
        $scope.login = function (type) {

            switch (type) {
                case 'facebook' :
                    var facebookLogin = function () {
                        FB.getLoginStatus(function(response) {
                            console.log(response);
                            if (response.status === 'connected') {
                                console.log('Logged in.');
                            }
                            else {
                                console.log('Logged out.');
                                FB.login();
                            }
                        });
                    };

                    FB.login();
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
        };

        // 关闭按钮
        $scope.cancel = function () {
            var data = {
                iframe : false
            };
            top.postMessage(data, "*");
        };

        // 语言切换
        $scope.languageChange = function (language) {
            $rootScope.$broadcast('languageChange', {
                newLanguage :  language
            });
        };
    }
]);
