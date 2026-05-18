const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date:        { type: Date, default: Date.now },
  transport:   { type: Number },
  electricity: { type: Number },
  food:        { type: String },
  digital:     { type: Number },
  totalCO2:    { type: Number },
  ecoScore:    { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Emission', EmissionSchema);
