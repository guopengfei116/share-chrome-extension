
/**
 * copy文件到调试目录
 * 根目录下的index.html 和 favicon.ico
 * 子项目下的index.html 和 favicon.ico
 * js目录下的js子文件
 * css目录下的css子文件
 * img目录下的子文件
 * */
exports.common = {
    expand: true,
    flatten: false,
    cwd: gruntProject.src,
    src: ['index.html', 'favicon.ico', '*/index.html', '*/favicon.ico', '*/tpl/*/*.html', '*/js/*.*', '*/css/*.css', '*/img/*.*', '*/media/**/*'],
    dest: gruntProject.prd
};

/**
 *  部署模式，
 *  根目录下的index.html 和 favicon.ico
 *  子项目下的index.html 和 favicon.ico
 *  tpl目录下的html子文件
 *  img目录下的不支持压缩的子文件
 * */
if(!gruntProject.debug){
    exports.deploy = {
        expand: true,
        flatten: false,
        cwd: gruntProject.prd,
        src: ['index.html', 'favicon.ico', '*/index.html', '*/favicon.ico', '*/tpl/**/*.html', '*/js/*.json', '*/img/*.*', '!*/img/*.{png,jpg,jpeg}', '*/media/**/*'],
        dest: gruntProject.dest
    };
}

console.log('copy config initialized');