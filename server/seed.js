require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('./seedData');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devpair')
  .then(async () => {
    console.log('MongoDB connected. Initializing clean real user database...');
    await seedDatabase();
    console.log('Seed complete.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });

