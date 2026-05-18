const mongoose = require('mongoose');

const AuditEntrySchema = new mongoose.Schema({
  organization: { type: String, required: true },
  emissionData: { type: Number, required: true },
  status: { type: String, enum: ['Verified', 'Flagged', 'Pending'], default: 'Pending' },
  category: { type: String, required: true },
  remarks: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('AuditEntry', AuditEntrySchema);
