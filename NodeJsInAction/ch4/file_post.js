var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var formidable = require('formidable');
var socketio = require('socket.io');
var io;

var root = __dirname;  //__dirname是该文件所在目录的路径

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            show(req,res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
});



function upload(req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }
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
        // console.log(percent);
        io = socketio.listen(server);
        io.sockets.on('connection', function (socket) {
            socket.emit('process', percent);
        });
    });

    form.parse(req, function (err, fields, files) {
        console.log(fields);
        console.log(files);
        res.end('upload complete!');
    });
}
function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}
function endsWith(content,str) { 
    return content.slice(-str.length) == str;
};

function show(req,res) {
    //末尾.js   加载数据
    var url = parse(req.url);
    if (endsWith(url.pathname.toLowerCase(),'.js')) {
        var path = join(root, url.pathname);
        var stream = fs.createReadStream(path);
        stream.pipe(res);
        stream.on('error', function (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
        });

    } else {

        var html = '<html><head><title>Todo List</title></head>'
            + '<script src="js/socket.io.js" type="text/javascript"></script>'
            + '<script src="js/jquery-3.2.0.js" type="text/javascript"></script>'
            + '<body>'
            + '<form method="post" action="/" enctype="multipart/form-data">'
            + '<p><input type="text" name="name" /></p>'
            + '<p><input type="file" name="file" /></p>'
            + '<p><input type="submit" value="Upload" /></p>'
            + '</form>'

            + '<script>'
            + 'var socket = io.connect();'
            + '$(document).ready(function() {'
            + '    socket.on("process", function(v) { '
            + '         console.log(v);  '
            + '    });'
            + '}); '
            + '</script>'
            + "</body></html>";
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(html);
    }
}

server.listen(3000);
