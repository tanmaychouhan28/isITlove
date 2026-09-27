const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  type: { type: String, enum: ['text', 'code'], default: 'text' },
  codeLang: { type: String },
  codeContent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
