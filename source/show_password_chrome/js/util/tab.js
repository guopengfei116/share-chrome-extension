/*
* tab操作类
* */
function Tab () {

    // get全部tabs
    this.getInPlugInTab = function () {
        var allTabs = [];
        chrome.windows.getAll({
            populate: true
        }, function (windows) {
            for (var i = 0; i < windows.length; ++i) {
                chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
                    for (var i = 0; i < tabs.length; ++i) {
                        this.allTabs.push(tabs[i]);
                    }
                });
            }
            return allTabs;
        });
    };

    // 全部tabs
    this.allTabs = this.getInPlugInTab() || [];

    // 向所有tabs发送消息
    this.send = function (message, data) {
        chrome.tabs.sendMessage(
            tab.id, {
                message: message,
                options: data
            }
        );
    };
}
