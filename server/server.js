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

    socket.on('createMessage', (message) => {

        socket.emit('newMessage', {
            from: "Admin",
            text: "Welcome to the chat app"
        });

        socket.broadcast.emit('newMessage', {
            from: "Admin",
            text: "New user joined",
            createdAt: new Date().getTime()
        });

        // push message to all connections (users)
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
       console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Chat app listening on port ${port}.`);
});