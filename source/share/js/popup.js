
/*
* 监听icon事件
* */
$('#share').on('click', function () {
    // 获取背景页window对象
    var bgPage = chrome.extension.getBackgroundPage();

    function saveTabData(tab, data) {
        if (tab.incognito) {
            bgPage[tab.url] = data; // Persist data ONLY in memory
        } else {
            localStorage[tab.url] = data; // OK to store data
        }
    }
    console.log(bgPage.location.href);

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {greeting: "login"}, function(response) {
            console.log(response);
        });
    });
});
