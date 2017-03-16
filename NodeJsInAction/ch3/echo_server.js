var net = require('net');

var server = net.createServer(function (socket) {
  socket.on('data', function (data) {
    socket.write(data);
  });
});

server.listen(8888, function () {
  console.log('Server running at http://localhost:8888/');
});
