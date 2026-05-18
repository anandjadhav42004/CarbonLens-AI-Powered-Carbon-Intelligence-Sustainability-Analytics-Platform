const router = require('express').Router();

router.post('/', (req, res) => {
  const { monthlyEmissions = 320, ecoScore = 78 } = req.body;
  const predicted = Math.max(0, Number(monthlyEmissions) * 0.88);
  const trend = predicted < monthlyEmissions ? 'Improving' : 'Needs Attention';
  const riskLevel = predicted > 450 ? 'High' : predicted > 250 ? 'Moderate' : 'Low';

  res.json({
    generatedAt: new Date().toISOString(),
    nextMonthCarbonPrediction: Number(predicted.toFixed(1)),
    sustainabilityTrend: trend,
    riskLevel,
    ecoScoreForecast: Math.min(100, Math.round(Number(ecoScore) + (trend === 'Improving' ? 6 : -4))),
    recommendations: [
      'Shift high-emission transport days to public transit twice per week.',
      'Move electricity-intensive tasks to renewable-heavy hours.',
      'Prioritize the largest dashboard category for the next 30 days.',
    ],
  });
});

module.exports = router;
