const router = require('express').Router();
const User   = require('../models/User');

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: {
          _id:      '$department',
          avgScore: { $avg: '$ecoScore' },
          members:  { $sum: 1 }
      }},
      { $sort: { avgScore: -1 } },
      { $limit: 10 }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
