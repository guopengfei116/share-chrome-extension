var path = require('path');

exports.options = {
    livereload : '<%= connect.options.livereload %>'
};

exports.html = {
    files : [
        'source/*/tpl/*.html',
        'source/*/index.html'
    ],
    tasks : [
        'string-replace'
    ]
};

exports.tpl = {
    files : [
        'source/*/tpl/*.tpl',
        'source/*/img/*.*',
        'source/*/media/*.*'
    ],
    tasks : [
        'copy'
    ]
};

exports.js = {
    files : [
        'source/**/*.js'
    ],
    tasks : [
        'browserify'
    ]
};

exports.sass = {
    files : [
        'source/**/*.scss'
    ],
    tasks : [
        'sass'
    ]
};

