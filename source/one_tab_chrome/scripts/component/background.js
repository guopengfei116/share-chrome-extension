/*
* 更新右键菜单
* */
var contentMenusUpdate = {
    enabledUp : function (id, enabled) {
        chrome.contextMenus.update(id, {
            enabled : enabled
        }. Function);
    },
    checkedUp : function (id, checked) {
        chrome.contextMenus.update(id, {
            checked : checked,
            type : 'checkbox'
        }, Function);
    },
    titleUp : function (id, title) {
        chrome.contextMenus.update(id, {
            title : title
        }, Function);
    }
};

/*
* 路径操作
* */
var path = {

    /*
    * 获取tabs页面URL
    * */
    getUrl : function () {
        return chrome.runtime.gerURL('tabs.html');
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
* 初始化新页面右键菜单
* */
function initNewPageContextMenu () {
    chrome.windows.getLastFocused(function (wind) {
        /*
        * 遍历当前窗口中被选中的tab
        * */
        chrome.tabs.query({}, function (tabs) {
            var activeTab = null, temTab = null;
            for (var key in tabs) {
                temTab = tabs[key];
                if(temTab['windowId'] === wind['id']) {
                    if(temTab['selected']) {
                        activeTab = temTab;
                    }
                }
            }
            if (!activeTab) {
                return;
            }

            // 非自己插件页面启动插件右键菜单
            var url = activeTab.url;
            var isSlefUrl = path.isSelfFile(url);
            contentMenusUpdate.enabledUp(attr.menuId, !isSlefUrl);
        });
    });
};

// 新开页面事件监听
chrome.tabs.onCreated.addListener( function (tab) {
    console.log(tab);
    initNewPageContextMenu();
});


// 初始化右键菜单属性
var attr = {};                                  // CE
function initAttr () {
    attr.menuId = null;     // 右键菜单ID           // O9
    attr.newMenusId = [];   // 新建的菜单ID         // IE
    attr.newLinkMenusId = [];   // 新建的link菜单ID         // XE
}

// 初始化右键菜单属性
function initAttribute () {
    attr.menuId = chrome.contextMenus.create({
        type : 'normal',
        title : 'Display OneTab',
        contexts : [
            'all'
        ],
        onclick : function (info, tab) {

        }
    });
}

/*
 * @method 刷新tab列表页
 * */
function updateTabPage (reload, cbk) {          // vQ   TV
    chrome.tabs.query({}, function (tabs) {
        var activeTab = null;

        // 只留一个插件列表页面
        for (var i = 0; i < tabs.length; i++) {
            var temTab = tabs[i];
            var url = temTab.url;
            if(path.isSelfFile(url)) {
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
                url : path.getUrl()
            }, function () {
                cbk && cbk();
            });
        }
    })
}

// get state
function getState () {                    // lQ
    if(!localStorage.state) {
        return {};
    }else {
        return JSON.parse(localStorage.state);
    }
}

/*
* 对存储的标签进行排序
* */
function tabsSort (tabs) {                 //     RV
    tabs.sort(function (val1, val2) {

        // 如果两个对象至少有一个有starred数据
        if (val1.starred || val2.starred) {

            // 如果两个对象仅有一个有starred数据，则有数据的对象优先前排
            if (!val2.starred) {
                return -1;
            }else if (!val1.starred) {
                return 1;

            // 如果两个对象都有starred数据，则进行数据大小比较，
            }else {
                if (val1.starredDate > val2.starredDate) {
                    return 1;
                }else if (val1.starredDate < val2.starredDate) {
                    return -1;
                }
                return 0;
            }

        // 如果没有starred数据则比较两个对象的创建时间
        }else {

            // 最新创建的对象优先前排
            if (val1.createDate > val2.createDate) {
                return -1;
            }else if (val1.createDate < val2.createDate) {
                return 1;
            }
            return 0;
        }
    });
}

/*
* 获取网站url域名
* */
function getUrlHost (url) {                 // FQ
    if (url.indexOf('://') == -1) {
        url = 'http://' + url;
    }
    url = url.substring(url.indexOf('://') + '://'.length);
    if (url.indexOf('/') != -1) {
        url = url.substring(0, url.indexOf('/'));
        return url.toLowerCase();
    }
}

/*
* 网站域名是否在黑名单内
* */
function hostIsExcluded(host) {             // UQ
    var settings = getSettings();
    if (settings.excludedDomains) {
        for (var domain in settings.excludedDomains) {
            if (settings.excludedDomains[domain] == host) {
                return true;
            }
        }
    }
    return false;
}

/*
* 网站url是否在黑名单内
* */
function urlIsExcluded (url) {              // $E
    return hostIsExcluded(getUrlHost(url));
}

/*
* getSettings
* */
function getSettings () {                                // $V
    if (!localStorage.settings) {
        return {};
    }else {
        return JSON.parse(localStorage.settings);
    }
}

// default settings
var defaultSettings = {
    restoreWindow : 'newWindow',
    pinnedTabs : 'ignore',
    startupLaunch : 'displayOneTab',
    restoreRemoval : 'default',
    duplicates : 'allow'
};


/*
* 获取tab某个属性的配置
* */
function getSettingsByAttr (key) {                           // rV
    var settings = getSettings();
    if (settings[key]) {
        return settings[key];
    }else {
        return defaultSettings[key];
    }
}

/*
* 获取Id
* */
function getId () {                                     // OV
    if (!localStorage.idCounter) {
        localStorage.idCounter = 0;
    }
    localStorage.idCounter = parseInt(localStorage.idCounter) + 1 + '';
    return parseInt(localStorage.idCounter);
}

var JQ = [];                                            // JQ

/*
* 储存状态到localStorage
* */
function setStateForLocalStorage (state) {                         // sV
    var oldState = localStorage.state;
    var newTabGroups = state.tabGroups;

    // 删除tabsMeta为空的tabGroup
    for (var i = 0; i < newTabGroups.length; i++) {
        if (!newTabGroups[i].tabsMeta.length) {
            newTabGroups.splice(i, 1);
            i--;
        }
    }

    localStorage.state = JSON.stringify(state);

    for (var key in JQ) {
        JQ[key](state);
    }

    // 测试存储数据是否可用
    try {
        JSON.parse(localStorage.state);
    } catch (e) {
        localStorage.state = oldState;
        alert('Out of local storage memory - could not store extension state');
    }
}

/*
* 生成一个新的state并储存到localStorage
* */
function createState (stateKey, info) {                             // K
    var state = getState();
    if (!state[stateKey]) {
        state[stateKey] = [];
    }
    state[stateKey].push(info);
    setStateForLocalStorage(state);
}

/*
* @method 收藏所有tabs里网址
* @param {Array} tabs
* @param {Boolean} excludedSwitch
* @param {Function} cbk1 回调
* @param {Number} id
* */
function addTabUrl (tabs, excludedSwitch, cbk, id) {          // cQ
    var state = getState();
    var tabGroups = state.tabGroups;
    tabsSort(tabGroups);

    var collectionTabs = [];

    // 去除黑名单tab，生成可储存的tab列表
    for (var tab in tabs) {
        if (!excludedSwitch) {
            collectionTabs.push(tabs[tab]);
        }else if (!urlIsExcluded(tabs[tab].url)) {
            collectionTabs.push(tabs[tab]);
        }
    }

    var tabInfos = [], nullTabs = [];

    // 判断是否有TabMemFree插件
    for (var i = 0; i < collectionTabs.length; i++) {
        var collectionTab = collectionTabs[i];
        var url = collectionTab.url;
        if (url.indexOf('://tabmemfree.appspot.com') != -1) {
            alert('The OneTab extension is not compatible with TabMemFree. Please ensure that none of your tabs are parked with TabMemFree, then uninstall the TabMemFree extension and restart your web browser before using OneTab.');
            return;
        }
    }

    bye:
    for (var i = 0; i < collectionTabs.length; i++) {
        var collectionTab = collectionTabs[i];
        var url = collectionTab.url;

        // 是否忽略被锁定的tab
        if (collectionTab.pinned && getSettingsByAttr('pinnedTabs') == 'ignore') {
            continue;
        }

        // 判断是否为onetab页
        if (path.isSelfFile(url)) {
            continue;
        }

        if (url == 'chrome://newtab/') {
            nullTabs.push(collectionTab.id);
            continue;
        }

        if (url.indexOf('chrome-devtools://') == 0) {
            continue;
        }

        // 如果不可重复添加tab,则把这些tabId存到nullTabs里
        if (getSettingsByAttr('duplicates') == 'reject') {

            // 在已存储数据中排重
            for (var key in tabGroups) {
                for (var tab in tabGroups[key].tabsMeta) {
                    if (tabGroups[key].tabsMeta[tab].url == url) {
                        nullTabs.push(collectionTab.id);
                        continue bye;
                    }
                }
            }

            // 在当前tab组数据中排重
            for (var obj in tabInfos) {
                if (tabInfos[obj].url == url) {
                    nullTabs.push(collectionTab.id);
                    continue bye;
                }
            }
        }

        // 存储剩余tabId
        nullTabs.push(collectionTab.id);

        // 构建tab信息
        var tabInfo = {
            id : getId(),
            url : url,
            title : collectionTab.title
        };
        if (collectionTab.pinned) {
            tabInfo.pinned = true;
        }

        // 添加tab信息
        tabInfos.push(tabInfo);
    }

    if (typeof id === 'undefined') {
        var autoId = getId();
        createState('tabGroups', {
            id : autoId,
            tabsMeta : tabInfos,
            createDate : new Date().getTime()
        });
    }else {
        // 如果id和tabGroupsId相等，则把tabInfos数据push到该tabGroups里
        for (var i = 0; i < tabGroups.length; i++) {
            var tabG = tabGroups[i];
            if (tabG.id == id) {
                // 把tab信息对象添加到对应的ID里
                for (var key in tabInfos) {
                    tabG.tabsMeta.push(tabInfos[key]);
                }
                break;
            }
        }
        setStateForLocalStorage(state);
    }

    cbk(function () {
       chrome.tabs.remove(nullTabs, function () {
           chrome.runtime.getBackgroundPage(function (wind) {
               wind.updateContextMenuState();
           });
       })
    });
}

/*
*  收藏指定窗口的tabs
* */
function collectWindTabById (windId, cbk1, id) {     // tV
    chrome.tabs.query({
        windowId : windId
    }, function (tabs) {
        addTabUrl(tabs, true, cbk1, id);
    });
}

/*
* 操作当前窗口到指定的存储的Tab数据id里
* */
function collectCurrentWindTab (id) {                                      // cV
    chrome.windows.getLastFocused(function (wind) {
        collectWindTabById(wind.id, function (cbk) {
           updateTabPage(true, cbk);
        }, id);
    });
}

var targetTitle, targetUrl;                     // IQ  GE
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.type == 'linkRightClick') {
       targetUrl = request.url;
       targetTitle = request.title;
   }
});

/*
* addTab
* */
function addTab (cfg, matchId) {                     //     iV
    var state = getState();
    var tabGroups = state.tabGroups;
    tabsSort(tabGroups);

    var marchTab = undefined;
    if (typeof matchId === 'undefined') {
        for (var i = 0; i < tabGroups.length; i++) {
            var tab = tabGroups[i];
            if (tab.starred || tab.locked) {
                continue;
            }
            marchTab = tab;
            g.tabsMeta.splice(0, 0, cfg);
            break;
        }
    }else {
        for (var i = 0; i < tabGroups.length; i++) {
            var tab = tabGroups[i];
            if (tab.id == matchId) {
                marchTab = tab;
                tab.tabsMeta.splice(0, 0, cfg);
                break;
            }
        }
    }

    if (!marchTab) {
        tabGroups.push({
            id : getId(),
            tabsMeta : [
                cfg
            ],
            createDate : new Date().getTime()
        });
    }
    setStateForLocalStorage(state);
}

/*
* 刷新oneTab页面
* */
function reloadOneTabPage (cbk) {                           // fQ
    chrome.tabs.query({}, function (tabs) {
        var oneTab = null;
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var url = tab.url;
            if (path.isSelfFile(url)) {
                oneTab = tab;
                break;
            }
        }
        if (oneTab) {
            chrome.tabs.reload(oneTab.id, {}, function () {
                cbk && cbk();
            });
        }
    });
}

/*
* 构建tab数据结构
* */
function buildTabData (url, title, cbk, matchId) {                      // bQ
    var cfg = {
        id : getId(),
        url : url,
        title : title
    };
    addTab(cfg, matchId);
    cbk(function () {});
}

/*
* 收藏一个tab
* */
function collectTab (url, matchId) {                                          // zQ
    var title = '';
    if (url == targetUrl) {
        title = targetTitle;
    }else {
        title = url;
    }
    buildTabData(url, title, function (cbk) {
        reloadOneTabPage();
        cbk && cbk();
    }, matchId);
}

/*
* 创建菜单列表并初始化
* */
function KQ() {                                             // KQ
    attr.menuId = chrome.contextMenus.create({                      // CE.O9
        type : 'normal',
        title : 'Display OneTab',
        contexts : [
            'all'
        ],
        onclick : function (info, tab) {
            updateTabPage();
        }
    });

    // 收藏当前窗口全部tab
    var newMenuId = chrome.contextMenus.create({                // qJ
        type : 'normal',
        title : 'Send all tabs to OneTab',
        contexts : [
            'all'
        ],
        onclick : function () {
            collectCurrentWindTab();
        }
    });
    attr.newMenusId.push(newMenuId);

    // 收藏当前tab
    var newLinkMenuId = chrome.contextMenus.create({            //  XJ
        type : 'normal',
        title : 'Send this web link to OneTab',
        contexts : [
            'link'
        ],
        onclick : function (info, tab) {
            collectTab(info.linkUrl);
        }
    });
    attr.newLinkMenusId.push(newLinkMenuId);


}

/*
* 初始化右键菜单
* */
function initContextMenus () {
    chrome.contextMenus.removeAll(function () {
        initAttr();

    });
}

chrome.browserAction.onClicked.addListener(function () {
    collectCurrentWindTab();
});
