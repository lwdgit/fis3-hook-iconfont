var iconfont = require('./libs/index.js'),
path = require('path');

function addToRelease(ret, file) {
    if (!ret.src[file]) {
        ret.src[file] = fis.file(file);
    }
}

module.exports = function(fis, opts) {

    var settings = opts || fis.config.get("iconfont") || {};
    var root = fis.project.getProjectPath();

    ['fontName', 'destFont', 'fonts'].forEach(function(i) {

        if (i === 'fontName') {
            if (!settings[i]) {
                settings[i] = 'iconfont';
            }
        } else if (i === 'fonts') { //根据fonts计算出字体目录
            var paths = [];
            if (settings[i] instanceof Array) {
                for (var j = 0, l = settings[i].length; j < l; j++) {
                    paths[j] = path.join(root, settings[i][j]);
                }

            } else {
                if (!settings[i]) {
                    //如果没有设置root,则自动处理全目录svg
                    settings[i] = '**.svg';
                }

                var files = fis.project.getSourceByPatterns(settings[i]),
                    j = 0,
                    ignore = path.join(settings['destFont'], settings['fontName']).replace(/\\/g, '/');

                for (var file in files) {
                    if (ignore === files[file].realpathNoExt) {
                        continue; //防止被生成的字体再次进行编译转化
                    }

                    paths[j++] = files[file].realpath;
                }
            }

            settings[i] = paths;
        } else if (i === 'destFont') {
            if (!settings[i]) {
                settings[i] = './fonts/';
            }
            if (!path.isAbsolute(settings[i])) {
                settings[i] = path.join(root, settings[i]);
            }
        }
    });


    var genRet = iconfont.run(settings);

    fis.on('release:start', function(ret) {

        addToRelease(ret, genRet.cssPath);
        for (var i = 0, l = genRet.fontPath.length; i < l; i++) {
            addToRelease(ret, genRet.fontPath[i]);
        }

    })

};
