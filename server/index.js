var app = require('express')();
const colors = require('colors');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/video.html');
});
const users = [];

io.on('connection', (socket) => {
  console.log('new connection', socket.id);
  users.push(socket.id);
  socket.broadcast.emit('add-user', users);

  // VIDEO OFFER
  socket.on('video-offer', (offer) => {
    socket.broadcast.emit('video-offer', offer);
  });

  // VIDEO ANSWER
  socket.on('video-answer', (answer) => {
    socket.broadcast.emit('video-answer', answer);
  });

  // DISCONNECT
  socket.on('disconnect', () => {
    users.splice(
      users.findIndex((v) => v === socket.id),
      1
    );
    console.log(`deleted ${socket.id}`.red, users);
    socket.broadcast.emit('remove-user', users);
  });

  // MESSAGE
  socket.on('message', (msg) => {
    console.log('INCOMING'.cyan, msg);
    // socket.emit('response', `received: ${msg}`);
    io.emit('response', `received: ${msg}`);
  });
});

http.listen(80, () => {
  console.log('listening on 80');
});
