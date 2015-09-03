'use strict';

var genFonts = require('./genFonts');


exports.run = function(config) {
	console.log('start');
	genFonts(['./fonts/single.svg','./fonts/i-wrong.svg', './test/svgs/love.svg'], 'reasyfont', './output', './output/font.css', './output/font.html')
}