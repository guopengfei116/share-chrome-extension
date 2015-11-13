window.fbAsyncInit = function() {
    console.log(1);
    FB.init({
        appId      : '1652508341698746',
        xfbml      : true,
        version    : 'v0.1'
    });
    console.log(2);
};
console.log(8857);
(function(d, s, id){
    console.log(3);
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk/debug.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var bgPage = chrome.extension.getBackgroundPage();
bgPage.pengfei = 