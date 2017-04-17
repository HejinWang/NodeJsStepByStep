var express = require('express'),
    app = express(),
    cors = require('cors'),
    server = require('http').createServer(app),
    root = __dirname,
    formidable = require('formidable');


// 设置服务器的工作路径
app.use(express.static(root));
app.use(cors());
app.post('/', function (req, res) {
    var form = new formidable.IncomingForm(); 
    form.on('field', function (field, value) {
        console.log(field); console.log(value);
    });
    form.on('file', function (name, file) {
        console.log(name);
        console.log(file);
    });
    form.on('end', function () {
        res.end('upload complete!');
    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
    });

    form.parse(req, function (err, fields, files) {
        console.log(fields);
        console.log(files);
        res.end('upload complete!');
    });
});

// 服务器监听4000端口
server.listen(4000, function () {
    console.log('server is listening at port 4000');
});