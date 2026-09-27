const mongoose = require('mongoose');

async function test() {
  console.log('Testing MongoDB connection...');
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/devpair', { serverSelectionTimeoutMS: 2000 });
    console.log('Local MongoDB connected successfully!');
    process.exit(0);
  } catch (err) {
    console.log('Local MongoDB not found:', err.message);
    console.log('Starting MongoMemoryServer test...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      console.log('MongoMemoryServer created URI:', mongod.getUri());
      process.exit(0);
    } catch (e) {
      console.error('MongoMemoryServer error:', e);
      process.exit(1);
    }
  }
}

test();
