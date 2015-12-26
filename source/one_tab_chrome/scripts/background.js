
/*
* id管理
* */
var Id = {
    get : function () {
        if (!localStorage.idCounter) {
            localStorage.idCounter = 0;
        }
        localStorage.idCounter = parseInt(localStorage.idCounter) + 1 + '';
        return parseInt(localStorage.idCounter);
    }
};

/*
* 本地化存储
* */
var storage = {

    // 创建一个state
    createState : function (stateKey, info) {
        var state = this.getState();
        if (!state[stateKey]) {
            state[stateKey] = [];
        }
        state[stateKey].push(info);
        this.setState(state);
    },

    // 获取state
    getState : function () {
        if(!localStorage.state) {
            return {};
        }else {
            return JSON.parse(localStorage.state);
        }
    },

    // 储存state
    setState : function (state) {
        var oldState = this.getState();
        var newTabGroups = state.tabGroups;

        // 删除tabsMeta为空的tabGroup
        for (var i = 0; i < newTabGroups.length; i++) {
            if (!newTabGroups[i].tabsMeta.length) {
                newTabGroups.splice(i, 1);
                i--;
            }
        }

        localStorage.state = JSON.stringify(state);

        /*for (var key in JQ) {
            JQ[key](state);
        }*/

        // 测试存储数据是否可用
        try {
            JSON.parse(localStorage.state);
        } catch (e) {
            localStorage.state = oldState;
            alert('Out of local storage memory - could not store extension state');
        }
    },

    // 获取配置信息
    getSettings : function () {
        if(!localStorage.settings) {
            return {};
        }else {
            return JSON.parse(localStorage.settings);
        }
    },

    // 添加tabs到指定groupId，没找到则新建id
    pushTabsById : function (groupId, tabs) {
        var state = this.getState();
        var groups = state.tabGroups;

        // 空数据
        if (groups) {
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];

                // 如果id和tabGroupsId相等，则把tabs数据push到该tabGroup里
                if (group.id == groupId) {
                    for (var key in tabs) {
                        group.tabsMeta.push(tabs[key]);
                    }
                    this.setState(state);
                    return true;
                }
            }
        }

        // 如果没有找到对应的groupId，则创建一个group
        this.createState('tabsGroups', {
            id : Id.get(),
            tabsMeta : tabs,
            createDate : new Date().getTime()
        });
    },

    // 在已存数据里排重
    isExisting : function (url) {
        var tabGroups = storage.getState().tabGroups;
        var temTabsMeta = null;
        for (var j = 0; j < tabGroups.length; j++) {
            temTabsMeta = tabGroups[j].tabsMeta;
            for (var i = 0; i < tamTabsMeta.length; i++) {
                if (tamTabsMeta[i].url === url) {
                    return true;
                }
            }
        }
        return false;
    }
};

/*
 * 路径操作
 * */
var Path = {

    /*
     * 获取tabs页面URL
     * */
    getUrl : function () {
        return chrome.runtime.getURL('tabs.html');
    },

    /*
     * 检查页面url是否为本插件文件地址
     * */
    isSelfFile : function (path) {
        var onetabPath = this.getUrl();
        return path.indexOf(onetabPath) == 0;
    }
};

/*
* 标签操作
* */
var Tab = {
    /*
     * @method 只打开或留下一个tab列表页
     * */
    updateTabPage : function (reload, cbk) {          // vQ   TV
        chrome.tabs.query({}, function (tabs) {
            var activeTab = null;

            // 只留一个插件列表页面
            for (var i = 0; i < tabs.length; i++) {
                var temTab = tabs[i];
                var url = temTab.url;
                if(Path.isSelfFile(url)) {
                    if(activeTab) {
                        chrome.tabs.remove(activeTab.id);
                    }else {
                        activeTab = temTab;
                    }
                }
            }

            // 如果存在插件列表页面，则放置到最前端
            if (activeTab) {
                if (reload) {
                    chrome.tabs.reload(activeTab.id, {}, function () {
                        cbk && cbk();
                    });
                }
                chrome.tabs.update(activeTab.id, {
                    selected : true
                }, function () {
                    chrome.windows.update(activeTab.windowId, {
                        focused : true
                    }, function () {
                        cbk && cbk();
                    })
                });
            }else {
                chrome.tabs.create({
                    url : Path.getUrl(),
                    selected : true
                }, function (tab) {
                    console.log(tab);
                    cbk && cbk(tab);
                });
            }
        })
    }
};

/*
* 收藏
* */
var Collect = {

    /*
     * 操作当前窗口到指定的存储的Tab数据id里
     * */
    collectCurrentWindTab : function () {
        var self = this;
        chrome.windows.getLastFocused(function (wind) {
            self.collectWindTabById(wind.id, function (giveUpTabsId) {
                // 关闭已收藏的tab列表
                chrome.tabs.remove(giveUpTabsId, function () {
                });
            });
        });
    },

    /*
     *  收藏指定窗口的tabs
     * */
    collectWindTabById : function (windId, cbk, groupId) {
        var self = this;
        chrome.tabs.query({
            windowId : windId
        }, function (tabs) {
            self.collectTab(tabs, true, cbk, groupId);
        });
    },

    /*
     * 储存一组tabs数据
     * */
    collectTab : function (tabs, isExcluded, cbk, groupId) {
        var state = storage.getState();
        var settings = storage.getSettings();
        var tabGroups = state.tabGroups;

        var temTab, temUrl,
            giveUpTabsId = [],
            newTabs = [];

        for (var i = 0; i < tabs.length; i++) {
            temTab = tabs[i];
            temUrl = temTab.url;
            temTitle = temTab.title || temUrl;
            temPinned = temTab.pinned ? true : '';

            // 过滤插件自身的页面
            if (Path.isSelfFile(temUrl)) {
                continue;
            }

            // 添加到待删除tab队列
            giveUpTabsId.push(temTab.id);

            // 排重
            if (settings.duplicates == 'reject') {

                // 在已存储数据中排重
                if (storage.isExisting(temUrl)) {
                    continue;
                }

                // 在当前tab组数据中排重
                for (var index in newTabs) {
                    if (newTabs[index].url == temUrl) {
                        continue;
                    }
                }
            }

            // 构建tab数据模型
            var tabModel = {
                id : Id.get(),
                url : temUrl,
                title : temTitle,
                pinned : temPinned
            };

            // 添加到待存储队列
            newTabs.push(tabModel);
        }

        // 存储数据，无groupId则新建一个组
        if (typeof groupId === 'undefined') {
            var autoId = Id.get();
            storage.createState('tabGroups', {
                id : autoId,
                tabsMeta : newTabs,
                createDate : new Date().getTime()
            });
        }else {
            storage.pushTabsById(groupId, newTabs);
        }
console.log(11);
        // 刷新列表页
        Tab.updateTabPage();

        // 把已处理过的tabId传到回调函数，任调用者处理
        cbk(giveUpTabsId);
    }
};

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
    Report.onlyOne('click_icon');
    Collect.collectCurrentWindTab();
});
