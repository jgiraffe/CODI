/*
    file  : server.js (CODi)
    autor : 정재균 (jgiraffe@naver.com)
    breif : back-end
*/

// http server
const http = require("http");
const nodestatic = require("node-static");
const codiServer = new nodestatic.Server();
const app = http
  .createServer(function (req, res) {
    codiServer.serve(req, res);
  })
  .listen(80);

// socket code
const io = require("socket.io")(app);
io.sockets.on("connection", function (socket) {
  console.log("server : connected!");
  // create room
  socket.on("createRoom", function (roomID) {
    let isExist = io.sockets.adapter.rooms.get(roomID);
    if (isExist) {
      socket.emit("exist", roomID);
    } else {
      socket.join(roomID); // join room
      socket.emit("host", roomID);
      console.log(roomID + " 생성됨");
    }
  });
  // join room
  socket.on("joinRoom", function (roomID) {
    let isExist = io.sockets.adapter.rooms.get(roomID);
    if (isExist) {
      // for 1:1 connection
      if (isExist.size == 1) {
        io.sockets.in(roomID).emit("join", roomID);
        socket.join(roomID); // join room
        socket.emit("joined", roomID);
      } else {
        socket.emit("full", roomID);
      }
    } else {
      socket.emit("none", roomID);
    }
  });

  socket.on("msg", function (msg, roomID) {
    socket.broadcast.to(roomID).emit("msg", msg);
  });

  socket.on("editortext", function (editortext, roomID) {
    socket.broadcast.to(roomID).emit("editortext", editortext);
  });

  socket.on("fontChange", function (fontSize, roomID) {
    io.sockets.in(roomID).emit("fontChange", fontSize);
  });

  socket.on("clickCode", function (clickID, roomID) {
    io.sockets.in(roomID).emit("clickCode", clickID);
  });
});
