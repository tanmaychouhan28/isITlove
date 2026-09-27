const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 22 },
  emoji: { type: String, default: '👨‍💻' },
  avatarUrl: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  role: { type: String, default: 'Software Engineer' },
  company: { type: String, default: '' },
  experience: { type: String, default: 'Student / Early Career' },
  stack: [{ type: String }],
  
  // Multi-platform Profile Links & Handles
  ghUser: { type: String, default: '' },
  ghUrl: { type: String, default: '' },
  ghContrib: { type: Number, default: 0 },

  lcUser: { type: String, default: '' },
  lcUrl: { type: String, default: '' },
  lcSolved: { type: Number, default: 0 },
  lcRating: { type: Number, default: 0 },

  liUser: { type: String, default: '' },
  liUrl: { type: String, default: '' },

  // Automatic Multi-Platform Analysis
  platformAnalysis: {
    github: { type: Object, default: () => ({}) },
    leetcode: { type: Object, default: () => ({}) },
    linkedin: { type: Object, default: () => ({}) },
    overall: { type: Object, default: () => ({}) },
    analyzedAt: { type: Date }
  },

  isBot: { type: Boolean, default: false },

  prompts: [{
    q: { type: String },
    a: { type: String }
  }],
  bio: { type: String, default: '' },
  interests: [{ type: String }],
  intention: { type: String, default: 'Pair programming partner' },
  devScore: { type: Number, default: 850 },
  passed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.calcDevScore = function () {
  // If we have an overall analysis score, use it as baseline
  if (this.platformAnalysis?.overall?.devScore) {
    this.devScore = this.platformAnalysis.overall.devScore;
    return this.devScore;
  }

  let score = 750;
  const contrib = Number(this.ghContrib) || 0;
  const solved = Number(this.lcSolved) || (this.platformAnalysis?.leetcode?.totalSolved || 0);
  const rating = Number(this.lcRating) || 0;
  const stackLen = Array.isArray(this.stack) ? this.stack.length : 0;

  if (this.ghUrl || this.ghUser) score += 150;
  if (this.lcUrl || this.lcUser) score += 150;
  if (this.liUrl || this.liUser) score += 120;

  score += Math.min(contrib * 0.4, 450);
  score += Math.min(solved * 1.5, 400);
  if (rating > 1200) {
    score += (rating - 1200) * 0.35;
  }
  score += stackLen * 25;
  this.devScore = Math.round(score);
  return this.devScore;
};

module.exports = mongoose.model('User', userSchema);


