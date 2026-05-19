const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date:        { type: Date, default: Date.now },
  transport:   { type: Number },
  electricity: { type: Number },
  food:        { type: String },
  digital:     { type: Number },
  category:    { type: String },
  amountKg:    { type: Number },
  unit:        { type: String, default: 'kg CO2e' },
  source:      { type: String, default: 'calculator' },
  estimatedBy: { type: String, default: 'local_factor' },
  metadata:    { type: mongoose.Schema.Types.Mixed },
  carbonInterfaceId: { type: String },
  totalCO2:    { type: Number },
  ecoScore:    { type: Number },
}, { timestamps: true });

const MongooseModel = mongoose.model('Emission', EmissionSchema);

// Dynamic proxy wrapper to allow running in mock DB mode seamlessly
const proxyEmission = new Proxy({}, {
  get(target, prop) {
    if (process.env.MOCK_DB === 'true') {
      return require('./mockDb').MockEmission[prop];
    }
    return MongooseModel[prop];
  }
});

module.exports = proxyEmission;

