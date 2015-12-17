
(function () {
    /**
     * [description] 新打开页面时把localStorage.adId传过去
     * @param  {[type]} tabId    [description]
     * @param  {[type]} status   [description]
     * @param  {[type]} tabInfo) {               if(status.status [description]
     * @return {[type]}          [description]
     */
    chrome.tabs.onUpdated.addListener(function(tabId,status,tabInfo) {
        var aAdId = [],
            oAdId = localStorage.adId ? JSON.parse(localStorage.adId) : '';
        for(var name in oAdId){
            if( oAdId[name] >= 30 ){
                aAdId.push(name);
            }
        }
        if(status.status == 'complete'){
            var tab = chrome.tabs.connect(tabId);
            tab.postMessage( aAdId );
        }
    });

    /**
     * 获取广告ID[description]
     * @param  {[string]} request     [description]
     * @param  {[type]} sender        [description]
     * @param  {[type]} sendResponse) [description]
     * @return {[type]}               [description]
     */
    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var plugId = request.adId;
        var adId = localStorage.adId ? JSON.parse( localStorage.adId ) : '';
        // localStorage中是否有adid
        if( adId ){
            // localStorage.adid中是否有当前广告id
            // 如果有则count+1
            if( adId[plugId] ){
                adId[plugId] = parseInt(adId[plugId])+1;
                localStorage.adId = JSON.stringify(adId);
                // 如果没有则设置初始值1
            }else{
                var json = {};
                json[plugId] = 1;
                var newAdId = $.extend(json, adId);
                localStorage.adId = JSON.stringify(newAdId);
            }
            // 如果没有adid则把当前广告设置初始值1
        }else{
            var json = {};
            json[plugId] = 1;
            localStorage.adId = JSON.stringify(json);
        }
    });
})();
