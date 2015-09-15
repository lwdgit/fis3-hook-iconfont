# fis3-hook-iconfont [![NPM version](https://badge.fury.io/js/fis3-hook-iconfont.png)](https://www.npmjs.org/package/fis3-hook-iconfont)

## 安装:
    npm install -g fis3-hook-iconfont

## 用法:

```javascript

fis.hook('iconfont', {
    'fonts': '**.svg', //图标文件
    'destFont': 'fonts', //产出字体目录
    'fontName': 'reasy_font', //产出字体名称
    'destHtml': 'fonts/demo.html'//如果无需输出示例页面，请设置为false
    'destCss': 'style/font.css',//注：如果css文件已经存在，则会将对应位置的样式占位符替换为字体样式,默认为字体名
    'iconClass': 'reasy-font',//定义字体图标应用的主样式,默认为icon-font
    'placeholder': 'reasyfont'//css占位符，用于自动替换指定位置的字符串为css,
    //占位符形式为 : /**reasyfont**/ ...css /**end reasyfont**/
});
```

如`a.css`文件里面有如下代码：
```css
body {
  background: #fff;
}
/**reasyfont**/


/**end reasyfont**/
```

则会被替换为：

```css
body {
  background: #fff;
}

/********reasyfont********/
@font-face {
  font-family:"reasy_font";
  src:url("reasy_font.eot");
  src:url("reasy_font.eot?#iefix") format("embedded-opentype"),
    url("reasy_font.woff") format("woff"),
    url("reasy_font.ttf") format("truetype"),
    url("reasy_font.svg#reasy_font") format("svg");
  font-weight:normal;
  font-style:normal;
}

.reasy-font {
  font-family:"reasy_font";
  display:inline-block;
  vertical-align:middle;
  line-height:1;
  font-weight:normal;
  font-style:normal;
  speak:none;
  text-decoration:inherit;
  text-transform:none;
  text-rendering:auto;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}


.icon-advanced:before {
  content: '\e001';
}

... other css...

/******end reasyfont********/
```


## 关于`XP下<=IE8`的兼容性问题

> 现已知**`XP下的IE8在服务器环境下`**可能无法显示iconfont, 需要兼容IE8的可以考虑加上`respond.js`以及`html5shim.js`来解决。见 https://github.com/sapegin/grunt-webfont/issues/264

> 经验证，所有的主流字体库都存在这个问题，如iconmoon, awesome等，但是win7下的ie8是正常的