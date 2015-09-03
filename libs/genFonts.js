'use strict';

var fontCarrier = require('font-carrier'),
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

var startIndex = 57345;//对应16进制0xe001;
var config = {
	destFont: null,
	destCss: null,
	destHtml: null
};


function toCssUnicode(code) {
	return '\\' + (~~code).toString(16);
}

function toHtmlUnicode(code) {
	return '&#x' + (~~code).toString(16) + ';';
}

function makeCss(iconClass) {
	var content = [];
    // 字体的引用和每个css的引入路径有关系
    content.push('@font-face {');
    // content.push('font-family: "platfont";src: url("./fonts/platfont.eot");');
    content.push('\tfont-family: "' + config.fontName + '";')
    content.push('\tsrc: url("' + path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName) +'.eot");');
    content.push('\tsrc: url("' + path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName) +'.eot?#iefix") format("embedded-opentype"),');
    content.push('\t\turl("' + path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName) + '.woff") format("woff"),');
    content.push('\t\turl("' + path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName) + '.ttf") format("truetype"),');
    content.push('\t\turl("' + path.join(path.relative(config.destFont, path.dirname(config.destCss)), config.fontName) + '.svg#platfont") format("svg");\n}');
    content.push('.icon-font{\n\tfont-family:"' + config.fontName + '";\n\tfont-size:40px;\n\tfont-style:normal;\n}');
    iconClass.forEach(function(iconName, index){
        content.push('.' + iconName.className + ':before{\n\tcontent: "' + toCssUnicode(iconName.unicdeCode) + '";\n}');
    });


    return content.join('\r\n');
}

function makeHtml(iconClass) {
	var content = [];
	    content.push('<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n<meta charset="UTF-8">\r\n<title>iconfont demo</title>');
	    content.push('<link href="' + path.relative(path.dirname(config.destHtml), config.destCss) + '" rel="stylesheet" type="text/css" /> ');
	    content.push('</head>\r\n<body>')

	    iconClass.forEach(function(iconName, index){
	        content.push('<i class="icon-font ' + iconName.className + '"></i>');
	    });
	    content.push('</body>\r\n</html>')
	    return content.join('\r\n');
}

function generateFonts(svgFiles, code) {
	var codes = [];
	font = fontCarrier.create();//字体组件初始化

	svgFiles.forEach(function(file) {
		codes.push({
			className: 'icon_' + path.basename(file).replace(/\.svg$/i, ''),
			unicdeCode: code
		});

		file = fs.readFileSync(file).toString();
		font.setSvg(toHtmlUnicode(code), file);

		code++;
	});
	
	font.output({
	  	path: path.join(config.destFont, config.fontName)
	});
	
	font = null;
	return codes;
}


module.exports = function(fonts, fontName, destFont, destCss, destHtml) {
	console.log('genFonts Start!');
	var fontCode = startIndex;
	var fontCodes = [];

	config.destCss = destCss;
	config.destHtml = destHtml;
	config.destFont = destFont;
	config.fontName = fontName || 'icon-font';

	if (fonts instanceof Array) {
		fontCodes = generateFonts(fonts, fontCode);
		fs.writeFileSync(config.destCss, makeCss(fontCodes));
		fs.writeFileSync(config.destHtml, makeHtml(fontCodes));
	} else {
		throw new Error('fonts setting invalid!');
	}
}