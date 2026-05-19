const router = require('express').Router();
const AuditEntry = require('../models/AuditEntry');
const auth = require('../middleware/auth');
const { hasMongoConnection } = require('../utils/dbState');

const memoryAuditEntries = [];

router.post('/entries', auth, async (req, res) => {
  try {
    const { organization, emissionData, status = 'Pending', category, remarks = '' } = req.body;
    if (!organization || emissionData === undefined || !category) {
      return res.status(400).json({ msg: 'organization, emissionData and category are required' });
    }
    const payload = { organization, emissionData: Number(emissionData), status, category, remarks };
    const entry = hasMongoConnection()
      ? await AuditEntry.create(payload)
      : { ...payload, _id: `memory-audit-${Date.now()}`, createdAt: new Date() };
    if (!hasMongoConnection()) memoryAuditEntries.unshift(entry);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/entries', auth, async (req, res) => {
  try {
    const entries = hasMongoConnection()
      ? await AuditEntry.find({}).sort({ createdAt: -1 }).limit(50)
      : memoryAuditEntries;
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

async function updateStatus(req, res, status) {
  const { id } = req.params;
  if (hasMongoConnection()) {
    const entry = await AuditEntry.findByIdAndUpdate(id, { status }, { new: true });
    return res.json(entry || { _id: id, status });
  }
  const entry = memoryAuditEntries.find((item) => String(item._id) === String(id));
  if (entry) entry.status = status;
  return res.json(entry || { _id: id, status });
}

router.patch('/verify/:id', auth, (req, res) => updateStatus(req, res, 'Verified').catch((err) => res.status(500).json({ msg: err.message })));
router.patch('/flag/:id', auth, (req, res) => updateStatus(req, res, 'Flagged').catch((err) => res.status(500).json({ msg: err.message })));

module.exports = router;
