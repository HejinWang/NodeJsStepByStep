var express = require('express'),
    app = express(),
    cors = require('cors'),
    server = require('http').createServer(app),
    path = require('path'),
    root = __dirname,
    formidable = require('formidable');


//静态资源服务
//app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/file', express.static(path.join(__dirname, 'uploads')));
//跨域资源请求
app.use(cors());

app.post('/uploads', function (req, res) {

    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }

    var form = new formidable.IncomingForm();
    //设置表单域的编码
    form.encoding = 'utf-8';
    //设置上传文件存放的文件夹，默认为系统的临时文件夹，可以使用fs.rename()来改变上传文件的存放位置和文件名
    form.uploadDir = "uploads";
    //设置该属性为true可以使得上传的文件保持原来的文件的扩展名。
    form.keepExtensions = true;
    //只读，根据请求的类型，取值'multipart' or 'urlencoded'
    //form.type 
    //限制所有存储表单字段域的大小（除去file字段），如果超出，则会触发error事件，默认为2M
    //form.maxFieldsSize = 2 * 1024 * 1024;  
    //设置上传文件的检验码，可以有两个取值'sha1' or 'md5'.
    //form.hash = false;
    //开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要 html5中multiple特性支持。
    //form.multiples = false;



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
function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}
// 服务器监听4000端口
server.listen(4000, function () {
    console.log('server is listening at port 4000');
});

//formidable
//https://www.npmjs.com/package/formidable
//http://www.cnblogs.com/yuanke/archive/2016/02/26/5221853.html

//next()
//http://www.html-js.com/article/1603