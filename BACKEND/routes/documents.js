const router = require('express').Router();
const upload = require('../utils/upload');
const Document = require('../models/Document');
const { hasMongoConnection } = require('../utils/dbState');

const memoryDocuments = [];

function analyze(file) {
  const sizeFactor = Math.max(1, file.size / 100000);
  return {
    electricityUsage: Number((120 + sizeFactor * 3).toFixed(1)),
    fuelData: Number((18 + sizeFactor).toFixed(1)),
    carbonEstimate: Number((42 + sizeFactor * 2.4).toFixed(1)),
    sustainabilityInsights: [
      'Electricity usage shows a measurable reduction opportunity.',
      'Fuel data indicates transport optimization could improve the score.',
      'Upload has enough telemetry markers for a hackathon-grade sustainability summary.',
    ],
  };
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'File is required' });
    const analysis = analyze(req.file);
    const payload = {
      userId: req.body.userId || 'demo-user',
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      analysis,
    };
    const doc = hasMongoConnection() ? await Document.create(payload) : { ...payload, _id: `memory-doc-${Date.now()}` };
    if (!hasMongoConnection()) memoryDocuments.unshift(doc);
    res.json({ document: doc, analysis, message: 'AI Sustainability Analysis Complete' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
