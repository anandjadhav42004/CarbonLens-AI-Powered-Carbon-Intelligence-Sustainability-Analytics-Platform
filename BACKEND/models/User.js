const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  department: { type: String, required: true },
  ecoScore:   { type: Number, default: 50 },
  bio:         { type: String, default: '' },
  organization: { type: String, default: '' },
  avatar:      { type: String, default: '' },
  sustainabilityGoals: { type: [String], default: [] },
  resetToken:  { type: String },
  resetTokenExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
