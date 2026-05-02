const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [{ type: String }],
  image: { type: String },
  github: { type: String },
  live: { type: String },
  pdf: { type: String },
  sourceCode: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
