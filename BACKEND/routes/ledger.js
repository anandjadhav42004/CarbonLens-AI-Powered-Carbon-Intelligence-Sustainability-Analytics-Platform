const router = require('express').Router();
const Ledger = require('../models/Ledger');
const auth = require('../middleware/auth');
const { hasMongoConnection } = require('../utils/dbState');

const memoryLedger = [];

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { action, category, carbonValue, sustainabilityScore = 70 } = req.body;
    if (!action || !category || carbonValue === undefined) {
      return res.status(400).json({ msg: 'action, category and carbonValue are required' });
    }

    const payload = {
      userId,
      action,
      category,
      carbonValue: Number(carbonValue),
      sustainabilityScore: Number(sustainabilityScore),
      timestamp: new Date(),
    };

    const entry = hasMongoConnection()
      ? await Ledger.create(payload)
      : { ...payload, _id: `memory-ledger-${Date.now()}` };

    if (!hasMongoConnection()) memoryLedger.unshift(entry);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    const entries = hasMongoConnection()
      ? await Ledger.find({ userId: req.params.id }).sort({ timestamp: -1 }).limit(50)
      : memoryLedger.filter((entry) => String(entry.userId) === String(req.params.id)).slice(0, 50);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
