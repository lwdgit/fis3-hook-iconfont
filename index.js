"use strict";

var path = require('path');
var fs = require('fs');
var iconfont = require("./libs/index");


module.exports = function(fis, opts) {

    fis.on('release:start', function(message) {


        var settings = opts || {};
        var root = fis.project.getProjectPath();

        ['src', 'dest', 'fontname'].forEach(function(i) {

            if (i === 'src') {
                var paths = [];
                if (settings[i] instanceof Array) {
                    for (var j = 0, l = settings[i].length; j < l; j++) {
                        paths[j] = path.join(root, settings[i][j]);
                    }
                    
                } else if (typeof settings[i] === 'string' || settings[i] instanceof RegExp) {

                    var files = fis.project.getSourceByPatterns(settings[i]),
                    j = 0;
                    for (var file in files) {
                        paths[j++] = files[file].realpath;
                    }
                }
                settings[i] = paths;
            } else if (i === 'dest') {
                settings[i] = path.join(root, settings[i]);
            }
        });
        

        if (!settings['src'] || !settings['dest']) {
            fis.log.error("please set webfont settings in fis-conf.js");
        }

        //导出字体
        iconfont.run(settings);
    });
};
