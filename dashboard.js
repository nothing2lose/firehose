var sys     = require('util');
var express = require('express');
var twitter = require('ntwitter');
var http    = require('http');

//var app = express.createServer();
var app = express();

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res, next){
  //req.sesssion
  res.render('/public/index.html');
});
var server = http.createServer(app);
server.listen(3000, function(){
  console.log('Server running at http://localhost:3000/');
});

var io  = require('socket.io').listen(server);

myList = [];
Array.prototype.del = function(val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
  socket.on('data', function(action,data) {
    console.log('????????');
    console.log(action);

    if(action==='+') {
      myList.push(data);
      console.log(data);
    }
    else {
      myList.del(data);
    }
  });
  socket.on('getfilter', function() {
    socket.emit('pushfilter', myList);
    console.log('emit pushfilter');
  });
  if(myList.length!=0) {
    twit.stream('user',{track:myList}, function(stream) {
      stream.on('data', function (tweet) {
        socket.emit('message', JSON.stringify(tweet));
      });
    });
  }
});

function CreateTwitter() {
  twit = new twitter({
    consumer_key: 'up1J5O2oBeKdg8ajI8L9Xw',
    consumer_secret: 'zxgGcTVXKTXPelzunK8cpNA1DM2fQJf56bLBvm9dE',
    access_token_key: '92786883-ItXOtdkPLAJstryB4G82q8XMNyOK2Z76znGo2Vrqb',
    access_token_secret: 'soRNfBdttTJRb3Yk5V22dgJ1FyAbLLJeUgkdbS5sJRyAF'
  });
}
