const router = require('express').Router();

const buildLocalAssistantResponse = (message = '', context = {}) => {
  const lower = message.toLowerCase();
  const recommendations = [];

  const asksTopEmittingCountry = (
    (lower.includes('country') || lower.includes('countries')) &&
    (lower.includes('co2') || lower.includes('carbon') || lower.includes('emission')) &&
    (lower.includes('most') || lower.includes('highest') || lower.includes('largest') || lower.includes('top'))
  );

  if (asksTopEmittingCountry) {
    return {
      reply: 'China is the largest annual CO2-emitting country by total emissions. The usual top annual emitters are China, the United States, India, and the European Union. Per-person emissions are a different ranking, where smaller fossil-fuel-heavy countries can rank higher.',
      recommendations: [
        'Use total annual emissions when comparing national climate impact.',
        'Use per-capita emissions when comparing lifestyle or fairness.',
        'Mention the metric in reports so the answer is not misleading.',
      ],
      ecoImprovement: 'Knowledge insight: total emissions and per-capita emissions answer different questions.',
      riskLevel: 'Low',
      provider: 'local',
    };
  }

  if (lower.includes('transport') || context.topCategory === 'Transport') {
    recommendations.push('Your transport footprint is high. Try replacing two car trips per week with public transit, cycling, or carpooling.');
  }
  if (lower.includes('electric') || lower.includes('energy') || context.topCategory === 'Electricity') {
    recommendations.push('Shift heavy appliance use to daylight/renewable-heavy hours and consider a renewable supplier plan.');
  }
  if (lower.includes('carbon') || lower.includes('footprint')) {
    recommendations.push('Start with your largest category, then lock one weekly habit change into the ledger so progress appears on the dashboard.');
  }
  if (!recommendations.length) {
    recommendations.push('Based on your CarbonLens profile, focus on transport, electricity timing, and waste sorting for the fastest eco-score improvement.');
  }

  return {
    reply: recommendations.join(' '),
    recommendations,
    ecoImprovement: '+6 to +12 points if maintained for 30 days',
    provider: 'local',
  };
};

const parseGeminiResponse = (payload) => {
  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) return null;

  const cleanText = text.replace(/```json|```/gi, '').trim();
  const jsonStart = cleanText.indexOf('{');
  const jsonEnd = cleanText.lastIndexOf('}');

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      try {
        return JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
      } catch (nestedError) {
        return null;
      }
    }

    if (cleanText.startsWith('{') || cleanText.startsWith('[')) return null;

    return {
      reply: cleanText,
      recommendations: cleanText
        .split(/\n+/)
        .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
        .filter(Boolean)
        .slice(0, 5),
    };
  }
};

const askGemini = async (message, context) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const prompt = `
You are CarbonLens AI, a sustainability assistant for a hackathon MVP.
Give concise, practical carbon reduction advice using the user's app telemetry.

Return JSON only with this shape:
{
  "reply": "short helpful answer",
  "recommendations": ["3 to 5 specific actions"],
  "ecoImprovement": "realistic improvement estimate",
  "riskLevel": "Low | Medium | High"
}

User question: ${message}
CarbonLens context: ${JSON.stringify(context || {})}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 900,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini request failed ${response.status}: ${errorText}`);
    }

    const payload = await response.json();
    return parseGeminiResponse(payload);
  } finally {
    clearTimeout(timeout);
  }
};

router.post('/', async (req, res) => {
  const { message = '', context = {} } = req.body;
  const fallback = buildLocalAssistantResponse(message, context);

  try {
    const gemini = await askGemini(message, context);
    if (gemini?.reply) {
      return res.json({
        ...fallback,
        ...gemini,
        recommendations: gemini.recommendations?.length ? gemini.recommendations : fallback.recommendations,
        provider: 'gemini',
      });
    }
  } catch (error) {
    console.warn('[assistant] Gemini fallback:', error.message);
  }

  res.json(fallback);
});

module.exports = router;
