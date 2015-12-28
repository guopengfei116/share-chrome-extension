
// tabs展示列表控制器
app.controller('TabList', [
    '$scope',
    'storage',
    function ($scope, storage) {
        var tabGroups = storage.getState().tabGroups || [];

        // 获取总数
        function getTotal () {
            var total = 0;
            for (var key in tabGroups) {
                for (var k in tabGroups[key].tabsMeta) {
                    total++;
                }
            }
            return total;
        }

        // 初始化数据
        function init () {
            $scope.tabGroups = tabGroups;
            $scope.total = getTotal();
        }

        /*
         * 获取网站url域名
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

        /*
        * 删除某个tab
        * */
        $scope.remove = function (group, tabIndex) {
            // 改组是否已上锁
            if (group.lock == 'true') {
                return;
            }
            // tab是否已上锁
            if (group.tabsMeta[tabIndex].lock == 'true') {
                return;
            }
            // 删除该tab
            $scope.$apply(function () {
                group.tabsMeta.splice(tabIndex, 1);
                $scope.total--;
                storage.setState({
                    tabGroups : $scope.tabGroups
                });
            });
        };

        /*
        * 打开历史记录
        * */
        $scope.open = function (groupId, tabId) {
            var temTab = null, temGroup = null;
            for (var key in tabGroups) {
                temGroup = tabGroups[key];
                if (temGroup.id == groupId) {
                    for (var k in tabGroups[key].tabsMeta) {
                        temTab = tabGroups[key].tabsMeta[k];
                        if (temTab.id == tabId) {
                            chrome.tabs.create({
                                url : temTab.url
                            }, function () {
                                $scope.remove(temGroup, k);
                            });
                        }
                        break;
                    }
                    break;
                }
            }
        };

        init();
    }
]);