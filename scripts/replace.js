var fs = require('fs');
var path = require('path');

function replaceStr(file, regex, to, backup) {
    if (fs.existsSync(file)) {
        var content = fs.readFileSync(file).toString();
        
        if (backup) {
            fs.writeFile(file + '.bak', content);
        }
        content = content.replace(regex, to);
        fs.writeFile(file, content);
    } else {
        console.log(file + ' not found!');
    }
}

replaceStr(path.join(__dirname, '../node_modules/font-carrier/lib/helper/engine.js'), 
new RegExp('fs\\.writeFile\\(', 'g'), 'fs.writeFileSync(', true);