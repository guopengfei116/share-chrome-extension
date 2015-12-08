var path = require('path');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');

/**
 * 开启一个静态文件服务器
 * */
exports.options = {
    protocol : 'http',
    port : 9800,
    open : true,
    hostname : '0.0.0.0',
    livereload : 35729,
    // 如果开启livereload，那么keepalive则不需要启动
    keepalive : false,
    base : [
        path.basename(gruntProject.debug ? gruntProject.prd : gruntProject.dest)
    ]
};

/**
 * 非调试模式下
 * */
if(!gruntProject.debug) {
    exports.options.port = 9801;
    // 开启keepalive来保持服务启动会替掉livereload功能
    exports.options.keepalive = true;
}

/**
 * 调试模式指向开发目录，部署模式指向上线目录
 * */
exports.server = {
    options : {
        /*
        * 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
        * livereload插件会刷新静态文件
        * */
        middleware : function (connect, options) {
            return [

                /*
                * 使用connect-livereload模块，生成一个与LiveReload脚本,
                * 把脚本，注入到静态文件中，
                * connect会自动注入，注释掉
                * */
                //require('connect-livereload')({ port: options.livereload }),

                // 静态文件服务器的路径
                serveStatic(options.base[0]),

                // 启用目录浏览
                serveIndex(options.base[0])
            ]
        }
    }
};

console.log('connect config initialized');