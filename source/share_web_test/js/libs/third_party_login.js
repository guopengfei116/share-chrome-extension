/*
 * OAS Javascript Library
 */

$(document).ready(function(){
    // Run
    OAS_GAMES_JS.main();
})

var OAS_GAMES_JS = {
    // facebook api
    facebook : {},
    google   : {},
    tool     : {

        _p : function(data){
            if(window.console) window.console.info(data);
        },

        ajaxRequest : function(url,callback){
            if(url == null || url.length == 0){
                alert('ajaxRequest: url is null'); return;
            }
            if(url.indexOf('?') > -1){
                url += "&callback=?";
            }
            else{
                url += "?callback=?";
            }
            $.getJSON(
                url,
                function(data){
                    callback(data);
                }
            );
        },
        getCookie: function(c_name){
            var i,x,y;
            var ARRcookies=document.cookie.split(";");
            for (i=0;i<ARRcookies.length;i++){
                x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x=x.replace(/^\s+|\s+$/g,"");
                if (x==c_name){
                    return unescape(y);
                }
            }
        },
        setCookie: function(c_name,value,exdays){
            var exdate=new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
            document.cookie=c_name + "=" + c_value + ';path=/; domain=' + GSY.config.get('domain');
        }
    },
    main: function(){
        OAS_GAMES_JS.facebook.init();
        OAS_GAMES_JS.google.init();
    }
};


//--- Facebook combine ---

OAS_GAMES_JS.facebook.init = function(){

    //'oas_lp_language=pt-br'
    var fbLang = 'en_US';
    var lang   =  GSY.config.get('lang');

    if(lang == 'cn'){
        fbLang = 'zh_CN';
    }
    if(lang == 'br'){
        fbLang = 'pt_BR';
    }
    if(lang == 'tr'){
        fbLang = 'tr_TR';
    }
    if(lang.indexOf('es') == 0){
        fbLang = 'es_ES';
    }
    if(lang == 'pt'){
        fbLang = 'pt_PT';
    }

    // Additional JS functions here
    window.fbAsyncInit = function() {
        FB.init({
            appId      : siteConfig.fb_appid ? siteConfig.fb_appid : '528596217154255', // App ID
            oauth      : true,
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
        });
    };

    // Load the SDK Asynchronously
    /*(function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/"+fbLang+"/all.js";
     ref.parentNode.insertBefore(js, ref);
     }(document));*/
};

OAS_GAMES_JS.facebook.login = function(options,retCallback){

    var ucCallback = function(data){
        if(typeof retCallback == 'function'){
            retCallback(data,options,'fb');
        }else{
            if(data.status == 'ok'){
                var reHref = document.location.href;
                if(reHref.indexOf('?') > -1){
                    reHref += "&fbfirst=";
                }
                else{
                    reHref += "?fbfirst=";
                }
                reHref += data.val.fbfirst
                // refresh page
                document.location.href = reHref;
            }
            else{
                OAS_GAMES_JS.tool._p({'uc':'login fail','data':data});
                alert(options.fail + '!');
            }
        }
    };

    var fbCallback = function(response){
        var ucFbLogin = "http://passport.oasgames.com/index.php?m=fbAPILogin&access_token=" + response.authResponse.accessToken;
        OAS_GAMES_JS.tool.ajaxRequest(ucFbLogin,ucCallback);
    };




    //递归处理方法
    var login = function(){
        if(typeof FB != 'undefined'){
            FB.login(function(response) {
                if (response.authResponse) {
                    //OAS_GAMES_JS.tool._p(response);
                    fbCallback(response);
                }
                else {
                    //OAS_GAMES_JS.tool._p(response);
                    alert(options.fail);
                }
            });
//			},{scope:'email,publish_actions,user_likes'});
        }else{
            setTimeout(function(){
                login();
            },2000);
        }
    }
    login();


};




//--- Google combine ---

OAS_GAMES_JS.google.init = function(){

    document.domain = GSY.config.get('domain');

    // Load the SDK Asynchronously
    (function(d){
        var js, id = 'google-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//res.oasgames.com/platform/resource/googleCnn/gwt-oauth3.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));
};

OAS_GAMES_JS.google.login = function(options,retCallback){

    var google_appid = siteConfig.google_appid ? siteConfig.google_appid : '684208335311';
    var GOOGLE_AUTH_URL  = "https://accounts.google.com/o/oauth2/auth";
    var GOOGLE_CLIENT_ID = google_appid + ".apps.googleusercontent.com";
    var PLUS_ME_SCOPE1   = "https://www.googleapis.com/auth/userinfo.email";
    var PLUS_ME_SCOPE2   = "https://www.googleapis.com/auth/plus.me";

    var req = {
        "authUrl"  : GOOGLE_AUTH_URL,
        "clientId" : GOOGLE_CLIENT_ID,
        "scopes"   : [ PLUS_ME_SCOPE1,PLUS_ME_SCOPE2 ]
    };

    var gCallbackSucc = function(token){
        var ucGLogin = "http://passport.oasgames.com/index.php?m=googleLogin&access_token=" + token;
        OAS_GAMES_JS.tool.ajaxRequest(ucGLogin,ucCallback);
    };

    var gCallbackFail = function(error){
        alert("Error:\n" + error);
    };

    var ucCallback = function(data){

        if(typeof retCallback == 'function'){
            retCallback(data,options,'google');
        }else{
            if(data.status == 'ok'){
                var reHref = document.location.href;
                if(reHref.indexOf('?') > -1){
                    reHref += "&fbfirst=";
                }
                else{
                    reHref += "?fbfirst=";
                }
                reHref += data.val.fbfirst
                // refresh page
                document.location.href = reHref;
            }
            else{
                OAS_GAMES_JS.tool._p({'uc':'login fail','data':data});
                alert(message.fail + '!');
            }
        }
    };

    //递归处理方法
    var login = function(){
        if(typeof oauth2 != 'undefined'){
            oauth2.login(req, gCallbackSucc,gCallbackFail);
        }else{
            setTimeout(function(){
                login();
            },2000);
        }
    }
    login();
};



//--- twitter combine ---
OAS_GAMES_JS.twitter = {
    loginMsg: '',
    loginWindow: null
};

OAS_GAMES_JS.twitter.login = function(options,retCallback){
    options['callback'] =  retCallback;
    OAS_GAMES_JS.twitter.loginMsg = options;
    var reqHost    = window.location.host;
    var twitter_appid = siteConfig.twitter_appid ? '&site=' + siteConfig.twitter_appid : '';
    var ucLoginUrl = 'http://passport.oasgames.com/index.php?a=twitter&m=startLogin&r_host=' + reqHost + twitter_appid;
    OAS_GAMES_JS.twitter.loginWindow = window.open(ucLoginUrl,"TwitterLogin","height=650,width=750,scrollbars=no,resizable=no");
};

OAS_GAMES_JS.twitter.loginCallback = function(loginKey,loginRes,fbfirst){
    OAS_GAMES_JS.twitter.loginWindow.close();
    if(loginRes == 'ok'){
        GSY.util.ajax({
            url : 'http://passport.oasgames.com/index.php?m=getLoginUser',
            data : {oas_user : loginKey},
            success : function(ret){
                OAS_GAMES_JS.twitter.loginMsg.callback(ret,OAS_GAMES_JS.twitter.loginMsg,'twitter');
                var reHref = document.location.href;
                if(reHref.indexOf('?') > -1){
                    reHref += "&fbfirst=";
                }
                else{
                    reHref += "?fbfirst=";
                }
                reHref += fbfirst
                // refresh page
                document.location.href = reHref;
            },
            error : function(){
                alert(OAS_GAMES_JS.twitter.loginMsg.fail + '!');
            }
        });





    }
    else{
        alert(OAS_GAMES_JS.twitter.loginMsg.fail + '!');
    }

};