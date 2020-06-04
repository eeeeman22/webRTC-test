const initSocketIO = (https) => {
  var io = require('socket.io')(https);
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
      socket.broadcast.emit('new-ice-candidate', candidate);
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
};
module.exports = { initSocketIO };
