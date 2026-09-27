const User = require('./models/User');
const { analyzeFullProfile } = require('./utils/analyzer');

const initialProfiles = [
  {
    name: 'Tanmay Chouhan',
    email: 'tanmaychoouhantc@gmail.com',
    password: 'password123',
    age: 22,
    emoji: '👨‍💻',
    role: 'Student',
    company: 'University / Indie Developer',
    location: 'India',
    experience: 'Student / Early Career',
    stack: ['JavaScript', 'React', 'Node.js', 'Python', 'FastAPI', 'Vite', 'Tailwind'],
    ghUrl: 'https://github.com/tanmaychouhan28',
    ghUser: 'tanmaychouhan28',
    lcUrl: 'https://leetcode.com/u/enomatic28/',
    lcUser: 'enomatic28',
    liUrl: 'https://www.linkedin.com/in/tanmay-chouhan-aa57aa34b/',
    liUser: 'tanmay-chouhan-aa57aa34b',
    bio: 'Student & Full-Stack Developer passionate about AI security, web technologies, and clean architectures. Creator of ScamShield.',
    interests: ['🛡️ Cybersecurity', '🚀 Full-Stack Dev', '💡 Problem Solving', '☕ Coffee & Code'],
    prompts: [
      {
        q: "The side project I'm most proud of...",
        a: "ScamShield — AI-assisted scam website detector with real-time SSL, WHOIS, DNS, and content analysis."
      },
      {
        q: "My coding superpower is...",
        a: "Rapid full-stack prototyping and turning complex logic into sleek, explainable systems."
      },
      {
        q: "I'll know it's love when...",
        a: "You write clean commits and appreciate good architecture from day one."
      }
    ],
    intention: 'Pair programming & meaningful connections',
    isBot: false
  },
  {
    name: 'Yug Shah',
    email: 'yugshah197@gmail.com',
    password: 'yug@123',
    age: 21,
    emoji: '🏴‍☠️',
    role: 'Full-Stack Developer & Problem Solver',
    company: 'Open Source Contributor',
    location: 'India',
    experience: 'Student / Early Career',
    stack: ['JavaScript', 'Python', 'C++', 'React', 'Node.js', 'Data Structures & Algorithms'],
    ghUrl: 'https://github.com/Yug-the-pirate-king',
    ghUser: 'Yug-the-pirate-king',
    lcUrl: 'https://leetcode.com/u/Yugshah',
    lcUser: 'Yugshah',
    liUrl: 'https://www.linkedin.com/in/yug-shah-531924336',
    liUser: 'yug-shah-531924336',
    bio: 'Software engineer & algorithm enthusiast passionate about building high-performance web applications and solving challenging computational problems.',
    interests: ['⚔️ Competitive Programming', '🌐 Full-Stack Dev', '🏴‍☠️ Open Source', '⚡ Algorithms & Data Structures'],
    prompts: [
      {
        q: "The side project I'm most proud of...",
        a: "Real-time stock dashboard (StockPulse) and AI-driven maritime route decision systems."
      },
      {
        q: "My coding superpower is...",
        a: "Tackling complex algorithmic puzzles and solving 200+ LeetCode problems with optimized time complexity."
      },
      {
        q: "I'll know it's love when...",
        a: "We can pair program without arguing over tabs vs spaces and celebrate green test suites together."
      }
    ],
    intention: 'Pair programming, hackathons & tech discussions',
    isBot: false
  }
];

module.exports = async function seedDatabase() {
  console.log('Seeding discoverable profiles with live multi-platform analysis...');
  await User.deleteMany({});

  for (const u of initialProfiles) {
    try {
      const analysis = await analyzeFullProfile({
        ghUrl: u.ghUrl,
        lcUrl: u.lcUrl,
        liUrl: u.liUrl,
        stack: u.stack,
        role: u.role,
        company: u.company,
        experience: u.experience,
        name: u.name
      });
      u.platformAnalysis = analysis;
      if (analysis.github?.avatarUrl) {
        u.avatarUrl = analysis.github.avatarUrl;
      }
      if (analysis.leetcode?.totalSolved) {
        u.lcSolved = analysis.leetcode.totalSolved;
      }
    } catch (e) {
      console.warn('Analysis warning:', e.message);
    }

    const user = new User(u);
    user.calcDevScore();
    await user.save();
    console.log(`✓ Single Profile ${user.name} seeded with DevScore: ${user.devScore}`);
  }
};
