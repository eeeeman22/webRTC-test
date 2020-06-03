const app = require('express')();
const fs = require('fs');
const colors = require('colors');
const stun = require('stun');
try {
  (async () => {
    const res = await stun.request('stun.l.google.com:19302');
    console.log('your ip', res.getXorAddress().address);
  })();
} catch (err) {
  throw err;
}
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
app.get('/video.js', (req, res) => {
  res.sendFile(__dirname + '/static/video.js');
});

const users = [];

io.on('connection', (socket) => {
  console.log('new connection'.green, socket.id);
  users.push(socket.id);

  // VIDEO OFFER
  socket.on('video-offer', (offer) => {
    console.log(`video-offer from ${socket.id}`.cyan);
    socket.broadcast.emit('video-offer', offer);
  });

  // VIDEO ANSWER
  socket.on('video-answer', (answer) => {
    socket.broadcast.emit('video-answer'.gray, answer);
  });

  // ICE-CANDIDATE
  socket.on('new-ice-candidate', (candidate) => {
    console.log(`new-ice-candidate: ${JSON.stringify(candidate)}`.magenta);
  });

  // DISCONNECT
  socket.on('disconnect', () => {
    users.splice(
      // index of current user
      users.findIndex((v) => v === socket.id),
      // delete it
      1
    );
    console.log(`deleted ${socket.id}`.red, users);
    socket.broadcast.emit('remove-user', users);
  });
});
