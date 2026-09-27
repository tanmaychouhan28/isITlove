const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.post('/like', async (req, res) => {
  try {
    const { targetId, section, likedSection, comment } = req.body;
    const actualSection = section || likedSection || 'profile';

    if (!targetId) {
      return res.status(400).json({ message: 'targetId is required' });
    }

    const me = await User.findById(req.userId);
    const target = await User.findById(targetId);
    
    if (!target) return res.status(404).json({ message: 'Target profile not found' });
    
    if (!me.liked.includes(targetId)) {
      me.liked.push(targetId);
      await me.save();
    }
    
    // Check if target liked current user back (or auto-match if demo testing)
    const isTargetLikedMe = target.liked.includes(me._id);
    
    if (isTargetLikedMe) {
      // Check if match already exists
      let match = await Match.findOne({
        $or: [
          { user1: me._id, user2: targetId },
          { user1: targetId, user2: me._id }
        ]
      });

      if (!match) {
        match = new Match({
          user1: me._id,
          user2: targetId,
          likedSection: actualSection,
          comment: comment || ''
        });
        await match.save();

        // Create initial icebreaker message if comment provided
        if (comment) {
          await Message.create({
            matchId: match._id,
            sender: me._id,
            text: `Liked ${actualSection}: "${comment}"`
          });
        }
      }

      // Populate match
      await match.populate('user1 user2', '-password');

      // Socket notification - emit only to the two matched users
      const io = req.app.get('io');
      if (io) {
        // Notify each matched user in their personal room
        io.to(`user:${me._id}`).emit('new-match', {
          matchId: match._id,
          user1: match.user1,
          user2: match.user2
        });
        io.to(`user:${targetId}`).emit('new-match', {
          matchId: match._id,
          user1: match.user1,
          user2: match.user2
        });
      }
      
      return res.json({
        matched: true,
        match: {
          _id: match._id,
          targetUser: target.toObject(),
          user1: match.user1,
          user2: match.user2
        }
      });
    }
    
    res.json({ matched: false });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.userId }, { user2: req.userId }]
    })
    .populate('user1 user2', '-password')
    .sort({ updatedAt: -1 });
    
    // Transform matches so frontend gets clean targetUser property & last message
    const formattedMatches = await Promise.all(matches.map(async (m) => {
      const isUser1 = m.user1 && m.user1._id.toString() === req.userId.toString();
      const targetUser = isUser1 ? m.user2 : m.user1;
      
      const lastMsg = await Message.findOne({ matchId: m._id }).sort({ createdAt: -1 });

      return {
        _id: m._id,
        targetUser: targetUser ? (targetUser.toObject ? targetUser.toObject() : targetUser) : null,
        likedSection: m.likedSection,
        comment: m.comment,
        createdAt: m.createdAt,
        lastMessage: lastMsg ? lastMsg.text : 'Say hi to your new pair!',
        lastMessageTime: lastMsg ? lastMsg.createdAt : m.createdAt
      };
    }));

    // Filter out any orphaned matches where targetUser was deleted
    const validMatches = formattedMatches.filter(m => m.targetUser !== null);
    
    res.json(validMatches);
  } catch (err) {
    console.error('Get matches error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

