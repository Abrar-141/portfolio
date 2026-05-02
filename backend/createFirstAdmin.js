require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const createFirstAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin already exists!');
      process.exit(0);
    }

    // Create first admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = new Admin({
      fullName: 'Hafiz Abrar Iqbal',
      username: 'admin',
      email: 'admin@hafizabrar.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('✅ First admin created successfully!');
    console.log('Username: admin');
    console.log('Password: Admin@123');
    console.log('\nYou can now login and generate invite links for other admins.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createFirstAdmin();
