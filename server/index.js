require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const IS_PROD = process.env.NODE_ENV === 'production';

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const messageRoutes = require('./routes/messages');
const socketHandler = require('./socket');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(express.json());
app.use(cors({ origin: '*' }));
if (!IS_PROD) app.use(morgan('dev'));

// Make io accessible in routes
app.set('io', io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  let mongoUri = process.env.MONGO_URI;

  // If standard URI fails or is localhost, use in-memory server
  let connected = false;
  if (mongoUri && !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost')) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
      console.log('Connected to external MongoDB (Atlas)');
      connected = true;
    } catch (e) {
      console.log('External MongoDB connection failed:', e.message);
      console.log('Falling back to in-memory / local MongoDB...');
    }
  }

  if (!connected) {
    try {
      // First try local default port quickly
      await mongoose.connect('mongodb://127.0.0.1:27017/devpair', { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB (port 27017)');
      connected = true;
    } catch (e) {
      console.log('Local MongoDB not running, booting in-memory MongoDB engine...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        await mongoose.connect(mongoUri);
        console.log('In-memory MongoDB successfully connected');
        connected = true;
      } catch (memErr) {
        console.error('MongoMemoryServer error:', memErr.message);
        console.log('Retrying connection...');
        await mongoose.connect('mongodb://127.0.0.1:27017/devpair');
      }
    }
  }

  // Auto-seed real profile and purge old bot accounts
  try {
    const User = require('./models/User');
    const botCount = await User.countDocuments({ email: /@devpair\.dev$/i });
    if (botCount > 0) {
      console.log(`Found ${botCount} old bot profiles — purging...`);
      await User.deleteMany({ email: /@devpair\.dev$/i });
    }

    const tanmayExists = await User.findOne({ email: 'tanmaychoouhantc@gmail.com' });
    const yugExists = await User.findOne({ email: 'yugshah197@gmail.com' });
    if (!tanmayExists || !yugExists) {
      console.log('Seeding missing real user accounts with multi-platform live analysis...');
      await require('./seedData')();
      console.log('Seeded real users successfully!');
    }
  } catch (seedErr) {
    console.error('Seed/purge error:', seedErr);
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/matches', matchRoutes);
  app.use('/api/messages', messageRoutes);

  socketHandler(io);

  // In production, serve the Vite-built React app
  if (IS_PROD) {
    const distPath = path.join(__dirname, '../client/dist');
    app.use(express.static(distPath));
    // Catch-all: let React Router handle client-side routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production build from client/dist');
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`\n  isITlove is live on port ${PORT} 🚀`);
    if (!IS_PROD) console.log(`  Frontend: http://localhost:5173\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

