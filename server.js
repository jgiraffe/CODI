/*
    file  : server.js (CODi)
    autor : 정재균 (jgiraffe@naver.com)
    breif : back-end (http version -> localhost only)
*/

const http = require('http');
const nodestatic = require('node-static');
const socketio = require('socket.io');

// server code
const CODiServer = new(nodestatic.Server)();
const app = http.createServer(function(req, res) {
    CODiServer.serve(req, res);
}).listen(80);

// socket code
const io = socketio.listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('createRoom', function(roomID) {
    let isExist = io.sockets.adapter.rooms[roomID];
    if (isExist) {
      socket.emit('exist', roomID);
    }
    else {
      socket.join(roomID); // join room
      socket.emit('host', roomID);
    }
  });

  socket.on('joinRoom', function(roomID) {
    let isExist = io.sockets.adapter.rooms[roomID];
    if (isExist) {
      // for 1:1 connection
      if(Object.keys(isExist.sockets).length == 1) {
        io.sockets.in(roomID).emit('join', roomID);
        socket.join(roomID); // join room
        socket.emit('joined', roomID);
      }
      else {
        socket.emit('full', roomID);
      }
    }
    else {
      socket.emit('none', roomID);
    }
  });

  socket.on('msg', function(msg, roomID) {
    socket.broadcast.to(roomID).emit('msg', msg);
  });

  socket.on('editortext', function(editortext, roomID) {
    socket.broadcast.to(roomID).emit('editortext', editortext);
  });

  socket.on('fontChange', function(fontSize, roomID) {
    io.sockets.in(roomID).emit('fontChange', fontSize);
  });

  socket.on('clickCode', function(clickID, roomID) {
    io.sockets.in(roomID).emit('clickCode', clickID);
  });
  
});