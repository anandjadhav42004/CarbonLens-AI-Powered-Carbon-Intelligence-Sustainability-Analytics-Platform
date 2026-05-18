const router = require('express').Router();
const Comment = require('../models/Comment');
const { hasMongoConnection } = require('../utils/dbState');

const memoryComments = [];

router.post('/', async (req, res) => {
  try {
    const { postId, userId = 'demo-user', author = 'CarbonLens Member', comment } = req.body;
    if (!postId || !comment) return res.status(400).json({ msg: 'postId and comment are required' });
    const payload = { postId, userId, author, comment };
    const saved = hasMongoConnection()
      ? await Comment.create(payload)
      : { ...payload, _id: `memory-comment-${Date.now()}`, createdAt: new Date() };
    if (!hasMongoConnection()) memoryComments.unshift(saved);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const comments = hasMongoConnection()
      ? await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 })
      : memoryComments.filter((item) => String(item.postId) === String(req.params.postId)).reverse();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
