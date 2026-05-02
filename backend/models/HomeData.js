const mongoose = require('mongoose');

const homeDataSchema = new mongoose.Schema({
  profileImage: { type: String },
  heroImage: { type: String },
  cvFile: { type: String },
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  heroDescription: { type: String },
  email: { type: String },
  github: { type: String },
  linkedin: { type: String },
  projectsCount: { type: String },
  name: { type: String },
  designation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HomeData', homeDataSchema);
