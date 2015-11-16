

require('./libs/jquery-2.1.1.min.js');

window.fbAsyncInit = function() {
    console.log(1);
    FB.init({
        appId      : '1652508341698746',
        xfbml      : true,
        version    : 'v2.5'
    });
};
