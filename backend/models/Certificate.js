const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String },
  link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
