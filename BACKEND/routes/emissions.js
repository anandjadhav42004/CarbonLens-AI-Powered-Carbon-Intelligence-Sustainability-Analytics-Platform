const router   = require('express').Router();
const auth     = require('../middleware/auth');
const Emission = require('../models/Emission');
const User     = require('../models/User');

const CARBON_INTERFACE_URL = 'https://www.carboninterface.com/api/v1/estimates';

function calcCO2({ transport, electricity, food, digital }) {
  const foodMap = { vegan: 1.5, veg: 2.5, nonveg: 5.0 };
  return (transport   * 0.21)
       + (electricity * 0.82)
       + (foodMap[food] || 2.5)
       + (digital     * 0.036);
}

function localCategoryEstimate({ category, metadata = {} }) {
  switch (category) {
    case 'transport': {
      const factors = {
        petrol_car: 0.19,
        diesel_car: 0.21,
        hybrid: 0.11,
        ev: 0.05,
        public_transit: 0.04,
        bicycle: 0,
      };
      return (Number(metadata.distanceKm) || 0) * (factors[metadata.transportType] ?? 0.19);
    }
    case 'electricity': {
      const factors = { grid_mix: 0.42, renewable: 0.08, solar: 0.02 };
      return (Number(metadata.kwh) || 0) * (factors[metadata.energySource] ?? 0.42);
    }
    case 'diet': {
      const scores = { meat_heavy: 8.2, balanced: 5.4, vegetarian: 3.2, vegan: 2.1 };
      return scores[metadata.dietType] ?? 5.4;
    }
    case 'flights': {
      const multipliers = { economy: 1, premium: 1.35, business: 2.1 };
      return ((Number(metadata.kmPerYear) || 0) * 0.115 * (multipliers[metadata.flightClass] ?? 1)) / 365;
    }
    case 'shopping':
      return (((Number(metadata.clothingItems) || 0) * 25)
        + ((Number(metadata.electronicsItems) || 0) * 120)
        + ((Number(metadata.monthlySpend) || 0) * 0.35)) / 30;
    case 'waste':
      return (((Number(metadata.wasteKgWeek) || 0) * 0.7)
        * (1 - (Number(metadata.recyclingRate) || 0) / 100)) / 7;
    default:
      return 0;
  }
}

async function carbonInterfaceEstimate(payload) {
  if (!process.env.CARBON_INTERFACE_API_KEY) return null;

  const response = await fetch(CARBON_INTERFACE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CARBON_INTERFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Carbon Interface error ${response.status}: ${text}`);
  }

  return response.json();
}

function buildCarbonInterfacePayload({ category, metadata = {} }) {
  if (category === 'electricity') {
    return {
      type: 'electricity',
      electricity_unit: 'kwh',
      electricity_value: Number(metadata.kwh) || 0,
      country: metadata.country || 'us',
      state: metadata.state || 'ca',
    };
  }

  if (category === 'flights' && metadata.departureAirport && metadata.destinationAirport) {
    return {
      type: 'flight',
      passengers: Number(metadata.passengers) || 1,
      legs: [{
        departure_airport: metadata.departureAirport,
        destination_airport: metadata.destinationAirport,
        cabin_class: metadata.flightClass || 'economy',
      }],
    };
  }

  return null;
}

function normalizeEntry(entry) {
  const amountKg = Number(entry.amountKg ?? entry.totalCO2 ?? 0);
  return {
    id: entry._id,
    date: entry.date || entry.createdAt,
    category: entry.category || 'legacy',
    amountKg,
    totalCO2: amountKg,
    source: entry.source,
    estimatedBy: entry.estimatedBy,
    metadata: entry.metadata || {},
  };
}

// POST /api/emissions/log
router.post('/log', auth, async (req, res) => {
  try {
    const { category, amountKg, metadata, source } = req.body;
    const hasCategoryPayload = Boolean(category);
    const totalCO2 = hasCategoryPayload
      ? parseFloat(Number(amountKg || localCategoryEstimate({ category, metadata })).toFixed(2))
      : parseFloat(calcCO2(req.body).toFixed(2));
    const ecoScore = Math.max(0, Math.round(100 - totalCO2 * 4));
    const log = await Emission.create({
      userId: req.userId,
      transport: req.body.transport,
      electricity: req.body.electricity,
      food: req.body.food,
      digital: req.body.digital,
      category,
      amountKg: totalCO2,
      metadata,
      source: source || 'calculator',
      estimatedBy: req.body.estimatedBy || 'local_factor',
      totalCO2,
      ecoScore
    });
    await User.findByIdAndUpdate(req.userId, { ecoScore });
    res.json({ log: normalizeEntry(log), totalCO2, ecoScore });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/emissions/estimate
router.post('/estimate', auth, async (req, res) => {
  try {
    const { category, metadata = {}, save = true } = req.body;
    if (!category) return res.status(400).json({ msg: 'Category is required' });

    let amountKg = parseFloat(localCategoryEstimate({ category, metadata }).toFixed(2));
    let estimatedBy = 'local_factor';
    let carbonInterfaceId = null;
    const ciPayload = buildCarbonInterfacePayload({ category, metadata });

    if (ciPayload) {
      try {
        const estimate = await carbonInterfaceEstimate(ciPayload);
        if (estimate?.data?.attributes?.carbon_kg != null) {
          amountKg = Number(estimate.data.attributes.carbon_kg);
          estimatedBy = 'carbon_interface';
          carbonInterfaceId = estimate.data.id;
        }
      } catch (apiErr) {
        console.warn(apiErr.message);
      }
    }

    const ecoScore = Math.max(0, Math.round(100 - amountKg * 4));
    let log = null;

    if (save) {
      log = await Emission.create({
        userId: req.userId,
        category,
        amountKg,
        totalCO2: amountKg,
        ecoScore,
        metadata,
        source: 'calculator',
        estimatedBy,
        carbonInterfaceId,
      });
      await User.findByIdAndUpdate(req.userId, { ecoScore });
    }

    res.json({
      amountKg,
      totalCO2: amountKg,
      ecoScore,
      estimatedBy,
      carbonInterfaceId,
      log: log ? normalizeEntry(log) : null,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/emissions/history
router.get('/history', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(30);
    res.json(logs.map(normalizeEntry));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/emissions/summary
router.get('/summary', auth, async (req, res) => {
  try {
    const logs = await Emission.find({ userId: req.userId }).sort({ date: -1 }).limit(180);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);

    const categoryMap = new Map();
    const monthlyMap = new Map();
    let currentMonthEmissions = 0;
    let savedThisWeek = 0;

    logs.forEach((log) => {
      const date = new Date(log.date || log.createdAt);
      const amount = Number(log.amountKg ?? log.totalCO2 ?? 0);
      const category = log.category || 'legacy';
      const monthKey = date.toLocaleString('en-US', { month: 'short' });

      if (!monthlyMap.has(monthKey)) monthlyMap.set(monthKey, { month: monthKey, emissions: 0, offsets: 0 });
      const monthBucket = monthlyMap.get(monthKey);
      monthBucket.emissions += amount;
      monthBucket.offsets += Math.max(0, amount * 0.28);

      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);

      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        currentMonthEmissions += amount;
      }

      if (date >= weekStart) {
        savedThisWeek += Math.max(0, 12 - amount);
      }
    });

    const monthlyTrend = Array.from(monthlyMap.values())
      .reverse()
      .slice(-6)
      .map((item) => ({
        month: item.month,
        emissions: Number(item.emissions.toFixed(1)),
        offsets: Number(item.offsets.toFixed(1)),
      }));

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }));

    const topCategory = categoryBreakdown.reduce((top, item) => (
      item.value > (top?.value || 0) ? item : top
    ), null);

    res.json({
      monthlyEmissions: Number(currentMonthEmissions.toFixed(1)),
      savedThisWeek: Number(savedThisWeek.toFixed(1)),
      offsetGoal: 250,
      currentOffsets: Number((currentMonthEmissions * 0.28).toFixed(1)),
      categoryBreakdown,
      topCategory,
      monthlyTrend,
      history: logs.map(normalizeEntry),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
