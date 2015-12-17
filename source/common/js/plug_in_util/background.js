
// 上报广义DAU
Report.oneDayOne('visit');
// 上报安装
Report.onlyOne('install');

/*
* 监听插件icon点击事件
* */
chrome.browserAction.onClicked.addListener(function (tab) {

    // 启动通知
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {greeting: "login"}, function (response) {
            console.log(response);
        });
    });

    // 上报插件启动事件
    Report.oneDayOne('runNiceShare');
});
