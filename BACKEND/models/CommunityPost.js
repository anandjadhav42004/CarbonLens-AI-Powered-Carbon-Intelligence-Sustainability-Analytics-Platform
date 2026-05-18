const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String },
  role: { type: String },
  content: { type: String, required: true },
  image: { type: String },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
