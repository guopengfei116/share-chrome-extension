/*
* 上报对象
* */
(function () {
    var APPID = 2111201863;
    var root = this;

    // 初始化ga上报
    ga('create', 'UA-71021863-1', 'auto');
    ga('send', 'pageview');

    /*
     * @method 通过 localStorage get uuid
     * @* 没有则生成一个uuid
     * @return {string} uuid
     * */
    var getUuid = function () {
        var uuid = localStorage && localStorage.getItem('eclock_uuid');

        if(uuid) {
            return uuid;
        }else {
            uuid = 'niceshare' + new Date().getTime() + Math.round(Math.random() * Math.pow(10, 10));
            localStorage && localStorage.setItem('eclock_uuid', uuid);
        }

        return uuid;
    };

    /*
     * @method 判断事件当天是否已上报
     * @param  事件名称
     * @return {boolean}
     * */
    var eventIsReported = function (eventName) {
        var current = new Date();
        var currentYear = current.getFullYear(),
            currentMonth = current.getMonth() + 1,
            currentDay = current.getDate();
        var eventDateString = localStorage && localStorage.getItem('report' + eventName);

        // 无记录
        if(!eventDateString) {
            return false;
        }

        // 不是今天的记录
        var eventDate = new Date('eventDateString');
        if(eventDate.getFullYear() != currentYear || eventDate.getMonth() + 1 != currentMonth || eventDate.getDate() != currentDay) {
            return false;
        }

        return true;
    };

    /*
    * @method 更新上报的时间记录
    * @param  事件名称
    * */
    var setEventReportDate = function (eventName) {
        localStorage && localStorage.setItem('report' + eventName, new Date());
    };

    var Report = {
        /*
        * 同一类型一天只上报一次
        * */
        oneDayOne : function (eventName) {
            if(!eventName) {
                return;
            }

            setTimeout(function () {
                ga('send', 'event', eventName, getUuid());
                try {
                    mData.push(['send', eventName, {
                        appid: APPID,
                        uuid : getUuid()
                    }]);
                }catch (e) {
                    console.log('Mdata report errors');
                }
                setEventReportDate(eventName);
                console.log(mData);
            }, 300);
        },

        /*
        * 上报无限制
        * */
        infinite : function (eventName) {
            if(!eventName) {
                return;
            }

            setTimeout(function () {
                ga('send', 'event', eventName, getUuid());
                try {
                    mData.push(['send', eventName, {
                        appid: APPID,
                        uuid : getUuid()
                    }]);
                }catch (e) {
                    console.log('Mdata report errors');
                }
                console.log(ga);
            }, 300);
        }
    };

    /*
     * @method 上报mdata 和 GA
     * @param {String} eventName 事件名称
     * */
    if(typeof exports !== 'undefined') {
        if(typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Report;
        }
        exports.Report = Report;
    } else if (typeof define === 'function' && define.amd) {
        define('Report', function () {
            return Report;
        });
    } else {
        root.Report = Report;
    }
}).call(this);
