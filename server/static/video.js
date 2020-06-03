if (
  !('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)
) {
  document.body.innerHTML = 'Browser unsupported';
}

// set up socket
let userList = [];
const pc = new RTCPeerConnection();
const socket = io();
socket.on('video-offer', (offer) => {
  console.log('video offer', offer);
  let description = new RTCSessionDescription(offer);
  console.log(description);
  pc.setRemoteDescription(description);

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    camTrack = stream.getVideoTracks()[0];
    pc.addTrack(camTrack).then(() => {
      let config = pc.createAnswer();
      console.log(config);
    });
  });
  console.log('making it big', pc);
  // pc.setLocalDescription(offer)
});
// check if media capabilities are present

const constraints = {
  video: true,
};

const makeVideoOffer = async () => {
  try {
    let video = document.getElementById('video1');
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    const camTrack = stream.getVideoTracks()[0];
    pc.addTrack(camTrack);
    const description = await pc.createOffer();
    await pc.setLocalDescription(description);
    console.log('sending description', pc.localDescription);
    socket.emit('video-offer', description);
  } catch (err) {
    throw err;
  }
};
makeVideoOffer();
