const mongoose = require('mongoose');

const LedgerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  category: { type: String, required: true },
  carbonValue: { type: Number, required: true },
  sustainabilityScore: { type: Number, default: 70 },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Ledger', LedgerSchema);
