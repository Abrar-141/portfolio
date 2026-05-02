require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const freshSetup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Define Admin schema
    const adminSchema = new mongoose.Schema({
      fullName: String,
      username: String,
      email: String,
      password: String
    }, { timestamps: true });
    
    const Admin = mongoose.model('Admin', adminSchema);
    
    // Clear all admins
    await Admin.deleteMany({});
    console.log('🗑️  Cleared all admin accounts\n');
    
    // Create new admin with hashed password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = new Admin({
      fullName: 'Admin User',
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword
    });
    
    await admin.save();
    console.log('✅ Admin account created!\n');
    
    // Test password comparison
    const testMatch = await bcrypt.compare(password, hashedPassword);
    console.log('🔐 Password hash test:', testMatch ? 'PASS ✅' : 'FAIL ❌');
    
    console.log('\n📝 Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

freshSetup();
