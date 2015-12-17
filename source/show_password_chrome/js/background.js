
setTimeout(function () {
    // 上报广义DAU
    Report.oneDayOne('visit');
    // 上报安装
    Report.onlyOne('install');
}, 1000 * 61);
