const router = require('express').Router();
const auth = require('../middleware/auth');
const Emission = require('../models/Emission');
const OpenAI = require('openai');

// GET /api/insights
router.get('/', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(7);
    if (logs.length === 0) {
      return res.json([{ tip: 'Log some activity first to get personalised tips!', saving: '0 kg CO2/week' }]);
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json([
        { tip: 'Use the calculator daily so CarbonLens can build a reliable emissions baseline.', saving: '1 kg CO2/week' },
        { tip: 'Prioritize the highest dashboard category for the fastest reduction.', saving: '3 kg CO2/week' },
        { tip: 'Keep electricity and transport logs current to improve realtime insight accuracy.', saving: '2 kg CO2/week' },
      ]);
    }

    const avg = {
      transport: (logs.reduce((sum, log) => sum + (log.transport || 0), 0) / logs.length).toFixed(1),
      electricity: (logs.reduce((sum, log) => sum + (log.electricity || 0), 0) / logs.length).toFixed(1),
      digital: (logs.reduce((sum, log) => sum + (log.digital || 0), 0) / logs.length).toFixed(1),
    };

    const prompt = `A student's weekly average emissions: transport ${avg.transport}km/day, electricity ${avg.electricity}kWh/day, digital usage ${avg.digital}hrs/day.
Give exactly 3 short, specific, actionable sustainability tips based on these numbers.
Reply ONLY as a JSON array with no extra text: [{"tip":"...","saving":"X kg CO2/week"}]`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
