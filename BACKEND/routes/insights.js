const router = require('express').Router();
const auth = require('../middleware/auth');
const Emission = require('../models/Emission');
const OpenAI = require('openai');

// Helper to generate highly tailored tips locally if OpenAI is unavailable
function generateLocalInsights(avg) {
  const tips = [];
  
  const transportAvg = parseFloat(avg.transport);
  const electricityAvg = parseFloat(avg.electricity);
  const digitalAvg = parseFloat(avg.digital);

  // 1. Transport Tip
  if (transportAvg > 10) {
    tips.push({
      tip: `Your daily commute of ${transportAvg} km/day is quite high. Try swapping just 2 drive-alone days a week for public transport or carpooling.`,
      saving: `${(transportAvg * 0.21 * 7 * 0.4).toFixed(1)} kg CO₂/week`
    });
  } else if (transportAvg > 3) {
    tips.push({
      tip: `Moderate daily travel (${transportAvg} km/day). Walking or bicycling for trips under 3 km is a great way to stay fit and cut emissions.`,
      saving: `${(transportAvg * 0.21 * 7 * 0.3).toFixed(1)} kg CO₂/week`
    });
  } else {
    tips.push({
      tip: "Fantastic work! Your transport carbon footprint is exceptionally low. Try advocating for campus-wide cycling routes.",
      saving: "1.5 kg CO₂/week"
    });
  }

  // 2. Electricity Tip
  if (electricityAvg > 8) {
    tips.push({
      tip: `Your power usage is above average (${electricityAvg} kWh/day). Consider setting your AC/heater 2°C higher/lower, and disconnect standby electronics.`,
      saving: `${(electricityAvg * 0.82 * 7 * 0.25).toFixed(1)} kg CO₂/week`
    });
  } else if (electricityAvg > 3) {
    tips.push({
      tip: `Moderate power usage (${electricityAvg} kWh/day). Swapping traditional bulbs for high-efficiency LEDs will make a significant impact.`,
      saving: `${(electricityAvg * 0.82 * 7 * 0.15).toFixed(1)} kg CO₂/week`
    });
  } else {
    tips.push({
      tip: "You are an energy efficiency champion! Unplugging idle devices and utilizing natural light is paying off.",
      saving: "1.2 kg CO₂/week"
    });
  }

  // 3. Digital Tip
  if (digitalAvg > 6) {
    tips.push({
      tip: `High screen time (${digitalAvg} hrs/day) increases data center cooling needs. Dimming display brightness and deleting old email/cloud drafts helps!`,
      saving: `${(digitalAvg * 0.036 * 7 * 0.3).toFixed(1)} kg CO₂/week`
    });
  } else if (digitalAvg > 3) {
    tips.push({
      tip: `Your screen time is moderate (${digitalAvg} hrs/day). Turning off video feeds in large meetings and disabling background app refresh reduces data server demand.`,
      saving: `${(digitalAvg * 0.036 * 7 * 0.25).toFixed(1)} kg CO₂/week`
    });
  } else {
    tips.push({
      tip: "Great digital balance! Keeping active off-screen keeps your device digital emissions at a minimum.",
      saving: "0.8 kg CO₂/week"
    });
  }

  return tips;
}

// GET /api/insights
router.get('/', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(7);
    if (logs.length === 0) {
      return res.json([{ 
        tip: 'Log some daily activities first to receive your personalized CarbonLens AI insights!', 
        saving: '0.0 kg CO₂/week' 
      }]);
    }

    const avg = {
      transport: (logs.reduce((sum, log) => sum + (log.transport || 0), 0) / logs.length).toFixed(1),
      electricity: (logs.reduce((sum, log) => sum + (log.electricity || 0), 0) / logs.length).toFixed(1),
      digital: (logs.reduce((sum, log) => sum + (log.digital || 0), 0) / logs.length).toFixed(1),
    };

    // If API key is missing, fall back to local calculations immediately
    if (!process.env.OPENAI_API_KEY) {
      const localTips = generateLocalInsights(avg);
      return res.json(localTips);
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `A student's weekly average emissions: transport ${avg.transport}km/day, electricity ${avg.electricity}kWh/day, digital usage ${avg.digital}hrs/day.
Give exactly 3 short, specific, actionable sustainability tips based on these numbers.
Reply ONLY as a JSON array with no extra text: [{"tip":"...","saving":"X kg CO2/week"}]`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        timeout: 4000 // Fast timeout
      });

      res.json(JSON.parse(completion.choices[0].message.content));
    } catch (apiErr) {
      console.warn('⚠️ OpenAI API call failed, generating fallback insights locally:', apiErr.message);
      const localTips = generateLocalInsights(avg);
      res.json(localTips);
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;

