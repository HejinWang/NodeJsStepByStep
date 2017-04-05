var parse = require('url').parse;
var join = require('path').join;
var formidable = require('formidable');
var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
app.listen(3000);

function handler(req, res) {
    switch (req.method) {
        case 'GET':
            show(req, res);
            break;
        case 'POST':
            upload(req, res);
            break;
    }
}

io.on('connection', function (socket) {
    // 定义socket名称
    socket.join('upload');
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
        // 获取指定的socket，并派发事件
        io.sockets.in('upload').emit('progress', percent);
    });

    form.parse(req, function (err, fields, files) {
        //console.log(fields);
        //console.log(files);
        //res.end('upload complete!');
    });
}
function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}
function endsWith(content, str) {
    return content.slice(-str.length) == str;
};

function show(req, res) {
    //末尾.js   加载数据
    var url = parse(req.url);
    if (endsWith(url.pathname.toLowerCase(), '.js')) {
        var path = join(__dirname, url.pathname);
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
            + '<p><span id="proc">process:</span></p>'
            + '<p><input type="submit" value="Upload"   /></p>'
            + '</form>'

            + '<script>'
            + '	   var socket = io.connect();'
            + '$(document).ready(function() {'
            + '    socket.on("progress", function(val) { '
            + '         console.log(val);  '
            + '          $("#proc").html("process:"+val+"%");'
            + '    });'
            + '}); '
            + '</script>'
            + "</body></html>";
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.end(html);
    }
}


//http://www.bbsmax.com/A/mo5klRlndw/  HTML5矢量实现文件上传进度条