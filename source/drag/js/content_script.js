
var options = {};

/*
* 画图类
* */
function Canvas () {
    this.canvasNode = document.createElement('canvas');
    this.canvasCtx = this.canvasNode.getContext('2d');

    this.setCanvasStyle = function (strokeStyle, fillStyle, lineWidth) {
        this.canvasNode.setAttribute('width', window.innerWidth + 'px');
        this.canvasNode.setAttribute('height', window.innerWidth + 'px');
        this.canvasNode.setAttribute('style', 'z-index:888; position:fixed; top:0; left:0; right:0; bottom:0');
        this.canvasCtx.strokeStyle = strokeStyle;
        this.canvasCtx.fillStyle = fillStyle;
        this.canvasCtx.lineWidth = lineWidth;
        this.canvasCtx.save();
    };

    this.show = function (x, y, parentNode) {
        if(!parentNode) {
            return;
        }
        if(parentNode.lastChild != this.canvasNode) {
            parentNode.appendChild(this.canvasNode);
            this.setCanvasStyle('blue', 'width', 6);
        }
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x, y);
    };

    this.hide = function () {
        if(this.hasCanvas) {
            var parentNode = this.canvasNode.parentNode;
            parentNode && parentNode.removeChild(this.canvasNode);
        }
    };

    this.showLineTo = function (x, y, stop) {
        this.canvasCtx.lineTo(x, y);
        this.canvasCtx.stroke();
        if(!stop) {
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(x, y);
        }
    };

    this.hasCanvas = function () {
        return (this.canvasNode.parentNode && this.canvasNode.parentNode.lastChild == this.canvasNode);
    };
}

/*
* 手势类
* */
var Gesture = function () {
    this.running = false;
    this.gestures =  "";        // 动作序列
    this.miss = 0;              // 失败次数
    this.suspended = false;     // 暂停
    this.startTime = 0;
    this.lastCoord = {
        x : -1,
        y : -1
    },
    this.canvas = new Canvas();
};

$.extend(Gesture.prototype, {
    /*
    * 收集手势
    * */
    getGesture : function (e) {
        var differenceX, differenceY, gesture;
        if(this.lastCoord.x < 0 || this.lastCoord.y < 0) {
            this.lastCoord = {
                x : e.clientX,
                y : e.clientY
            }
        }else {
            differenceX = e.clientX - this.lastCoord.x;
            differenceY = e.clientY - this.lastCoord.y;

            // 短操作过滤
            if(differenceX * differenceX + differenceY * differenceY < 512) {
                return;
            }

            // 根据跨度大小判断横纵手势权重
            if(Math.abs(differenceX) > Math.abs(differenceY)) {
                if(differenceX > 0) {
                    gesture = 'R';
                }else {
                    gesture = 'L';
                }
            }else {
                if(differenceY > 0) {
                    gesture = 'D';
                }else {
                    gesture = 'U';
                }
            }

            // 添加手势
            if(this.gestures.length <= 0 || this.gestures.substr(this.gestures.length - 1, 1) !== gesture) {
                this.gestures = this.gestures + gesture;
            }
        }

        // 记录坐标
        this.lastCoord = {
            x : e.clientX,
            y : e.clientY
        };
        return;
    },

    /*
    * 执行操作
    * */
    action : function () {
        switch (this.gestures) {
            case 'R' :              // 右滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    history.forward();
                    return true;
                }
            case 'L' :              // 左滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    history.back();
                    return true;
                }
            case 'D' :              // 下滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    window.scroll(0, document.body.scrollHeight);
                    return true;
                }
            case 'U' :              // 上滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    window.scroll(0, 0);
                    return true;
                }
            case 'DR' :             // 下右L型滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    window.close();
                    return true;
                }
            case 'UD' :             // 上下倒V型滑
                if(this.suspended) {
                    this.reduceError();
                }
                if(!this.suspended) {
                    location.reload(true);
                    return true;
                }
            default :
                this.error();
                return false;
        }
    },

    /*
     * 执行成功后清除痕迹
     * */
    init : function (e) {
        e.preventDefault && e.preventDefault();
        mouseEvents.delMousemove();
        var selection = window.getSelection();
        if(selection.rangeCount) {
            selection.empty();
        }
        this.gestures = '';
        this.canvas.hide();
        this.lastCoord = {
            x : -1,
            y : -1
        }
    },

    /*
    * 操作错误记录
    * */
    error : function () {
        this.miss++;
        if(this.miss >= 2) {
            this.miss = 2;
            this.suspended = true;
        }
    },

    /*
     * 操作正确抵消操作记录
     * */
    reduceError : function () {
        this.miss--;
        if(this.miss <= 0) {
            this.miss = 0;
            this.suspended = false;
        }
    },

    /*
    * 动作开始
    * */
    start : function (e) {
        this.running = true;
        this.startTime = new Date().getTime();
        this.lastCoord = {
            x : e.clientX,
            y : e.clientY
        };
    },

    /*
    * 动作
    * */
    move : function (e) {
        console.log(this.running);
        if(!this.running) {
            mouseEvents.delMousemove();
            this.canvas.hide();     // 防止阻塞造成的move操作后续执行遗留下的痕迹
            return;
        }
        // 移动时间过短
        if(new Date().getTime() - this.startTime < 100) {
            return;
        }

        var selection = window.getSelection(),
            range = null;
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }

        // canvas对象创建失败、无选中区域，如果为文本，则需要开始位置小于文本长度，结束位置小于文本长度
        if(!this.canvas.hasCanvas() && range && range.startContainer == range.endContainer &&
            (range.startContainer.nodeName == '#text' && range.startOffset < range.startContainer.length &&
            range.endOffset < range.endContainer.length || range.startOffset == range.endOffset)
        ) {
            this.cancel();
        }

        this.canvas.show(this.lastCoord.x, this.lastCoord.y, document.body);
        if(this.gestures.length > 3) {
            this.error();
            this.cancel();
            selection.empty();
            return;
        }

        if(this.suspended) {
            return;
        }

        // 记录手势画痕迹
        this.getGesture(e);
        selection.empty();
        this.canvas.showLineTo(this.lastCoord.x, this.lastCoord.y, false);
    },

    /*
    * 动作结束
    * */
    end : function (e) {
        console.log('end');

        if(!this.running) {
            return;
        }

        this.running = false;
        this.getGesture(e);

        // 画图
        if(this.gestures != '') {
            this.canvas.showLineTo(this.lastCoord.x, this.lastCoord.y, true);
            // 执行成功清除状态
            if(this.action()) {
                this.init(e);
            }
            // 执行失败清除状态
            this.gestures = '';
            this.canvas.hide();
            e.preventDefault();
            return;
        }

        // 未达成执行条件
        this.init();
        /*mouseEvents.delMousemove();
        this.lastCoord = {
            x : -1,
            y : -1
        }*/
    },

    /*
    * 销毁动作轨迹
    * */
    cancel : function () {
        this.running = false;
        this.canvas.hide();
    }
});

/*
* 鼠标事件监听控制对象
* */
var mouseEvents = {
    gesture : new Gesture(),

    /*
    * 初始化触发事件
    * 鼠标点击和离开事件
    * */
    init : function () {
        var self = mouseEvents;
        self.addMousedown();
        self.addMouseup();
    },

    /*
    * 事件控制器
    * */
    enter : function (e) {
        var self = mouseEvents;

        // 未开启
        var use_gesture = options['enable_gesture'] === 'true';
        if(!use_gesture) {
            self.gesture.cancel();
            return;
        }

        // 非左键
        if(e.button !== 0) {
            return;
        }

        // 按下ctrl或alt键、上一个动作运行为结束
        if(e.altKey || e.ctrlKey || self.gesture.running) {
            self.gesture.cancel();
            return;
        }

        self.addMousemove();
        self.gesture.start(e);
    },
    letgo : function (e) {
        // 未开启
        var use_gesture = options['enable_gesture'] === 'true';
        if(!use_gesture) {
            self.gesture.cancel();
            return;
        }

        var self = mouseEvents;
        self.gesture.end(e);
    },
    move : function (e) {
        // 未开启
        var use_gesture = options['enable_gesture'] === 'true';
        if(!use_gesture) {
            return;
        }

        var self = mouseEvents;
        self.gesture.move(e);
    },

    /*
    * 事件绑定
    * */
    addMousedown : function () {
        document.addEventListener('mousedown', this.enter, false);
    },
    addMouseup : function () {
        document.addEventListener('mouseup', this.letgo, false);
    },
    addMousemove : function () {
        document.addEventListener('mousemove', this.move, false);
    },
    delMousemove : function () {
        document.removeEventListener('mousemove', this.move, false);
    }
};

/*
* 获取配置信息
* */
chrome.extension.sendMessage({
    message: 'get_options'
}, function (response) {
    options = response;
    console.log(options);
});

/*
* 接受配置修改信息
* */
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "set_options") {
            options = request.options;
            console.log(options);
        }
    }
);
mouseEvents.init();
