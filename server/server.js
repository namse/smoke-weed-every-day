const express = require('express');
const socket = require('socket.io');
const http = require('http');
const fs = require('fs');

const path = require('path');

const app = express();
const server = http.Server(app);
const io = socket(server);

const clientPath = path.join(__dirname, '../../../../client/dist');
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
  socket.on('log', message => {
    console.log(message);
  });
});

function broadcast(event, ...args) {
  sockets.forEach(socket => socket.emit(event, ...args));
}

fs.watch(clientPath, () => {
  broadcast('refresh');
});

function onKey(number) {
  console.log('number pressed : ', number);

  broadcast('onKey', number);
}

window.onKey = onKey;