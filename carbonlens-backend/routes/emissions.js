const router   = require('express').Router();
const auth     = require('../middleware/auth');
const Emission = require('../models/Emission');
const User     = require('../models/User');

function calcCO2({ transport, electricity, food, digital }) {
  const foodMap = { vegan: 1.5, veg: 2.5, nonveg: 5.0 };
  return (transport   * 0.21)
       + (electricity * 0.82)
       + (foodMap[food] || 2.5)
       + (digital     * 0.036);
}

// POST /api/emissions/log
router.post('/log', auth, async (req, res) => {
  try {
    const { transport, electricity, food, digital } = req.body;
    const totalCO2 = parseFloat(calcCO2({ transport, electricity, food, digital }).toFixed(2));
    const ecoScore = Math.max(0, Math.round(100 - totalCO2 * 4));
    const log = await Emission.create({
      userId: req.userId, transport, electricity, food, digital, totalCO2, ecoScore
    });
    await User.findByIdAndUpdate(req.userId, { ecoScore });
    res.json({ log, totalCO2, ecoScore });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/emissions/history
router.get('/history', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
