const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  analyzeFullProfile,
  extractGithubUsername,
  extractLeetcodeUsername,
  extractLinkedinUsername
} = require('../utils/analyzer');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devpair_secret_key_2026';

// Helper to normalize user payload from frontend
function normalizeUserData(body) {
  const data = { ...body };
  
  // Emoji / avatar normalization
  if (data.avatar && !data.emoji) {
    data.emoji = data.avatar;
  }
  
  // Tech stack normalization
  if (data.techStack && !data.stack) {
    data.stack = Array.isArray(data.techStack) ? data.techStack : [data.techStack];
  } else if (!data.stack) {
    data.stack = [];
  }

  // GitHub user normalization
  if (data.ghUrl || data.githubUsername || data.ghUser) {
    const raw = data.ghUrl || data.githubUsername || data.ghUser;
    data.ghUser = extractGithubUsername(raw);
    data.ghUrl = data.ghUrl || (data.ghUser ? `https://github.com/${data.ghUser}` : '');
  }

  // LeetCode normalization
  if (data.lcUrl || data.leetcodeUsername || data.lcUser) {
    const raw = data.lcUrl || data.leetcodeUsername || data.lcUser;
    data.lcUser = extractLeetcodeUsername(raw);
    data.lcUrl = data.lcUrl || (data.lcUser ? `https://leetcode.com/u/${data.lcUser}/` : '');
  }

  // LinkedIn normalization
  if (data.liUrl || data.linkedinUsername || data.liUser) {
    const raw = data.liUrl || data.linkedinUsername || data.liUser;
    data.liUser = extractLinkedinUsername(raw);
    data.liUrl = data.liUrl || (data.liUser ? `https://www.linkedin.com/in/${data.liUser}/` : '');
  }

  // Prompts normalization
  if (Array.isArray(data.prompts)) {
    data.prompts = data.prompts
      .map(p => {
        if (!p) return null;
        const q = p.q || p.question || '';
        const a = p.a || p.answer || '';
        return (q || a) ? { q, a } : null;
      })
      .filter(Boolean);
  }

  return data;
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields (name, email, password)' });
    }
    
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    
    const normalizedData = normalizeUserData(req.body);
    normalizedData.email = normalizedData.email.toLowerCase().trim();

    // Auto-run profile analysis across platforms
    try {
      const analysis = await analyzeFullProfile({
        ghUrl: normalizedData.ghUrl || normalizedData.ghUser,
        lcUrl: normalizedData.lcUrl || normalizedData.lcUser,
        liUrl: normalizedData.liUrl || normalizedData.liUser,
        stack: normalizedData.stack || [],
        role: normalizedData.role || 'Software Engineer',
        company: normalizedData.company || '',
        experience: normalizedData.experience || '',
        name: normalizedData.name
      });
      normalizedData.platformAnalysis = analysis;
      if (analysis.github?.avatarUrl && !normalizedData.avatarUrl) {
        normalizedData.avatarUrl = analysis.github.avatarUrl;
      }
      if (analysis.leetcode?.totalSolved) {
        normalizedData.lcSolved = analysis.leetcode.totalSolved;
      }
    } catch (analysisErr) {
      console.warn('Signup analysis error:', analysisErr.message);
    }

    const user = new User(normalizedData);
    user.calcDevScore();
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = user.toObject();
    delete userObj.password;
    
    res.status(201).json({ token, user: userObj });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: err.message || 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = user.toObject();
    delete userObj.password;
    
    res.json({ token, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

// 1-Click Demo Login
router.post('/demo', async (req, res) => {
  try {
    const { email } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    }
    if (!user) {
      user = await User.findOne({ isBot: { $ne: true } });
    }
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      return res.status(404).json({ message: 'No active user found.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Demo login failed' });
  }
});

module.exports = router;


