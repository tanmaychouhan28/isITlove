const express = require('express');
const Message = require('../models/Message');
const Match = require('../models/Match');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    if (match.user1.toString() !== req.userId.toString() && match.user2.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const messages = await Message.find({ matchId }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const { text, type, codeLang, codeContent } = req.body;
    
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    if (match.user1.toString() !== req.userId.toString() && match.user2.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const message = new Message({
      matchId,
      sender: req.userId,
      text: text || '',
      type: type || (codeContent ? 'code' : 'text'),
      codeLang: codeLang || 'javascript',
      codeContent: codeContent || ''
    });
    
    await message.save();

    // Broadcast through socket.io to the room
    const io = req.app.get('io');
    if (io) {
      io.to(matchId).emit('receive-message', message);
    }
    
    res.status(201).json(message);
  } catch (err) {
    console.error('Post message error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

