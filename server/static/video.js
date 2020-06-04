// check to see if this is going to work...
if (
  !('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)
) {
  document.body.innerHTML = 'Browser unsupported';
}

// set up socket
let userList = [];
const socket = io();

const mediaConstraints = {
  video: true,
};

const makeVideoOffer = async () => {
  try {
    const pc = new RTCPeerConnection({
      // self hosted STUN server from node.
      iceServers: [{ urls: 'stun:100.2.208.235' }],
    });
    pc.onicecandidate = ({ candidate }) => {
      socket.emit('new-ice-candidate', candidate);
    };
    const video = document.getElementById('video1');
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    video.srcObject = stream;
    stream.getVideoTracks().forEach((track) => {
      pc.addTrack(track);
    });
    pc.ontrack(({ streams }) => {
      document.getElementById('video2').srcObject = streams[0];
    });
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('video-offer', pc.localDescription);
      } catch (err) {
        throw err;
      }
    };
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
  } catch (err) {
    throw err;
  }
});
