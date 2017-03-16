var events = require('events')
  , net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50);  //增加能够附加到事件发射器上的监听器数量 默认超过10发警告
channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  }
  this.on('broadcast', this.subscriptions[id]);

  var welcome = "Welcome!\n" + 'Guests online: ' + this.listeners('broadcast').length; 
  client.write(welcome + "\n");
});

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function () {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});


var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  //client.on('connect', function () {      //问题行 触发时即使connection  此处ON监听有误
  channel.emit('join', id, client);
  // });
  client.on('data', function (data) {
    data = data.toString();
    if (data == "shutdown\r\n") {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
  });
  client.on('close', function () {
    channel.emit('leave', id);
  });
});
server.listen(8888);
