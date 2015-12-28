
// tabs展示列表控制器
app.controller('TabList', [
    '$scope',
    'storage',
    function ($scope, storage) {

        // @method 获取tab总数
        function getTotal (tabGroups) {
            var total = 0;
            for (var key in tabGroups) {
                for (var k in tabGroups[key].tabsMeta) {
                    total++;
                }
            }
            return total;
        }

        // @method 初始化数据
        function init () {
            $scope.tabGroups = storage.getState().tabGroups || [];
            $scope.total = getTotal($scope.tabGroups);
            $scope.language = {
                tabs : chrome.i18n.getMessage('tabs'),
                createTime : chrome.i18n.getMessage('createTime'),
                restoreAll : chrome.i18n.getMessage('restoreAll'),
                deleteAll : chrome.i18n.getMessage('deleteAll'),
                rename_group : chrome.i18n.getMessage('rename_group'),
                lock_group : chrome.i18n.getMessage('lock_group'),
                unlock_group : chrome.i18n.getMessage('unlock_group')
            };
        }

        /*
        * 修改组name
        * */
        (function () {
            // 正在编辑的组数据
            var currentEditGroupData = null;
            // 正在编辑的组Dom
            var currentEditGroupDom = null;

            // 每次click事件,事件源如果不是修改name按钮,则触发save-input事件
            $(document).on('click', function (e) {
                if ($(e.target).hasClass('btn-rename') || $(e.target).hasClass('group_info_input')) {
                    return true;
                }
                $(this).trigger('save-input');
            });

            // @method 添加修改名称事件监听
            function addSaveEvent () {
                $(document).on('save-input', function (e) {
                    $scope.$apply(function () {
                        saveInput();
                    });
                });
            }

            // @method 保存组名称
            function saveInput () {
                // 保存后则取消修改名称事件
                $(document).unbind('save-input');
                currentEditGroupData.name = currentEditGroupDom.find('.group_info_input').val();
                currentEditGroupDom.find('.group_info_name').show();
                currentEditGroupDom.find('.group_info_input').attr('type', 'hidden');
                storage.setState({
                    tabGroups : $scope.tabGroups
                });
            }

            // @method 修改组名称
            $scope.rename = function (group, index) {
                if (currentEditGroupData && currentEditGroupDom) {
                    saveInput();
                }
                currentEditGroupData = group;
                var $group = currentEditGroupDom = $('.tab-groups').eq(index);
                $group.find('.group_info_name').hide();
                $group.find('.group_info_input').attr('type', 'text');
                addSaveEvent();
            };
        })();

        /*
         * @method 获取网站url域名
         * @param {String} url 要获取的url
         * @return (String) host
         * */
        $scope.getUrlHost = function (url) {
            if (url.indexOf('://') == -1) {
                url = 'http://' + url;
            }
            url = url.substring(url.indexOf('://') + '://'.length);
            if (url.indexOf('/') != -1) {
                url = url.substring(0, url.indexOf('/'));
                return url.toLowerCase();
            }
        };

        // @method 给组上锁
        $scope.lockAll = function (group) {
            group.lock = 'true';
            storage.setState({
                tabGroups : $scope.tabGroups
            });
        };

        // @method 给组解锁
        $scope.cancelLockAll = function (group) {
            delete group.lock;
            storage.setState({
                tabGroups : $scope.tabGroups
            });
        };

        /*
        * @method 删除某个tab
        * @param {Array} group 组
        * @param {String} tabIndex tab的index角标
        * */
        $scope.remove = function (group, tabId) {
            var temTab = null;

            // 改组是否已上锁
            if (group.lock == 'true') {
                return;
            }

            for (var i = 0; i < group.tabsMeta.length; i++) {
                temTab = group.tabsMeta[i];
                if (temTab.id == tabId) {

                    // tab是否已上锁
                    if (temTab.lock == 'true') {
                        return;
                    }

                    // 删除该tab
                    group.tabsMeta.splice(i, 1);
                    if (!group.tabsMeta.length) {
                        $scope.removeAll(group.id);
                    }
                    $scope.total--;
                    storage.setState({
                        tabGroups : $scope.tabGroups
                    });
                    break;
                }
            }
        };

        /*
        * @method 打开指定的单个tab
        * @param {String} groupId tabs组ID
        * @param {String} tabId tabID
        * */
        $scope.open = function (group, tabIndex) {
            var temTab = group.tabsMeta[tabIndex];
            if (temTab) {
                chrome.tabs.create({
                    url : temTab.url
                }, function () {
                    $scope.$apply(function () {
                        $scope.remove(group, temTab.id);
                    });
                });
            }
        };

        /*
         * @method 删除一组tab
         * @param {String} groupId 组ID
         * */
        $scope.removeAll = function (groupId) {
            for (var key in $scope.tabGroups) {
                if ($scope.tabGroups[key].id == groupId) {
                    // 组是否已上锁
                    if ($scope.tabGroups[key].lock == 'true') {
                        return;
                    }
                    // 删除该组
                    $scope.tabGroups.splice(key, 1);
                    $scope.total = getTotal($scope.tabGroups);
                    storage.setState({
                        tabGroups : $scope.tabGroups
                    });
                    break;
                }
            }
        };

        /*
        * @method 打开一组tab
        * @param {String} groupId tabs组ID
        * */
        $scope.openAll = function (groupId) {
            var temTab = null, temGroup = null;

            // 遍历组
            for (var key in $scope.tabGroups) {
                temGroup = $scope.tabGroups[key];
                if (temGroup.id == groupId) {

                    // 遍历tabs
                    for (var i = 0; i < temGroup.tabsMeta.length; i++) {
                        temTab = temGroup.tabsMeta[i];

                        // 创建标签页
                        chrome.tabs.create({
                            url : temTab.url
                        }, function (tab) {
                            return function () {
                                $scope.$apply(function () {
                                    $scope.remove(temGroup, tab.id);
                                });
                            };
                        }(temTab));
                    }
                    break;
                }
            }
        };

        init();
    }
]);
