require('dotenv').config();
const mongoose = require('mongoose');

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Admin = mongoose.model('Admin', new mongoose.Schema({
      fullName: String,
      username: String,
      email: String,
      password: String
    }, { timestamps: true }));
    
    const admins = await Admin.find({});
    console.log(`📊 Total admins: ${admins.length}\n`);
    
    admins.forEach((admin, i) => {
      console.log(`Admin ${i + 1}:`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Full Name: ${admin.fullName}`);
      console.log(`  Password Hash: ${admin.password.substring(0, 20)}...`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkAdmins();
