
/*
* 监听插件icon点击事件
* */
chrome.browserAction.onClicked.addListener(function (tab) {

    // 获取背景页window对象
    var bgPage = chrome.extension.getBackgroundPage();

    function saveTabData(tab, data) {
        if (tab.incognito) {
            bgPage[tab.url] = data; // Persist data ONLY in memory
        } else {
            localStorage[tab.url] = data; // OK to store data
        }
    }

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {greeting: "login"}, function (response) {
            console.log(response);
        });
    });

    // 上报插件启动事件
    Report.oneDayOne('runNiceShare');

    /*chrome.extension.sendMessage(null, {greeting: "login"}, function () {
        console.log(arguments);
    });*/
});

// 上报浏览器启动事件
Report.oneDayOne('visit');
