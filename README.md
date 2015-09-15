# fis3-hook-iconfont [![NPM version](https://badge.fury.io/js/fis3-hook-iconfont.png)](https://www.npmjs.org/package/fis3-hook-iconfont)

## 安装
    npm install -g fis3-hook-iconfont

## 用法：
```javascript
//fis3 config
fis.hook('iconfont', {
    'fonts': '**.svg', //图标文件
    'destFont': 'fonts_release', //产出字体目录
    'fontName': 'my_font', //产出字体名称
    'destHtml': 'fonts_release/demo.html'//如果无需输出示例页面，请设置为false
});
```

