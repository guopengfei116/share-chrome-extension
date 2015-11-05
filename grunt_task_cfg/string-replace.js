var fs = require('fs');

/**
 * 构建html模板到调试目录
 * */
exports.import = {
    options: {
        replacements: [
            {
                pattern: /<!-- @import (.+) -->/ig,
                replacement: function (match, $1) {
                    return grunt.file.read(gruntProject.src + $1);
                }
            }
        ]
    },
    files: [
        {
            expand: true,
            cwd: gruntProject.src,
            src: ['*/tpl/*.html', '*/index.html'],
            dest: gruntProject.debug ? gruntProject.prd : gruntProject.dest
        }
    ]
};

console.log('string-replace config initialized');
