
/*
 * 页面初始化之前，验证用户登录状态和权限，进行页面跳转
 * */
niceShare.ShareApp.run([
    '$rootScope',
    '$location',
    '$log',
    'GetLanguage',
    function ($rootScope, $location, $log, GetLanguage) {

        /*
        * 删除loading
        * 初始化Ui
        * */
        window.onload = function () {
            $('.loading').remove();
            var ui = new Ui();
            ui.init();
        };

        // 初始化默认语言
        $rootScope.language = GetLanguage(localStorage.getItem('language'));

        // 初始化登陆状态
        $rootScope.user = {
            logined : true
        };
        console.log(window.FB);
        window.FB && window.FB.getLoginStatus(function(response) {
            console.log(response);
            if (response.status === 'connected') {
                $rootScope.user['logined'] = true;
            }
        });

        // 语言更换
        $rootScope.$on('languageChange', function (e, data) {
            if(data && data.newLanguage) {
                localStorage.setItem('language', data.newLanguage);
                $rootScope.language = GetLanguage(data.newLanguage);
            }
        });

        // 切换页面时权限认证
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var nextUrl = next && next.originalPath;
            var currentUrl = current && current.originalPath;
            console.log('当前页：' + currentUrl + ', 下一页：' + nextUrl);

            // 如果用户未登录
            if(!$rootScope.user['logined']) {
                console.log('用户未登录, nextUrl:' + nextUrl);

                if(nextUrl && (nextUrl == '/login' || nextUrl === '/')) {
                    // 已经转向登录路由因此无需重定向
                    $location.path('/login');
                }else {
                    $location.path('/login');
                }

            // 如果已登录访问登陆页面，则重定向到分享页
            }else if(nextUrl === '/login' || nextUrl === '/' || nextUrl === undefined){
                $location.path('/share');

            // 访问其它页，如果已登录，则重定向到分享页
            }else {
                $location.path('/share');
            }
        });
    }
]);
