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
    case 'PUT':
      //curl -X PUT  http://localhost:3000/1?foo=foo&bar=bar
      //curl -X PUT  -d "foo=foo&bar=bar" http://localhost:3000/1
      var res_url = url.parse(req.url);
      var path = res_url.pathname;
      var i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {  //检查数字是否有效    
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!items[i]) {  //确保请求的索引存在   
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        //更新内容
        items[i] = res_url.query;
        res.end('OK\n');
      };
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
      //curl -I -X DELETE http://localhost:3000/1?api-key=foobar
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