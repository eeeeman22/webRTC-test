const app = require('express')();
const fs = require('fs');
const colors = require('colors');
var https = require('https')
  .createServer(
    {
      key: fs.readFileSync(__dirname + '/server.key'),
      cert: fs.readFileSync(__dirname + '/server.cert'),
    },
    app
  )
  .listen(80, () => {
    console.log('listening on 80');
  });
var io = require('socket.io')(https);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/video.html');
});
const users = [];

io.on('connection', (socket) => {
  console.log('new connection', socket.id);
  users.push(socket.id);

  // VIDEO OFFER
  socket.on('video-offer', (offer) => {
    console.log(`video-offer from ${socket.id}`.cyan);
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
