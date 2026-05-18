const router = require('express').Router();
const upload = require('../utils/upload');

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'File is required' });
  res.json({
    fileName: req.file.originalname,
    url: `/uploads/${req.file.filename}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
});

module.exports = router;
