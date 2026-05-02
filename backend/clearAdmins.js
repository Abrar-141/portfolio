require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const clearAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Admin.deleteMany({});
    console.log('✅ All admin accounts deleted');
    console.log('Now create a new account via /signup');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

clearAdmins();
