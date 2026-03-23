const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {}; 

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        users[socket.id] = { username, room };

        // Broadcast to others
        socket.broadcast.to(room).emit('message', { 
            user: 'System', 
            text: `${username} joined.` 
        });

        updateRoomUsers(room);
    });

    socket.on('chatMessage', (msg) => {
        const user = users[socket.id];
        if (user) io.to(user.room).emit('message', { user: user.username, text: msg });
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            io.to(user.room).emit('message', { 
                user: 'System', 
                text: `${user.username} left.` 
            });
            delete users[socket.id];
            updateRoomUsers(user.room);
        }
    });

    function updateRoomUsers(room) {
        const roomUsers = Object.values(users).filter(u => u.room === room);
        io.to(room).emit('roomUsers', { users: roomUsers });
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
