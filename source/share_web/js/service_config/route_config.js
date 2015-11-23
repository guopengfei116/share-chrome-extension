/*
 * 配置页面路由
 * */
niceShare.ServiceConfig.config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider

            //login
            .when('/', {
                redirectTo: '/login'
            })
            .when('/login', {
                templateUrl: '/share_web/tpl/login.html',
                controller: 'loginCtrl'
            })

            //share
            .when('/share', {
                templateUrl: '/share_web/tpl/share.html',
                controller: 'shareCtrl'
            })

            //notfound
            .otherwise({
                redirectTo: '/login'
            });
    }
]);

