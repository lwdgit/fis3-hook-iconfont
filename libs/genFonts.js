'use strict';

var fontCarrier = require('font-carrier'),
    _template = require('lodash.template'),
    fs = require('fs'),
    path = require('path');

var font = null;


/**
 * 生成iconfont
 * @param  {Array} fonts    字体路径数组
 * @param  {[type]} destFont [description]
 * @param  {[type]} destCss  [description]
 * @param  {[type]} destHtml [description]
 * @return {[type]}          [description]
 */

var startIndex = 57345; //对应16进制0xe001;
var config = {
    destFont: null,
    destCss: null,
    destHtml: null,
    classPrefix: 'icon'
};


function toCssUnicode(code) {
    return '\\' + (~~code).toString(16);
}

function toHtmlUnicode(code) {
    return '&#x' + (~~code).toString(16) + ';';
}


function createDir(dir, callback) {
    dir = path.resolve(dir);
    var originDir = dir;
    try {
        if (!path.isAbsolute(dir)) {
            dir = path.join(process.cwd(), dir);
        }
        if (fs.existsSync(dir)) return;

        while (!fs.existsSync(dir + '/..')) { //检查父目录是否存在
            dir += '/..';
        }

        while (originDir.length <= dir.length) { //如果目录循环创建完毕，则跳出循环
            fs.mkdirSync(dir, '0777');
            dir = dir.substring(0, dir.length - 3);
        }

        if (callback) callback();
    } catch (e) {
        console.log(e);
    }
}

function writeFileSync(file, content) {
    createDir(path.dirname(file)); //__dirname为libs目录
    fs.writeFileSync(file, content);
}



function readTemplate(file) {
    return fs.readFileSync(path.join(__dirname, '../templates/' + (file || 'demo.html')));
}

function makeCss(iconsObj) {
    var template = _template(readTemplate('demo.css'));
    var src = path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName); //计算出字体与css的相对路径

    return template({
        fontSrc1: 'url("' + src + '.eot")',
        fontSrc2: 'url("' + src + '.eot?#iefix") format("embedded-opentype"),\n\t\turl("' + src + '.woff") format("woff"),\n\t\turl("' + src + '.ttf") format("truetype"),\n\t\turl("' + src + '.svg#' + config.fontName + '") format("svg")',
        iconClass: config.iconClass,
        fontName: config.fontName,
        fontClassList: iconsObj,
        ie7: false
    });
}

function makeHtml(iconsObj) {
    var template = _template(readTemplate('demo.html'));
    return template({
        cssPath: path.relative(path.dirname(config.destHtml), config.destCss),
        iconClass: config.iconClass,
        fontName: config.fontName,
        fontClassList: iconsObj
    });
}

function generateFonts(svgFiles, code) {
    var codes = [];
    font = fontCarrier.create(); //字体组件初始化

    svgFiles.forEach(function(file) {
        codes.push({
            className: config.classPrefix + path.basename(file).replace(/\.svg$/i, ''),
            cssUnicode: toCssUnicode(code),
            htmlUnicode: toHtmlUnicode(code)
        });

        file = fs.readFileSync(file).toString();
        font.setSvg(toHtmlUnicode(code), file);

        code++;
    });

    createDir(config.destFont);
    font.output({
        path: path.join(config.destFont, config.fontName)
    });

    font = null;
    return codes;
}


/**
 * 函数入口
 * @param  {Object} settings 参数配置
 * @param  {Array} settings.fonts  设置svg文件列表
 * @param {String} settings.destFont 指定生成路径
 */
module.exports = function(settings) {
    console.log('GenerateFonts Start!');
    var fontCode = startIndex;
    var fontCodes = []; //用于记录className和unicode的对应关系

    config.fonts = settings.fonts;
    config.fontName = settings.fontName || 'reasyfont';
    config.iconClass = settings.iconClass || 'icon-font';
    config.classPrefix = settings.classPrefix || 'icon-'
    config.destFont = settings.destFont;
    config.destHtml = settings.destHtml;
    config.placeholder = settings.placeholder || 'iconfont';

    config.destCss = settings.destCss || path.join(settings.destFont, settings.fontName + '.css');

    if (!config.fonts) {
        throw new Error('please specify the svg fonts list!');
    }

    if (config.fonts instanceof Array) {
        if (config.fonts.length < 1) {
            console.warn('fonts empty!!!');
            return;
        }
        fontCodes = generateFonts(config.fonts, fontCode);

    
        if (config.destHtml) {
            if (!config.destCss) {//如果指定要生成html，则必须要有css，否则自动指定
                config.destCss = path.basename(config.destHtml); + '.css';
            }
            writeFileSync(config.destHtml, makeHtml(fontCodes));
        }   

        var css = '/********' + config.placeholder + '********/\r\n' +//添加占位标志，用于替换特殊字段
            makeCss(fontCodes) +
            '\r\n/******end ' + config.placeholder + '********/\r\n'; 

        if (config.destCss) {
            if (fs.existsSync(config.destCss)) {
                
                var content = fs.readFileSync(config.destCss).toString();
                var matchTag = new RegExp('(\\/\\*+' + config.placeholder + '\\*+\\/[\\w\\W]*end ' + config.placeholder + '\\*+\\/)');//生成动态正则 /(\/\*{8}iconfont\*{8}\/[\w\W]*end iconfont\*{8}\/)/

                if (matchTag.test(content)) {
                    content = content.replace(matchTag, css);
                } else {
                    content = [css, content].join('\r\n');
                }

                writeFileSync(config.destCss, content);
            } else {
                writeFileSync(config.destCss, css);
            }
        }

        
        console.log('GenerateFonts Success!');
        return {
            css: css,
            fontPath: (function() {
                var fontsPath = path.join(config.destFont, config.fontName);
                return [
                    fontsPath + '.eot',
                    fontsPath + '.ttf',
                    fontsPath + '.woff',
                    fontsPath + '.svg'
                ];
            }
            )(),
            cssPath: config.destCss
        };
    } else {
        throw new Error('fonts setting invalid!');
    }
}
