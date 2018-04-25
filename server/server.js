const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// serve static files
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        // push message to all connections (users)
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        callback('This is from the server.');
    });

    socket.on('disconnect', () => {
       console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Chat app listening on port ${port}.`);
});