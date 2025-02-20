const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server from socket.io

const app = express();
const server = http.createServer(app);
const io = new Server(server); // Initialize Socket.IO

app.use(express.static('public')); // Serve static files from the "public" directory

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle signaling for WebRTC
    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data); // Send offer to other users
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data); // Send answer to other users
    });

    socket.on('candidate', (data) => {
        socket.broadcast.emit('candidate', data); // Send ICE candidate to other users
    });

    // Handle call rejection
    socket.on('rejectCall', () => {
        socket.broadcast.emit('callRejected');
    });

    // Handle call disconnection
    socket.on('disconnectCall', () => {
        socket.broadcast.emit('callDisconnected');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});