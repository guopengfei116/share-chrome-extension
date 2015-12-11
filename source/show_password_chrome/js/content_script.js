
$(function () {
    function ShowPassword () {

        // 数据初始化
        this.behave = '';
        this.delay = 500;

        // tab类
        var tabCrl = new Tab();
        this.$inputs = $('input[type=password]');

        // 事件管理
        var bing = {
            showPassword : function (target) {

            },
            mouseOver : function () {
                var self = this;
                self.$inputs.on('mouseover', function () {
                    var input = this;
                    input.isMouseOver = true;
                    setTimeout(function () {
                        if(input.isMouseOver) {
                            input.type = 'text';
                        }
                    }, self.delay);
                });
            },
            dbClick : function () {

            },
            focus : function () {

            },
            ctrlKeyDown : function () {

            },
            cancel : function () {
                $inputs.unbind();
            }
        };

        // 获取最新的操作事件类型
        this.getBehave = function () {
            var behave = '';
            chrome.storage.sync.get(function (data) {
                if(data.behave) {
                    behave = data.behave;
                }
            });
            return behave;
        };

        // 初始化绑定事件
        this.init = function () {
            this.behave = this.getBehave();
            if(!bing[this.behave]) {
                throw '操作方式不存在';
            }
            bing[this.behave]();
        };

        // 修改绑定事件类型
        this.changeBehave = function () {
            bing.cancel();
            this.init();
        };
    }

    // 启动
    var showPassword = new ShowPassword();
    showPassword.bind();
});
