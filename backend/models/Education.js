const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  logo: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  courses: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
