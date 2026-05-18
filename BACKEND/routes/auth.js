const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { hasMongoConnection } = require('../utils/dbState');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, department });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, department: user.department } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: 'Wrong password' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, department: user.department } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'Email is required' });

    const resetToken = jwt.sign({ email, type: 'password-reset' }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' });
    if (hasMongoConnection()) {
      await User.findOneAndUpdate(
        { email },
        { resetToken, resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000) }
      );
    }

    res.json({
      msg: 'Password reset link generated. Email delivery is simulated for the hackathon MVP.',
      resetToken,
      resetUrl: `/reset-password/${resetToken}`,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ msg: 'Token and password are required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    if (decoded.type !== 'password-reset') return res.status(400).json({ msg: 'Invalid reset token' });

    if (hasMongoConnection()) {
      const hash = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { email: decoded.email },
        { password: hash, resetToken: null, resetTokenExpires: null }
      );
    }

    res.json({ msg: 'Password reset successful.' });
  } catch (err) {
    res.status(400).json({ msg: 'Reset link is invalid or expired.' });
  }
});

module.exports = router;
