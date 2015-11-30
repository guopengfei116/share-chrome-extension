
/*
 * 页面初始化之前，验证用户登录状态和权限，进行页面跳转
 * */
niceShare.ShareApp.run([
    '$rootScope',
    '$location',
    '$log',
    'GetLanguage',
    function ($rootScope, $location, $log, GetLanguage) {

        // 初始化默认语言
        $rootScope.language = GetLanguage(localStorage.getItem('language'));

        // 初始化登陆状态
        $rootScope.user = {
            logined : false
        };

        /*
        * 获取facebook登陆状态
        * 直到facebook登陆成功为止
        * */
        var getFacebookTimer = null;
        var facebookLoginStatus = function () {
            clearTimeout(getFacebookTimer);
            getFacebookTimer = setTimeout(function () {
                FB.getLoginStatus(function (e) {
                    if(e.status === 'connected') {
                        console.log('facebook已登录');
                        $rootScope.$apply(function () {
                            $rootScope.user['logined'] = true;
                            $location.path('/share');
                        });
                    }else {
                        facebookLoginStatus();
                        console.log('facebook未登录');
                    }
                });
                console.log(FB.getAuthResponse());
            }, 2000);
        };

        /*
         * 添加facebookSDK初始化监听
         * */
        $(document).on('facebookLoad', function (event) {
            console.log('FB load');
            facebookLoginStatus();
        });

        /*
         * 通知插件iframe已成功加载
         * 初始化页面
         * 判断登陆状态
         * */
        window.onload = function () {
            top.postMessage(JSON.stringify({ iframeLoad : true }), "*");
            $('.loading').remove();
            var ui = new Ui();
            ui.init();

            if(typeof FB !== 'undefined') {
                var fbAuthResponse = FB.getAuthResponse();
                if(fbAuthResponse && fbAuthResponse.userID) {
                    $rootScope.user['logined'] = true;
                }else {
                    facebookLoginStatus();
                    console.log('FB已存在，未获取到用户token');
                }
            }else {
                console.log('FB未成功初始化, 添加监听');
            }
        };

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
