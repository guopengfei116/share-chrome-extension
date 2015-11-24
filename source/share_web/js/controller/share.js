niceShare.Controller.controller('shareCtrl', [
    '$scope',
    function ($scope) {

        // 关闭按钮
        $scope.cancel = function () {
            var data = {
                iframe : false
            };
            top.postMessage(data, "*");
        };
    }
]);