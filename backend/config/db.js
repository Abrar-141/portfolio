const mongoose = require('mongoose');

// Polyfill for crypto in Railway environment
if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto;
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
