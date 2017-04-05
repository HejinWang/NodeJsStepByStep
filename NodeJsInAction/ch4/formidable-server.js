var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    path = require('path'),
    root = __dirname,//path.join(__dirname, '../../../'),
    formidable = require('formidable');

// io监听connection事件
io.on('connection', function (socket) {
    // 定义socket名称
    socket.join('upload');
});


// 设置服务器的工作路径
app.use(express.static(root));

app.get('/', function (req, res) {
    res.sendfile('formidable-vector.html', { root: root });
});

app.post('/', function (req, res) {
    var form = new formidable.IncomingForm();

    form.on('end', function () {
        res.end('upload complete!');
    });
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        // 获取指定的socket，并派发事件
        io.sockets.in('upload').emit('progress', percent);
    });
    form.parse(req);
});

// 服务器监听4000端口
server.listen(3000, function () {
    console.log('server is listening at port 3000');
});