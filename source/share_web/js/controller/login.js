niceShare.Controller.controller('loginCtrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        var cookie = require('Cookie');

        // 登陆
        $scope.login = function (type) {
            switch (type) {
                case 'facebook' :
                    console.log(1);
                    break;
                case 'google+' :
                    console.log(2);
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
            localStorage.setItem('language', language);
            $rootScope.$broadcast('languageChange', {
                newLanguage :  language
            });
        };
    }
]);
