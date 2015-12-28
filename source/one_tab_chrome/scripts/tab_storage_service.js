var app = angular.module('app', []);

app.factory('storage', [
    function () {
        return  {
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
    }
]);