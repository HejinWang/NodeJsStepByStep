var parse = require('url').parse;
var join = require('path').join;
var formidable = require('formidable');
var app = require('http').createServer(handler);
var fs = require('fs');
app.listen(3000);

function handler(req, res) {
    switch (req.method) {
        case 'OPTIONS':
            upload(req, res);
            break;
    }
}

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
        console.log(percent);
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
function endsWith(content, str) {
    return content.slice(-str.length) == str;
};



//http://cnodejs.org/topic/519c234863e9f8a542aa7ebd     
//how-to-allow-cors
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS