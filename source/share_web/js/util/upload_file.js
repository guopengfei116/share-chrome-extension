/*
* @Class 上传文件
* */
(function () {

    var root = this;

    var o = {
        uploadName : 'file',
        file : null,
        onProgress : null,
        onComplete : null,
        onError : null,
        data : {},
        interfaceUrl : null
    };

    // 构造器
    var UploadFile = function(options){

        this.options = $.extend(o, options ? options : {});

        //FormData对象、文件对象、上传地址不存在
        if(!window.FormData || !this.options.file || !this.options.interfaceUrl) {
            throw Error('初始化数据错误');
        }

        this.time = 0;
        this.fast = 0;
        this.loadedSave = 0;
        this.timeer = null;
        this.PrevLoadedSave = 0;
        this.len = 0;
        this.useTime = 0;
    };

    $.extend(UploadFile.prototype, {
        run : function () {
            var self = this;
            var xhr = new XMLHttpRequest();
            var form = new FormData();

            // form添加数据
            form.append(self.options.uploadName, self.options.file);

            //绑定上传进度事件
            if(xhr.upload && typeof self.options.onProgress == 'function'){
                self.progress(xhr);
            }

            // 文件上传成功或是失败
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        if(typeof self.options.onComplete == 'function') {
                            self.options.onComplete(xhr.responseText);
                        }
                    } else {
                        if(typeof self.options.onError == 'function') {
                            self.options.onError(xhr);
                        }
                    }
                }
            };

            // 开始上传
            xhr.open("POST", this.options.interfaceUrl, true);
            xhr.send(form);
            this.time = new Date().getTime();
            this.fastInterCode();
        },

        /*
        * 网速计算
        * */
        fastcodeConut : 0,
        fastcodeTime : 1,
        fastcode : function(){
            this.fast = this.loadedSave - this.PrevLoadedSave;

            //当前后一秒钟数据相当时候，网速为0
            if(this.fastcodeConut>0 && this.loadedSave == this.PrevLoadedSave) this.fast = 0;
            this.fastcodeConut++;
            this.PrevLoadedSave = this.loadedSave;
            this.useTime = this.fastcodeTime;
            this.fastcodeTime++;
        },

        /*
        * method 网速计算定时器
        * */
        fastInterCode : function(){
            var self = this;
            this.useTime = 1;
            this.timeer = setInterval(function(){
                self.fastcode();
            },1000);
            //self.fastcode();
        },

        /*
        * 上传进度处理
        * */
        progress : function(xhr){
            var self = this;
            xhr.upload.addEventListener("progress", function(e) {
                var obj = { loaded : e.loaded, length : e.total,fast : self.fast,time : self.useTime}
                //上传第一秒处理
                if(new Date().getTime() - self.time <= 1000){
                    obj['fast'] = e.loaded;
                    self.useTime = ((new Date().getTime() - self.time)/1000).toFixed(2);
                    obj['time'] = self.useTime;
                }
                self.options.onProgress(obj);
                self.loadedSave = e.loaded;
                if(e.loaded >= e.total) clearInterval(self.timeer);
            }, false);
        }
    });

    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = UploadFile;
        }
        exports.UploadFile = UploadFile
    } else if(typeof define === 'function' && define.amd) {
        difine('UploadFile', [], function () {
            return UploadFile;
        });
    } else {
        root.UploadFile = UploadFile;
    }

}).call(this);