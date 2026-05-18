const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  userId: { type: String },
  author: { type: String, default: 'CarbonLens Member' },
  comment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
