const io = require('socket.io')(3002, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    socket.broadcast.emit('user-joined', { message: 'A user has joined the chat.' });

    socket.on('newMessage', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        io.emit('user-left', { message: 'A user has left the chat.' });
    });
});
