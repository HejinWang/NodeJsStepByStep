var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('./NodeJsInAction/ch4/ssh/key.pem'),  //作为配置项的SSL秘钥和证书  
    cert: fs.readFileSync('./NodeJsInAction/ch4/ssh/key-cert.pem')
};
https.createServer(options, function (req, res) {   //第一个传入的就是配置项对象  
    res.writeHead(200);  //https和http模块的API几乎一样  
    res.end("hello world\n");
}).listen(3000);