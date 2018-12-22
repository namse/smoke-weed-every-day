const express = require('express');
const socket = require('socket.io');
const http = require('http');

const path = require('path');

const app = express();
const server = http.Server(app);
const io = socket(server);

const clientPath = path.join(__dirname, '../../../../client');
app.use(express.static(clientPath));
server.listen(13130);

const sockets = [];

io.on('connection', (socket) => {
  sockets.push(socket);

  socket.on('disconnect', () => {
    const index = sockets.indexOf(socket);
    if (index < 0) {
      return;
    }
    sockets.splice(index, 1);
  });
});

function onKey(number) {
  console.log('number pressed : ', number);

  sockets.forEach((socket) => {
    socket.emit('onKey', number);
  });
}

window.onKey = onKey;