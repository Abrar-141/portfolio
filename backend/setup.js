require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Admin = mongoose.model('Admin', new mongoose.Schema({
      fullName: String,
      username: String,
      email: String,
      password: String
    }, { timestamps: true }));
    
    // Delete old admins
    await Admin.deleteMany({});
    console.log('🗑️  Cleared old admin accounts\n');
    
    // Hash password manually
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create new admin
    const admin = new Admin({
      fullName: 'Admin User',
      username: 'admin',
      email: 'admin@portfolio.com',
      password: hashedPassword
    });
    
    await admin.save();
    console.log('✅ Admin account created!\n');
    console.log('📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');
    console.log('🚀 Now start the server and login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

setupAdmin();
