var fs = require('fs');
function UnicodeToUTF8(strInUni){
    if(null==strInUni)
        returnnull;
    var strUni=String(strInUni);
    var strUTF8=String();
    for(var i=0;i<strUni.length;i++){
        var wchr=strUni.charCodeAt(i);
        if(wchr<0x80){
            strUTF8+=strUni.charAt(i);
        }
        else if(wchr<0x800){
            var chr1=wchr&0xff;
            var chr2=(wchr>>8)&0xff;
            strUTF8+=String.fromCharCode(0xC0|(chr2<<2)|((chr1>>6)&0x3));
            strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
        }
        else{
            var chr1=wchr&0xff;
            var chr2=(wchr>>8)&0xff;
            strUTF8+=String.fromCharCode(0xE0|(chr2>>4));
            strUTF8+=String.fromCharCode(0x80|((chr2<<2)&0x3C)|((chr1>>6)&0x3));
            strUTF8+=String.fromCharCode(0x80|(chr1&0x3F));
        }
    }
    return strUTF8;
}
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

/*
* 对使用unicode编码加密的文件进行解密
* */
if(false) {
    exports.unicodeReplace = {
        options: {
            replacements: [
                {
                    pattern: /\w?\(?(\\\w+)+/g,
                    replacement: function (match, $1) {
                        match.replace(/([\\]+)\w/, function (ms) {
                            return '\\';
                        });
                        var fn = null, str = '';
                        try{
                            fn = new Function ( " return " + ("'" + match + "'") );
                            str = fn();
                        }catch(e) {

                        }
                        return str;
                    }
                }
            ]
        },
        files: [
            {
                expand: true,
                cwd: gruntProject.src,
                src: ['one_tab_chrome/scripts/component/options.js'],
                dest: gruntProject.debug ? gruntProject.prd : gruntProject.dest
            }
        ]
    };
}

console.log('string-replace config initialized');
