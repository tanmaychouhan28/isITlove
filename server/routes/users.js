const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
  analyzeFullProfile,
  extractGithubUsername,
  extractLeetcodeUsername,
  extractLinkedinUsername
} = require('../utils/analyzer');

const router = express.Router();

// Helper to compute stack compatibility
function calculateCompatibility(me, target) {
  let score = 70;
  if (!me || !target) return 85;

  const myStack = new Set(me.stack || []);
  const targetStack = target.stack || [];
  
  let shared = 0;
  targetStack.forEach(tech => {
    if (myStack.has(tech)) shared++;
  });

  score += Math.min(shared * 6, 22);

  // Interest overlap
  const myInterests = new Set(me.interests || []);
  (target.interests || []).forEach(int => {
    if (myInterests.has(int)) score += 3;
  });

  return Math.min(Math.max(score, 72), 99);
}

// Public Leaderboard with category filters
router.get('/leaderboard', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isBot: { $ne: true } };

    if (category && category !== 'All') {
      if (category === 'Frontend') {
        query.stack = { $in: ['React', 'TypeScript', 'Vue', 'Next.js', 'Angular', 'Tailwind', 'CSS'] };
      } else if (category === 'Backend') {
        query.stack = { $in: ['Go', 'Node.js', 'PostgreSQL', 'Java', 'Python', 'Redis', 'Spring Boot', 'Kafka'] };
      } else if (category === 'AI/ML') {
        query.stack = { $in: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'Rust'] };
      } else if (category === 'Mobile') {
        query.stack = { $in: ['Swift', 'SwiftUI', 'Flutter', 'Kotlin', 'React Native'] };
      } else if (category === 'DevOps') {
        query.stack = { $in: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Linux', 'GCP'] };
      }
    }

    const users = await User.find(query)
      .select('name emoji avatarUrl role company stack ghContrib lcSolved lcRating devScore ghUrl lcUrl liUrl platformAnalysis')
      .sort({ devScore: -1 })
      .limit(50);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authenticated Routes
router.use(auth);

// Purge all bot / mock accounts (admin action - requires auth)
router.delete('/purge-bots', async (req, res) => {
  try {
    const result = await User.deleteMany({
      $or: [
        { isBot: true },
        { email: { $regex: /@devpair\.dev$/i } }
      ]
    });
    res.json({ message: `Purged ${result.deletedCount} bot account(s).`, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// On-Demand Multi-Platform Profile Analysis
router.post('/analyze', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ghUrl = req.body.ghUrl || user.ghUrl || user.ghUser;
    const lcUrl = req.body.lcUrl || user.lcUrl || user.lcUser;
    const liUrl = req.body.liUrl || user.liUrl || user.liUser;

    const analysis = await analyzeFullProfile({
      ghUrl,
      lcUrl,
      liUrl,
      stack: user.stack || [],
      role: user.role || 'Software Engineer',
      company: user.company || '',
      experience: user.experience || '',
      name: user.name || 'Developer'
    });

    user.platformAnalysis = analysis;
    if (analysis.github?.username) {
      user.ghUser = analysis.github.username;
      user.ghUrl = analysis.github.url || `https://github.com/${user.ghUser}`;
      user.ghContrib = (analysis.github.publicRepos || 0) * 12 + (analysis.github.followers || 0) * 5 + (analysis.github.totalStars || 0) * 15;
      if (analysis.github.avatarUrl && !user.avatarUrl) {
        user.avatarUrl = analysis.github.avatarUrl;
      }
    }
    if (analysis.leetcode?.username) {
      user.lcUser = analysis.leetcode.username;
      user.lcUrl = analysis.leetcode.url || `https://leetcode.com/u/${user.lcUser}/`;
      user.lcSolved = analysis.leetcode.totalSolved || user.lcSolved || 0;
      user.lcRating = analysis.leetcode.ranking ? Math.min(2200, Math.max(1400, 2400 - Math.floor(analysis.leetcode.ranking / 10000))) : 1600;
    }
    if (analysis.linkedin?.username) {
      user.liUser = analysis.linkedin.username;
      user.liUrl = analysis.linkedin.url || `https://www.linkedin.com/in/${user.liUser}/`;
    }

    user.calcDevScore();
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    res.json({ success: true, analysis, user: userObj });
  } catch (err) {
    console.error('Analyze profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData._id;

    if (updateData.avatar && !updateData.emoji) {
      updateData.emoji = updateData.avatar;
    }
    if (updateData.techStack && !updateData.stack) {
      updateData.stack = updateData.techStack;
    }

    // Normalize usernames from URLs
    if (updateData.ghUrl || updateData.ghUser) {
      updateData.ghUser = extractGithubUsername(updateData.ghUrl || updateData.ghUser);
      updateData.ghUrl = updateData.ghUrl || (updateData.ghUser ? `https://github.com/${updateData.ghUser}` : '');
    }
    if (updateData.lcUrl || updateData.lcUser) {
      updateData.lcUser = extractLeetcodeUsername(updateData.lcUrl || updateData.lcUser);
      updateData.lcUrl = updateData.lcUrl || (updateData.lcUser ? `https://leetcode.com/u/${updateData.lcUser}/` : '');
    }
    if (updateData.liUrl || updateData.liUser) {
      updateData.liUser = extractLinkedinUsername(updateData.liUrl || updateData.liUser);
      updateData.liUrl = updateData.liUrl || (updateData.liUser ? `https://www.linkedin.com/in/${updateData.liUser}/` : '');
    }

    Object.assign(user, updateData);

    // Run multi-platform analysis automatically
    try {
      const analysis = await analyzeFullProfile({
        ghUrl: user.ghUrl || user.ghUser,
        lcUrl: user.lcUrl || user.lcUser,
        liUrl: user.liUrl || user.liUser,
        stack: user.stack || [],
        role: user.role || 'Software Engineer',
        company: user.company || '',
        experience: user.experience || '',
        name: user.name || 'Developer'
      });
      user.platformAnalysis = analysis;
      if (analysis.github?.avatarUrl && !user.avatarUrl) {
        user.avatarUrl = analysis.github.avatarUrl;
      }
      if (analysis.leetcode?.totalSolved) {
        user.lcSolved = analysis.leetcode.totalSolved;
      }
    } catch (analysisErr) {
      console.warn('Auto analysis during update warning:', analysisErr.message);
    }

    user.calcDevScore();
    await user.save();
    
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Discover feed with compatibility score
router.get('/discover', async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ message: 'User not found' });

    const excludeIds = [...(me.liked || []), ...(me.passed || []), me._id];
    
    // Only real profiles (exclude bots and already swiped)
    const users = await User.find({
      _id: { $nin: excludeIds },
      isBot: { $ne: true },
      email: { $not: /@devpair\.dev$/i }
    })
      .select('-password')
      .limit(30);
      
    const enriched = users.map(u => {
      const obj = u.toObject();
      obj.compatScore = calculateCompatibility(me, u);
      return obj;
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset discover feed (re-explore passed profiles)
router.post('/reset-discover', async (req, res) => {
  try {
    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ message: 'User not found' });

    me.passed = [];
    await me.save();

    res.json({ message: 'Feed reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/pass', async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ message: 'targetId required' });

    const me = await User.findById(req.userId);
    if (me && !me.passed.includes(targetId)) {
      me.passed.push(targetId);
      await me.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


