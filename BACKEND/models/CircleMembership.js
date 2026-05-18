const mongoose = require('mongoose');

const CircleMembershipSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  circleId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
}, { timestamps: true });

CircleMembershipSchema.index({ userId: 1, circleId: 1 }, { unique: true });

module.exports = mongoose.model('CircleMembership', CircleMembershipSchema);
