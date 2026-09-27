const jwt = require('jsonwebtoken');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Allow client to join a personal room keyed to their userId
    // Client should emit: socket.emit('join-user', token)
    socket.on('join-user', (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devpair_secret_key_2026');
        if (decoded?.userId || decoded?.id) {
          const userId = decoded.userId || decoded.id;
          socket.join(`user:${userId}`);
          socket.userId = userId;
        }
      } catch {
        // Invalid token - silent ignore
      }
    });

    // Support both 'join' and 'join-match' for chat rooms
    const handleJoin = (matchId) => {
      if (matchId) {
        socket.join(matchId.toString());
      }
    };

    socket.on('join', handleJoin);
    socket.on('join-match', handleJoin);
    
    // Support both 'send-message' and 'message' for chat
    const handleSendMessage = (data) => {
      if (!data || !data.matchId) return;
      const room = data.matchId.toString();
      io.to(room).emit('receive-message', data);
      io.to(room).emit('message', data);
    };

    socket.on('send-message', handleSendMessage);
    socket.on('message', handleSendMessage);

    // Typing indicators
    socket.on('typing', (data) => {
      if (data && data.matchId) {
        socket.to(data.matchId.toString()).emit('user-typing', data);
      }
    });

    socket.on('stop-typing', (data) => {
      if (data && data.matchId) {
        socket.to(data.matchId.toString()).emit('user-stop-typing', data);
      }
    });
    
    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });
};
