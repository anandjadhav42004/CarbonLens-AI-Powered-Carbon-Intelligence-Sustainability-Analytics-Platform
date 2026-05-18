const router = require('express').Router();

router.get('/sync', (req, res) => {
  const seed = Date.now() % 100;
  res.json({
    syncedAt: new Date().toISOString(),
    electricityUsageKwh: Number((18 + seed / 20).toFixed(1)),
    transportKm: Number((22 + seed / 8).toFixed(1)),
    fuelUsageLitres: Number((3.5 + seed / 30).toFixed(1)),
    energyConsumptionScore: Math.max(45, 92 - Math.round(seed / 2)),
    carbonEstimateKg: Number((12 + seed / 9).toFixed(1)),
    categories: [
      { subject: 'Mobility', value: Math.max(25, 90 - Math.round(seed / 3)), fullMark: 100 },
      { subject: 'Nutrition', value: 82, fullMark: 100 },
      { subject: 'Electricity', value: Math.max(25, 88 - Math.round(seed / 4)), fullMark: 100 },
      { subject: 'Flights', value: 76, fullMark: 100 },
      { subject: 'Waste Audit', value: 91, fullMark: 100 },
    ],
  });
});

module.exports = router;
