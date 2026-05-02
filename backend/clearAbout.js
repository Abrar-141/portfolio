const mongoose = require('mongoose');
require('dotenv').config();

const AboutData = require('./models/AboutData');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await AboutData.deleteMany({});
    
    const newAbout = new AboutData({
      profileImage: '/My Pic.png.webp',
      name: 'Hafiz Abrar Iqbal',
      title: 'Software Engineer | UI/UX Designer',
      bio: '',
      quote: '',
      focus: [],
      stats: []
    });
    
    await newAbout.save();
    console.log('✅ About data cleared successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
