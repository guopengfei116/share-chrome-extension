

require('./libs/jquery-2.1.1.min.js');

window.fbAsyncInit = function() {
    console.log(1);
    FB.init({
        appId      : '1652508341698746',
        status     : true,
        xfbml      : true,
        version    : 'v2.5'
    });
    FB.Event.subscribe('auth.authResponseChange', function(response) {
        if (response.status === 'connected') {
            alert('已经登录了。请跳转')
        } else if (response.status === 'not_authorized') {//登录了facebook没有登录我们的应用
            FB.login();
        } else {
            FB.login();
        }
    });
};

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
});


(function(d, s, id){
    console.log(3);
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk/debug.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

