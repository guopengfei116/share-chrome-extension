

var $ = require('./libs/jquery-2.1.1.min.js');

window.fbAsyncInit = function() {
    FB.init({
        // 春争 FBDesktop  548875461811953
        // 郭鹏飞 share  1652508341698746
        appId      : '686189861434770',
        //1652508341698746
        cookie     : true,
        status     : true,
        oauth      : true,
        status     : true,
        xfbml      : true,
        version    : 'v2.5'
    });

    $(function () {
        $('#feed').on('click', function () {
            FB.ui({
                method: 'feed',
                link: 'https://developers.facebook.com/docs/',
                caption: 'An example caption',
                redirect_uri: location.href
            }, function(response){
                console.log('FB feed');
                console.log(response);
            });
        });

        $('#share').on('click', function () {
            console.log('click share');
            FB.ui({
                method: 'share',
                href: location.href,
                redirect_uri: location.href
            }, function(response){
                console.log('FB share');
                console.log(response);
            });
        });

        $('#graph').on('click', function () {
            console.log('click graph');
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object:'https://developers.facebook.com/docs/',
                }),
            }, function(response){
                console.log('FB graph');
                console.log(response);
                FB.api('/me/feed', 'post', {message: 'Hello, world!'});
            });
        });

        $('#auto-feed').on('click', function () {
            FB.api('/me/feed', 'post', {
                message : 'guopengfei我很高兴啊，怎么了这是',
                image : 'http://www.zhangxinxu.com/image/study/s/s256/mm1.jpg'
            }, function (response) {
                console.log(arguments);
            })
        });

        $('#auto-share').on('click', function () {
            FB.api('/me/share', 'post', {
                message : 'guopengfei我很高兴能够自动分享',
                image : 'http://www.zhangxinxu.com/image/study/s/s256/mm1.jpg'
            }, function (response) {
                console.log(arguments);
            })
        });

        $('#login').on('click', function () {
            /*getLoginStatus();

            FB.api('/me', {
                "fields": "id, name, picture"
            }, function(response) {
                console.log(arguments);
            });



            FB.getAuthResponse(function () {
               console.log(arguments);
            });*/

            FB.login(function(response){
                if (response && response.authResponse) {
                    console.log('Welcome!  Fetching your information.... ');
                    FB.api('/me', {
                        "fields": "id, name, photo"
                    }, function(response) {
                        console.log(arguments);
                        console.log('Good to see you, ' + response.name + '.');
                    });
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
                console.log('login');
                console.log(response);
            }, {
                return_scopes: true,
                enable_profile_selector : true
            });

            FB.getAuthResponse(function (response) {
                console.log(response);
            });


            //, {scope: 'publish_actions'}
        });

        var getLoginStatus = function () {
            console.log('getLoginStatus_befor');
            FB.getLoginStatus(function(response) {
                console.log('getLoginStatus');
                if (response.status === 'connected') {
                    console.log('Logged in.');
                }
                else {
                    console.log('Logged out.');
                    FB.login();
                }
            });
        };

        $('#create-object').on('click', function () {
            FB.api(
                "/me/objects/object",
                "POST",
                {
                    "object": "{\"fb:app_id\":\"548875461811953\",\"og:type\":\"object\",\"og:url\":\"http://www.fbdesktop.com/\",\"og:title\":\"Sample Object\",\"og:image\":\"http:\\\/\\\/www.zhangxinxu.com\\\/image\\\/study\\\/s\\\/s256\\\/mm1.jpg\"}"
                },
                function (response) {
                    if (response && !response.error) {
                        /* handle the result */
                    }
                }
            );
        });

    });

    /*FB.Event.subscribe('auth.authResponseChange', function(response) {
        if (response.status === 'connected') {
            alert('已经登录了。请跳转')
        } else if (response.status === 'not_authorized') {//登录了facebook没有登录我们的应用
            FB.login();
        } else {
            FB.login();
        }
    });

    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI();
        } else if (response.status === 'not_authorized') {
            alert('Please log into this app.');
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            alert('Please log into this app.');
        }
    }

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });*/
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk/debug.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

