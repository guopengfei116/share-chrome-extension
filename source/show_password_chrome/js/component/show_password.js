
/*
 * 显示密码
 * */
function ShowPassword () {

    // 数据初始化
    this.behave = '';
    this.delay = 500;
    this.defaultBehave = 'mouseOver';
    this.eventMapTable = {
        1 : "mouseOver",
        2 : "dbClick",
        3 : "focus",
        4 : "focusAndCtrl"
    };

    // 事件处理
    var bing = {
        $inputs : $('input[type=password]'),
        // 鼠标移入显示
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
            self.mouseOut();
        },
        // 鼠标移出恢复
        mouseOut : function () {
            var self = this;
            self.$inputs.on('mouseout', function () {
                this.isMouseOver = false;
                this.type = 'password';
            });
        },
        // 双击显示
        dbClick : function () {
            var self = this;
            self.$inputs.on('dblclick', function () {
                if(this.type === 'password') {
                    this.type = 'text';
                }else {
                    this.type = 'password';
                }
            });
            self.blur();
            self.enter();
        },
        // 焦点显示
        focus : function () {
            var self = this;
            self.$inputs.on('focus', function () {
                this.type = 'text';
            });
            self.blur();
            self.enter();
        },
        // 焦点加ctrl显示
        focusAndCtrl : function () {
            var self = this;
            self.$inputs.on('keydown', function (e) {
                if(e.keyCode == 17) {
                    if(this.type === 'password') {
                        this.type = 'text';
                    }else {
                        this.type = 'password';
                    }
                }
            });
            self.blur();
            self.enter();
        },
        // 失焦恢复
        blur : function () {
            var self = this;
            self.$inputs.on('blur', function () {
                this.type = 'password';
            });
        },
        // 回车恢复
        enter : function () {
            var self = this;
            self.$inputs.on('keydown', function (e) {
                if(e.keyCode == 13) {
                    this.type = 'password';
                }
            });
        },
        // 清除事件绑定
        unbind : function () {
            this.$inputs.unbind();
        }
    };

    // 销毁功能
    this.destroy = function () {
        bing.unbind();
    };

    // 获取最新的操作事件类型
    this.getBehave = function () {
        return this.defaultBehave;
    };

    // 初始化绑定事件
    this.init = function () {
        var behave = '', self = this;
        chrome.storage.sync.get(function (data) {
            if(!data.open) {
                console.log('未开启');
                return;
            }
            if(data.behave) {
                behave = self.eventMapTable[data.behave];
            }else {
                behave = self.getBehave();
            }
            if(!bing[behave]) {
                throw behave + ':操作方式不存在';
            }
            bing[behave]();
        });
    };

    // 修改绑定事件类型
    this.changeBehave = function () {
        bing.unbind();
        this.init();
    };
}
