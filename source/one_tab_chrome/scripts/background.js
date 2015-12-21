
// 延迟一分钟上报
setTimeout(function () {
    // 上报广义DAU
    Report.oneDayOne('visit');
}, 1000 * 61);

// 上报安装量
chrome.runtime.onInstalled.addListener(function (result) {
    if(result.reason === 'install') {
        Report.onlyOne('install');
        console.log('安装');
    }
});

/*
 * 绑定icon事件监听
 * */
chrome.browserAction.onClicked.addListener(function () {
    // 上报插件启用事件
    Report.oneDayOne('click_icon');
});
