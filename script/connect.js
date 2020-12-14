/*
    file  : connect.js (CODi)
    autor : 정재균 (jgiraffe@naver.com)
    breif : room socket event & signaling
*/

// for connection
let isHost = false;
let channel = false;
let start = false;
let pc; // peer
let roomID = "";
const socket = io();

socket.on("connect", function () {
  console.log("client : connected!");
});

// for video
let localStream;
let remoteStream;
const localVideo = document.querySelector("#localVideo");
const remoteVideo = document.querySelector("#remoteVideo");

//========== socket event ==========//
function createRoom() {
  if (roomIDCheck()) {
    roomID = $(".input").val();
    socket.emit("createRoom", roomID);
  }
}

function joinRoom() {
  if (roomIDCheck()) {
    roomID = $(".input").val();
    socket.emit("joinRoom", roomID);
  }
}

socket.on("host", function (roomID) {
  isHost = true;
  connectToEditor();
  gotVideo(); // room 입장 후 video stream을 가져와야함
});

socket.on("join", function (roomID) {
  channel = true; // channel is ready
});

socket.on("joined", function (room) {
  channel = true;
  connectToEditor();
  clickCode("C"); // 게스트 입장 시 초기 값 C언어로 세팅
  gotVideo(); // room 입장 후 video stream을 가져와야함
});

socket.on("exist", function (roomID) {
  alert("이미 존재하는 방입니다!");
  location.reload(true);
});

socket.on("none", function (roomID) {
  alert("존재하지 않는 방입니다!");
  location.reload(true);
});

socket.on("full", function (roomID) {
  alert("인원 초과입니다!");
  location.reload(true);
});

function sendMsg(msg) {
  socket.emit("msg", msg, roomID);
}

socket.on("msg", function (msg) {
  if (msg === "videoStream") {
    maybeStart();
  } else if (msg.type === "offer") {
    if (!isHost && !start) {
      maybeStart();
    }
    pc.setRemoteDescription(new RTCSessionDescription(msg));
    doAnswer();
  } else if (msg.type === "answer" && start) {
    pc.setRemoteDescription(new RTCSessionDescription(msg));
  } else if (msg.type === "candidate" && start) {
    let candidate = new RTCIceCandidate({
      sdpMLineIndex: msg.label,
      candidate: msg.candidate,
    });
    pc.addIceCandidate(candidate);
  }
  // else if (msg === 'bye' && start) handleRemoteHangup();
});

//========== video stream ==========//
function gotVideo() {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true,
    })
    .then(gotStream)
    .catch(function (e) {
      alert("error : " + e.name);
    });
}

function gotStream(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
  sendMsg("videoStream");
  if (isHost) {
    maybeStart();
  }
}

function maybeStart() {
  // if (!start && typeof localStream !== 'undefined' && channel)
  if (!start && channel) {
    // peer connection start
    createPeerConnection();
    pc.addStream(localStream);
    start = true;
    if (isHost) {
      doCall();
    }
  }
}

//========== session descriptions ==========//
function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(null);
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    // create pc
  } catch (e) {
    console.log("pc fail : " + e.message);
    return;
  }
}

function handleIceCandidate(event) {
  if (event.candidate) {
    sendMsg({
      type: "candidate",
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate,
    });
  } // else console.log('End of candidates.');
}

function handleRemoteStreamAdded(event) {
  remoteStream = event.stream;
  remoteVideo.srcObject = remoteStream;
}

function handleRemoteStreamRemoved(event) {
  console.log("Remote stream removed. Event: ", event);
}

function doCall() {
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer() {
  pc.createAnswer().then(
    setLocalAndSendMessage,
    onCreateSessionDescriptionError
  );
}

function setLocalAndSendMessage(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  sendMsg(sessionDescription);
}

function onCreateSessionDescriptionError(error) {
  trace("Failed to create session description: " + error.toString());
}

function handleCreateOfferError(event) {
  console.log("createOffer() error: ", event);
}
