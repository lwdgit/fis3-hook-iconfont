'use strict';

var genFonts = require('./genFonts');


exports.run = function(config) {
	// genFonts({
	// 	fonts: ['./fonts/i-right.svg','./fonts/i-wrong.svg', './test/svgs/love.svg'],
	// 	destFont: './output',
	// 	fontName: 'reasyfont',
	// 	destCss: './output/font.css',
	// 	destHtml: './output/font.html',
	// 	iconClass: 'reasy-icon',
	// 	placeholder: 'reasyfont'//css占位符，用于自动替换指定位置的字符串为css,占位符形式为 :
	// 				  /*******reasyfont*****/ 
	// 				  
	// 				  ... ... 
	// 				  
	// 				  /******end reasyfont****/
	// })
	

	if (!config) throw new Error('config can not be empty!');
	if (!config.fonts || !(config.fonts instanceof Array)) {
		throw new Error('`config.fonts` must be specify!');
	}
	if (!config.destFont) {
		throw new Error('`config.destFont` must be specify!');
	}
	return genFonts(config);//返回css字符串、路径及字体路径
}