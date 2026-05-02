const mongoose = require('mongoose');

const aboutDataSchema = new mongoose.Schema({
  profileImage: { type: String },
  name: { type: String },
  title: { type: String },
  bio: { type: String },
  quote: { type: String },
  focus: [{
    title: { type: String },
    value: { type: String }
  }],
  stats: [{
    number: { type: String },
    label: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('AboutData', aboutDataSchema);
