const router = require('express').Router();
const CircleMembership = require('../models/CircleMembership');
const auth = require('../middleware/auth');
const { hasMongoConnection } = require('../utils/dbState');

const memoryMemberships = [];

router.post('/join', auth, async (req, res) => {
  try {
    const { circleId } = req.body;
    const userId = req.userId;
    if (!circleId) return res.status(400).json({ msg: 'circleId is required' });

    if (hasMongoConnection()) {
      const membership = await CircleMembership.findOneAndUpdate(
        { userId, circleId },
        { userId, circleId, joinedAt: new Date() },
        { upsert: true, new: true }
      );
      return res.json(membership);
    }

    if (!memoryMemberships.some((item) => item.userId === userId && item.circleId === circleId)) {
      memoryMemberships.push({ userId, circleId, joinedAt: new Date() });
    }
    res.json({ userId, circleId, joinedAt: new Date() });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/user/:id', auth, async (req, res) => {
  try {
    const memberships = hasMongoConnection()
      ? await CircleMembership.find({ userId: req.params.id })
      : memoryMemberships.filter((item) => item.userId === req.params.id);
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
