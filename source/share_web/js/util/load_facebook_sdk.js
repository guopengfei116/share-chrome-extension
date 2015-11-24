window.fbAsyncInit = function() {
    FB.init({
        // 春争 FBDesktop  548875461811953
        // 郭鹏飞 share  1652508341698746
        appId: '1652508341698746',
        //1652508341698746
        cookie: true,
        status: true,
        oauth: true,
        status: true,
        xfbml: true,
        version: 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk/debug.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));