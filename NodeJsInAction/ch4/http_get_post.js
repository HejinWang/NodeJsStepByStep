var http = require('http');
var qs = require('querystring');
var url = require('url');
var items = [];

var server = http.createServer(function (req, res) {
  if ('/' == req.url) {
    switch (req.method) {
      case 'GET':
        show(res);
        break;
      case 'POST':
        add(req, res);
        break;
      default:
        badRequest(res);
    }
  } else {
    if (req.method != "DELETE") {
      notFound(res);
    } else {
      del(req, res);
    }
  }
});

function del(req, res) {
  var path = url.parse(req.url).pathname;
  var i = parseInt(path.slice(1), 10);
  if (isNaN(i)) {  //检查数字是否有效    
    res.statusCode = 400;
    res.end('Invalid item id');
  } else if (!items[i]) {  //确保请求的索引存在   
    res.statusCode = 404;
    res.end('Item not found');
  } else {
    items.splice(i, 1);  //删除请求的事项   
    show(res);
  };
}

function add(req, res) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk
  });
  req.on('end', function () {
    var obj = qs.parse(body);
    items.push(obj.item);
    show(res);
  });
}

function show(res) {
  var html = '<html><head><title>Todo List</title></head><body>' +
    '<h1>Todo List</h1>' //对简单的程序而言，用嵌入的HTML取代模板引擎一样好用        
    +
    '<ul id="content">' +
    items.map(function (item, index) {
      return '<li id="li_' + index + '">' + item + '</li><input type="button" id="btn_' + index + '" onclick="javascript:testDelete(' + index + ');" value = "X"/>'
    }).join('') +
    '</ul>' +
    '<form method="post" action="/">' +
    '<p><input type="text" name="item" /></p>' +
    '<p><input type="submit" value="Add Item" /></p>' +
    '</form>' +
    "<script>" +
    "function getXMLHTTPRequest(){  " +
    "     if (XMLHttpRequest)    {  " +
    "       return new XMLHttpRequest();  " +
    "  } else {  " +
    "     try{  " +
    "       return new ActiveXObject('Msxml2.XMLHTTP');  " +
    "     }catch(e){  " +
    "           return new ActiveXObject('Microsoft.XMLHTTP');  " +
    "     }  " +
    "  }  " +
    "}  " +
    "var req = getXMLHTTPRequest();  " +
    "function testDelete(index) {" +
    "	req.open('DELETE','http://localhost:3000/'+index,false);  " +
    //成功之后 页面删除

    ' var content=document.querySelector("#content");  ' +
    "content.removeChild( document.querySelector('#li_' + index ));  " +
    "content.removeChild( document.querySelector('#btn_' + index ));  " +
    "}" +
    "</script>" +
    "</body></html>";
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function notFound(res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
}

function badRequest(res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}
server.listen(3000);
