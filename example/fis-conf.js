fis.hook('iconfont', {
    'fonts': '**.svg', //图标文件
    'destFont': 'fonts', //产出字体目录
    'fontName': 'reasy_font', //产出字体名称
    'destHtml': 'style/demo.html',//如果无需输出示例页面，请设置为false
    'destCss': 'style/font.css',//注：如果css文件已经存在，则会将对应位置的样式占位符替换为字体样式,默认为字体名
    'iconClass': 'reasy-font',//定义字体图标应用的主样式,默认为icon-font
    'placeholder': 'reasyfont'
});