const router   = require('express').Router();
const auth     = require('../middleware/auth');
const Emission = require('../models/Emission');
const OpenAI   = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// GET /api/insights
router.get('/', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(7);
    if (logs.length === 0) return res.json([{ tip: 'Log some activity first to get personalised tips!', saving: '0 kg CO₂/week' }]);

    const avg = {
      transport:   (logs.reduce((s, l) => s + l.transport,   0) / logs.length).toFixed(1),
      electricity: (logs.reduce((s, l) => s + l.electricity, 0) / logs.length).toFixed(1),
      digital:     (logs.reduce((s, l) => s + l.digital,     0) / logs.length).toFixed(1),
    };

    const prompt = `A student's weekly average emissions: transport ${avg.transport}km/day, electricity ${avg.electricity}kWh/day, digital usage ${avg.digital}hrs/day.
Give exactly 3 short, specific, actionable sustainability tips based on these numbers.
Reply ONLY as a JSON array with no extra text: [{"tip":"...","saving":"X kg CO2/week"}]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const tips = JSON.parse(completion.choices[0].message.content);
    res.json(tips);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
