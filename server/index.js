const app = require('express')();
const fs = require('fs');
const colors = require('colors');
const stun = require('stun');
const { initSocketIO } = require('./sockets');

// init STUN server setup
try {
  (async () => {
    const res = await stun.request('stun.l.google.com:19302');
    console.log('your ip', res.getXorAddress().address);
  })();
} catch (err) {
  throw err;
}
// init HTTPS
const https = require('https')
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

// serve static files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/video.html');
});
app.get('/video.js', (req, res) => {
  res.sendFile(__dirname + '/static/video.js');
});

// init socket.io
initSocketIO(https);
