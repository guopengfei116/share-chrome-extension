
/*
* 手势类
* */
var Gesture = function () {
    this.run = false;
    this.seq =  "";     // 动作序列
    this.miss = 0;      // 失败次数
    this.startTime = 0;
    this.startCoord = {
        x : -1,
        y : -1
    }
};

$.extend(Gesture.prototype, {
    start : function (e) {
        this.run = true;
        this.startTime = new Date().getTime();
        this.startCoord = {
            x : e.clientX,
            y : e.clientY
        };
        console.log('run');
    },
    move : function (e) {
        if(!this.run) {
            return;
        }
        // 移动时间过短
        if(new Date().getTime() - this.startTime < 100) {
            return;
        }
        
        console.log('move');

    },
    end : function (e) {
        console.log('end');
    }

});

/*
* 对象初始化
* */
var gesture = new Gesture();

/*
* 鼠标事件监听器
* */
var mouseEvents = {
    enter : function (e) {
        if(e.button !== 0) {
            return;
        }
        if(!e.altKey && !e.ctrlKey) {
            return
        }
        if(!gesture.run) {
            return;
        }
        this.addMousemove();
        gesture.run(e);
    },
    letgo : function (e) {
        gesture.end(e);
    },
    move : function (e) {
        gesture.move(e);
    },
    addMousedown : function () {
        document.addEventListener('mousedown', this.mouseEvents.enter, false);
    },
    addMouseup : function () {
        document.addEventListener('mouseup', this.mouseEvents.letgo, false);
    },
    addMousemove : function () {
        document.addEventListener('mousemove', this.mouseEvents.move, false);
    },
    delMousemove : function () {
        document.removeEventListener('mousemove', this.mouseEvents.move, false);
    }
};

// 添加事件监听
mouseEvents.addMousedown();
mouseEvents.addMouseup();
