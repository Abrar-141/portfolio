const mongoose = require('mongoose');

const inviteTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('InviteToken', inviteTokenSchema);
