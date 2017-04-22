'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

/** Socket connection */
io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  socket.userData = {
    username: '',
    roomId: '',
  };

  socket.on('update_info', (userData) => {
    socket.userData.username = userData.username;
    console.log(`${socket.userData.username} update info`);
  });

  /** Event join */
  socket.on('join', (roomId) => {
    socket.join(roomId, () => {
      socket.userData.roomId = roomId;
      console.log(socket.userData);
      socket.to(roomId).emit('user_join', {username: socket.userData.username})
    });
    console.log(`${socket.userData.username} join into ${roomId}`);
  });

  /** Event disconnect */
  socket.on('disconnect', () => {
    console.log(`${socket.userData.username} disconnected`);
  });

  /** Event chat */
  socket.on('chat', (data) => {
    console.log(`${socket.userData.username}: ${data.msg}`);
    socket.broadcast.emit('chat', {username: socket.userData.username, msg: data.msg});
  });
});


http.listen(8888, () => {
  console.log('listening on *:8888');
});
