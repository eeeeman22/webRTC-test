// check to see if this is going to work...
if (
  !('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)
) {
  document.body.innerHTML = 'Browser unsupported';
}

// set up socket
let userList = [];
const pc = new RTCPeerConnection();
const socket = io();

const constraints = {
  video: true,
};

const makeVideoOffer = async () => {
  try {
    const video = document.getElementById('video1');
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

socket.on('video-offer', (offer) => {
  try {
    const description = new RTCSessionDescription(offer);
    // prettier-ignore
    await pc.setRemoteDescription(description)
    const answer = await pc.createAnswer()
    socket.emit('video-answer', answer);
  } catch (err) {
    throw err;
  }
});
