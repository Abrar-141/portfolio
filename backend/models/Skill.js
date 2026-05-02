const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, default: 50 },
  expertise: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
