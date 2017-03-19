var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        item += chunk;
      });
      req.on('end', function () {
        items.push(item);
        res.end('OK\n');
      });
      break;
    case 'GET':
      var body = items.map(function (item, i) {
        //res.write(i + ') ' + item + '\n');
        return i + ') ' + item;
      }).join('\n');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
      res.end(body);
      break;
    case 'DELETE':  //在switch语句中添加DELETE case  
      var path = url.parse(req.url).pathname;
      var i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {  //检查数字是否有效    
        res.statusCode = 400; res.end('Invalid item id');
      } else if (!items[i]) {  //确保请求的索引存在   
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        items.splice(i, 1);  //删除请求的事项   
        res.end('OK\n');
      };
      break;
  }
});
server.listen(3000);