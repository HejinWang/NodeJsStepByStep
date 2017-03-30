//静态文件服务器
var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;  //__dirname是该文件所在目录的路径

var server = http.createServer(function (req, res) {
  var url = parse(req.url);
  var path = join(root, url.pathname);
  var stream = fs.createReadStream(path);
  stream.on('data', function (chunk) {
    res.write(chunk);
  });
  stream.on('end', function () {
    res.end();
  });
});

server.listen(3000);
