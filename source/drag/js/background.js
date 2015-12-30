var appid = 2111201863;
var cxg = window.cxg || {};


var _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-71021863-1"]);


/**
 * [cxg.extend description] 合并项 cxg.extend({a:1,b:2,c:2,d:3},{d:5,f:6,e:70})
 * @param  {[type]} defined [description] 默认选项卡
 * @param  {[type]} options [description] 需要合并选项卡
 * @return {[type]}         [description]
 */
cxg.extend = function(defined,options){
    var obj = {};
    for(var key in defined){
        obj[key] = defined[key];
    }

    for(var k in options){
        obj[k] = options[k];
    }
    return obj;
};

/**
 * [_join description] 对象转化为字符串  _join({a:1,b:2,c:2});
 * @param  {[type]} data [description] 转化对象
 * @return {[type]}      [description]
 */
cxg.join = function(data){
    if (!data || typeof data !== 'object') {
        return '';
    }
    var str = '',i = 0;
    for(var key in data){
        if(i == 0) str += key + '=' + data[key];
        else  str += '&' + key + '=' + data[key];
        i++;
    }
    return str;
};

/**
 * [ajax description] 异步请求
 * @return {[type]} [description]
 */
cxg.ajax = function(obj){
    //默认值设置
    var defined = {
        url : null,
        data : {},
        success : null,
        error : null,
        async : true,
        type : 'GET',
        dataType : 'json',
        headers : null
    };

    //合并项
    var opt = cxg.extend(defined,obj);
    opt['type'] = opt['type'].toUpperCase();

    //没有传链接地址不处理
    if (!opt.url) {
        return;
    }

    //只处理GET和POST请求
    if (opt.type !== 'GET' && opt.type !== 'POST') {
        return;
    }

    //当时get请求的时候参数处理
    if (opt.type === 'GET') {
        var strData = cxg.join(opt.data);
        opt.url = opt.url.indexOf('?') > -1 ? opt.url + '&' + strData : opt.url  +'?' + strData;
    }else{
        var strData = cxg.join(opt.data);
    }

    //创建请求对象
    var _XHR = new XMLHttpRequest();

    //获取请求状态
    _XHR.onreadystatechange = function() {
        if (_XHR.readyState == 4 && _XHR.status == 200) {
            if (typeof opt.success == 'function') {
                if(opt.dataType == 'json') opt.success(eval('(' + _XHR.responseText + ')'));
                else if(opt.dataType == 'html') opt.success(_XHR.responseText);
            }
        }
        if (_XHR.readyState == 4 && _XHR.status != 200) {
            if (typeof opt.error == 'function') {
                opt.error(_XHR);
            }
        }
    };

    //打开请求通道
    _XHR.open(opt.type, opt.url, opt.async);

    //设置请求头
    if (opt.headers) {
        for (var key in opt.headers) {
            _XHR.setRequestHeader(String(key), String(opt.headers[key]));
        }
    }

    //发送请求
    if(opt.type == 'GET') var sendData = null;
    else{
        var sendData = strData;
        _XHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    _XHR.send(sendData);
};

var url = "http://127.0.0.1:7777/uid";
cxg.ajax({
    url : url,
    success : function(ret){
        // 如果egg有uuid则用egg的uuid，没有自己生成uuid
        if( ret.uid ){
            localStorage.uuid = ret.uid;
            // 自己生成uuid
        }else{
            if( !localStorage.uuid ){
                var id = '';
                chrome.management.getAll(function (json){
                    for(var i=0 ; i<json.length ; i++){
                        if( json[i].name == chrome.i18n.getMessage("chrome_extension_name") ){
                            id = json[i].id;
                        }
                    }
                    function rnd(n, m){
                        return parseInt(n+Math.random()*(m-n));
                    }
                    var random = rnd(100,999);
                    var uuid = "autoid_" + id +'_' + new Date().getTime() + '_' + random;

                    localStorage.uuid = uuid;
                });
            }
        }
    },
    error : function(ret){
        if( !localStorage.uuid ){
            var id = '';
            chrome.management.getAll(function (json){
                for(var i=0 ; i<json.length ; i++){
                    if( json[i].name == chrome.i18n.getMessage("chrome_extension_name") ){
                        id = json[i].id;
                    }
                }
                function rnd(n, m){
                    return parseInt(n+Math.random()*(m-n));
                }
                var random = rnd(100,999);
                var uuid = "autoid_" + id +'_' + new Date().getTime() + '_' + random;

                localStorage.uuid = uuid;
            });
        }
    }
});

var oDate = new Date(),
    oldDate = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate();
// 广义DAU
if( !localStorage.Time && localStorage.uuid ){
    localStorage.Time = oldDate;
    updata("visit",localStorage.uuid );
}else if( localStorage.Time != oldDate && localStorage.uuid ){
    var newDate = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate();
    localStorage.Time = newDate;
    updata("visit",localStorage.uuid );
    // 删除localStorage.adId
    delete localStorage.adId;
}

// 安装上报
if( !localStorage.install && localStorage.uuid ){
    try{
        mData.push(['send',"install", {
            appid:'2111201863',
            uuid : localStorage.uuid
        }]);
        _gaq.push(["_trackEvent", "new_user", localStorage.uuid]);
    }catch(e){
        console.log(e);
    }
    localStorage.install = 'true';
}

/**
 * [updata description]
 * @param  {[type]} sEvent 事件名
 * @param  {[type]} uuid   uuid
 * @return {[type]}        [description]
 */
function updata(sEvent, uuid){
    try {
        mData.push(['send',sEvent, {
            appid:'2111201863',
            uuid : uuid
        }]);
        _gaq.push(["_trackEvent", sEvent, uuid]);
    } catch(e){
        console.log(e)
    }
}

