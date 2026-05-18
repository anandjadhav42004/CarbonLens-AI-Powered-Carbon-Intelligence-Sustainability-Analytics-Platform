const router = require('express').Router();
const User = require('../models/User');
const upload = require('../utils/upload');
const { hasMongoConnection } = require('../utils/dbState');

const memoryProfiles = new Map();

router.get('/profile/:id', async (req, res) => {
  try {
    if (hasMongoConnection()) {
      const user = await User.findById(req.params.id).select('-password -resetToken');
      return res.json(user || memoryProfiles.get(req.params.id) || null);
    }
    res.json(memoryProfiles.get(req.params.id) || null);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    const { id = 'demo-user', name, bio, organization, sustainabilityGoals } = req.body;
    const updates = {
      ...(name ? { name } : {}),
      ...(bio !== undefined ? { bio } : {}),
      ...(organization !== undefined ? { organization } : {}),
      ...(sustainabilityGoals ? { sustainabilityGoals: String(sustainabilityGoals).split(',').map((item) => item.trim()).filter(Boolean) } : {}),
      ...(req.file ? { avatar: `/uploads/${req.file.filename}` } : {}),
    };

    if (hasMongoConnection() && id !== 'demo-user') {
      const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password -resetToken');
      return res.json(user);
    }
    const profile = { id, ...(memoryProfiles.get(id) || {}), ...updates };
    memoryProfiles.set(id, profile);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
