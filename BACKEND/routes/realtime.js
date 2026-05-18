const router = require('express').Router();
const mongoose = require('mongoose');
const Emission = require('../models/Emission');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');

const avatars = {
  admin: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-RyG3IzGBfiRDTwR2jfVC_LwkoRQ2lw3fuqb-Ga1tQsaLFAc2ThFio0dhnToAnZY_4AbWpsMcCnX4oO3V_yBAX1Hikn54FY_9FBzv2q3PKdKtbyICEqOcMDBM6o4c7aNEIOrPgI8qbSji51RaBLgMzXcx2Od1jzMMGIRTUbtgCke2SQWfDec33JgErxnWPQQ_tugVSTZOK_2eaaQfuWq3f0ummnDNWtHUBNVHlmkDMDwb7hQWCVGegKCLg8dTmwahziSxIeeifk',
  user: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YmQInxbNtNaX-H_iVWRlotsCcWbcUeje85YS7EKO3_cHws-GdlgOY41ire5kEP3KltTgmyGQceuA6-IDJg_hHFooZf9lWhOxhIGNm4i2dBlC0vnFn4MoxyIpExNwyVSVf_qY2D7XeBATv7O4rFHgqitqQTPf0chbrLo5MMTTsf184Aha4VKZMbbx1V_kJBdyZi46OT5JLuVfHxSRva2KSw-QT3D-IYkadQmwIqT5xTpilX1Tjq4yblc_fCB3o_bVcEeju8RUzyY',
};

const fallbackPosts = [
  {
    id: 'seed-1',
    author: 'Elias Vance',
    avatar: avatars.admin,
    role: 'Apex Conservation',
    date: '2 hours ago',
    content: 'Seasonal boreal soil audit completed. Moisture is up and organic degradation latency is down by 5.2%.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsXIV36c0U4--OlyzVAIgPbXgYZjl2SpO7ZJYWqR3VZY9jheUUmo7B5ugAHQtw1OwcPb8di66lIwToIOytdGq3-L35hj99x3PQ6JUOUjBJX0TUwqZ2aiROMZYLyyvlViuY4Gy5CTltjRannJcu_yku-1paSe_xhcpXLQIQUf_tTsXqThFUotTQkr3_kdZUefg3aJ3X1669hwQ-bYs6KXyn6KYOgSJWVX3IpHXrcrWal3gvJZKTQYmKsHAl1cvVeJ97MT4lfMd-jTc',
    likes: 24,
  },
  {
    id: 'seed-2',
    author: 'Maya Lin',
    avatar: avatars.user,
    role: 'Urban Canopy Initiative',
    date: '1 day ago',
    content: 'Urban forestry indices improved 14% in Sector A. Cooling emissions should fall this summer.',
    likes: 18,
  },
];

const fallbackLeaderboard = [
  { rank: 1, name: 'Elias Vance', organization: 'Apex Conservation', streak: '365d', icon: 'workspace_premium', impact: '28.5k', avatar: avatars.admin },
  { rank: 2, name: 'Dr. Aris Thorne', organization: 'Boreal Initiative', streak: '90d', icon: 'verified_user', impact: '14.2k', avatar: avatars.admin },
  { rank: 3, name: 'Maya Lin', organization: 'Urban Canopy', streak: '45d', icon: 'park', impact: '11.8k', avatar: avatars.user },
  { rank: 4, name: 'David Chen', organization: 'Coastal Restoration', streak: '120d', icon: 'water_drop', impact: '9,420', avatar: avatars.user },
  { rank: 5, name: 'Sylvia Rossi', organization: 'Agri-Carbon Tech', streak: '12d', icon: 'agriculture', impact: '8,105', avatar: 'S' },
  { rank: 6, name: 'Elena Rostova', organization: 'Tundra Metrics', streak: '60d', icon: 'forest', impact: '7,890', avatar: avatars.user },
];

const memoryPosts = [];

function hasMongoConnection() {
  return mongoose.connection.readyState === 1;
}

function amountOf(log) {
  return Number(log.amountKg ?? log.totalCO2 ?? 0);
}

function titleCase(value) {
  return String(value || 'general')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function relativeDate(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${Math.round(diffHours / 24)} days ago`;
}

function buildMonthlyTrend(logs) {
  const buckets = new Map();
  logs.forEach((log) => {
    const date = new Date(log.date || log.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    if (!buckets.has(key)) buckets.set(key, { month: label, amount: 0, emissions: 0, offsets: 0 });
    const bucket = buckets.get(key);
    const amount = amountOf(log);
    bucket.amount += amount;
    bucket.emissions += amount;
    bucket.offsets += amount * 0.28;
  });

  return Array.from(buckets.values()).slice(-6).map((item) => ({
    month: item.month,
    amount: Number(item.amount.toFixed(1)),
    emissions: Number(item.emissions.toFixed(1)),
    offsets: Number(item.offsets.toFixed(1)),
  }));
}

function buildCategoryBreakdown(logs) {
  const categories = new Map();
  logs.forEach((log) => {
    const category = titleCase(log.category || 'legacy');
    categories.set(category, (categories.get(category) || 0) + amountOf(log));
  });
  return Array.from(categories.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }));
}

function buildRadar(categoryBreakdown) {
  const categoryMap = Object.fromEntries(categoryBreakdown.map((item) => [item.name.toLowerCase(), item.value]));
  const score = (name, baseline) => Math.max(20, Math.min(100, Math.round(100 - ((categoryMap[name] || 0) / baseline) * 100)));
  return [
    { subject: 'Mobility', value: score('transport', 180), fullMark: 100 },
    { subject: 'Nutrition', value: score('diet', 120), fullMark: 100 },
    { subject: 'Electricity', value: score('electricity', 140), fullMark: 100 },
    { subject: 'Flights', value: score('flights', 90), fullMark: 100 },
    { subject: 'Waste Audit', value: score('waste', 60), fullMark: 100 },
  ];
}

async function buildSnapshot() {
  const [users, emissions, posts] = hasMongoConnection()
    ? await Promise.all([
      User.find({}).sort({ ecoScore: -1 }).limit(20),
      Emission.find({}).sort({ createdAt: -1 }).limit(250),
      CommunityPost.find({}).sort({ createdAt: -1 }).limit(20),
    ])
    : [[], [], memoryPosts];

  const totalEmissions = emissions.reduce((sum, log) => sum + amountOf(log), 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthLogs = emissions.filter((log) => {
    const date = new Date(log.date || log.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  const currentMonthEmissions = currentMonthLogs.reduce((sum, log) => sum + amountOf(log), 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  const savedThisWeek = emissions
    .filter((log) => new Date(log.date || log.createdAt) >= weekStart)
    .reduce((sum, log) => sum + Math.max(0, 12 - amountOf(log)), 0);

  const categoryBreakdown = buildCategoryBreakdown(currentMonthLogs.length ? currentMonthLogs : emissions);
  const topCategory = categoryBreakdown.reduce((top, item) => (item.value > (top?.value || 0) ? item : top), null);
  const monthlyTrend = buildMonthlyTrend(emissions);
  const avgEcoScore = users.length
    ? Math.round(users.reduce((sum, user) => sum + (user.ecoScore || 50), 0) / users.length)
    : 74;
  const leaderboard = users.length
    ? users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      organization: user.department || 'CarbonLens Network',
      streak: `${Math.max(7, (user.ecoScore || 50) + index)}d`,
      icon: index < 3 ? 'workspace_premium' : 'eco',
      impact: `${Math.round((user.ecoScore || 50) * 96).toLocaleString()}`,
      avatar: index === 0 ? avatars.admin : avatars.user,
    }))
    : fallbackLeaderboard;

  const formattedPosts = posts.length
    ? posts.map((post) => ({
      id: post._id || post.id,
      author: post.author,
      avatar: post.avatar || avatars.user,
      role: post.role || 'CarbonLens Member',
      date: relativeDate(post.createdAt),
      content: post.content,
      image: post.image,
      likes: post.likes,
    }))
    : fallbackPosts;

  const documents = emissions.slice(0, 3).map((log, index) => ({
    id: String(log._id),
    name: `${titleCase(log.category)}_Carbon_Estimate_${index + 1}.pdf`,
    size: `${(0.8 + amountOf(log) / 10).toFixed(1)} MB`,
    date: new Date(log.createdAt).toISOString().split('T')[0],
    status: log.estimatedBy === 'carbon_interface' ? 'Approved' : 'Pending Verification',
  }));

  return {
    updatedAt: new Date().toISOString(),
    platformStats: {
      totalUsers: users.length,
      totalEmissions: Number(totalEmissions.toFixed(1)),
      currentMonthEmissions: Number(currentMonthEmissions.toFixed(1)),
      savedThisWeek: Number(savedThisWeek.toFixed(1)),
      avgEcoScore,
      totalPosts: formattedPosts.length,
    },
    dashboard: {
      monthlyEmissions: Number(currentMonthEmissions.toFixed(1)),
      savedThisWeek: Number(savedThisWeek.toFixed(1)),
      offsetGoal: 250,
      currentOffsets: Number((currentMonthEmissions * 0.28).toFixed(1)),
      categoryBreakdown,
      topCategory,
      monthlyTrend,
    },
    insights: {
      metrics: [
        { icon: 'eco', label: 'Carbon Saved', value: Math.round(savedThisWeek * 12).toLocaleString(), unit: 'kg' },
        { icon: 'analytics', label: 'Eco Score', value: String(avgEcoScore), unit: '/100' },
        { icon: 'trending_up', label: 'Efficiency', value: `${Math.max(1, Math.round(savedThisWeek / 4))}%`, unit: '' },
        { icon: 'schedule', label: 'Weekly', value: `${Number(savedThisWeek.toFixed(1))}`, unit: 'kg' },
        { icon: 'workspace_premium', label: 'Global Rank', value: leaderboard[0]?.rank === 1 ? 'Top 5%' : 'Top 20%', unit: '' },
        { icon: 'bolt', label: 'Energy', value: `${Math.max(1, Math.round((categoryBreakdown.find((item) => item.name === 'Electricity')?.value || 18)))}`, unit: 'kg' },
      ],
      radarData: buildRadar(categoryBreakdown),
      diagnostics: [
        {
          label: topCategory ? `${topCategory.name} Optimization` : 'Data Quality',
          status: topCategory ? 'Action Needed' : 'Waiting for Data',
          tone: 'primary',
          copy: topCategory
            ? `${topCategory.name} is currently the largest source at ${topCategory.value} kg CO2e. Prioritize this category next.`
            : 'Save calculator estimates to unlock live diagnostics.',
        },
        {
          label: 'Offset Trajectory',
          status: 'Live',
          tone: 'tertiary',
          copy: `Current offset trajectory is ${(currentMonthEmissions * 0.28).toFixed(1)} kg for this month.`,
        },
      ],
      documents,
    },
    community: {
      metrics: [
        { icon: 'eco', label: 'Reforestation Progress', value: `${Math.round(14204 + totalEmissions * 1.7).toLocaleString()} Hectares`, detail: '+Live' },
        { icon: 'bolt', label: 'Renewable Adoption', value: `${(88.4 + currentMonthEmissions / 100).toFixed(1)} GW Tracked`, detail: 'Active Now' },
        { icon: 'group', label: 'Community Campaigns', value: `${(2840 + formattedPosts.length).toLocaleString()} Successes`, detail: 'Global Reach' },
      ],
      posts: formattedPosts,
      challenge: {
        title: 'Boreal Commuter Quest',
        description: 'Accumulate less than 15kg CO2e on daily transit emissions for 7 consecutive days.',
        progress: Math.min(100, Math.round((savedThisWeek / 35) * 100)),
        label: `${Math.min(7, Math.max(1, Math.round(savedThisWeek / 5)))}/7 Days`,
        reward: '+50 Eco-Index',
      },
      circles: [
        { name: 'Boreal Initiative', members: `${(1200 + users.length).toLocaleString()} members`, icon: 'forest', joined: true },
        { name: 'Urban Canopy Project', members: `${(840 + posts.length).toLocaleString()} members`, icon: 'park', joined: false },
        { name: 'Agri-Carbon Tech', members: `${(412 + emissions.length).toLocaleString()} members`, icon: 'agriculture', joined: false },
      ],
    },
    leaderboard,
    profile: {
      milestones: [
        { name: 'Soil Restorer', tier: 'Tier III', icon: 'energy_savings_leaf', color: 'text-yellow-800' },
        { name: currentMonthEmissions < 250 ? 'Carbon Neutral' : 'Carbon Tracker', tier: currentMonthEmissions < 250 ? 'Unlocked' : 'In Progress', icon: 'co2', color: 'text-primary' },
        { name: 'Community Builder', tier: `${formattedPosts.length} Updates`, icon: 'groups', color: 'text-primary' },
      ],
      streak: Math.min(30, Math.max(1, Math.round(savedThisWeek / 2))),
      meters: [
        { name: 'Biodiversity Density', value: Math.min(100, 70 + Math.round(savedThisWeek / 4)), color: 'jade-gradient' },
        { name: 'Carbon Sequestration', value: Math.min(100, Math.round((currentMonthEmissions * 0.28 / 250) * 100)), color: 'bg-primary' },
        { name: 'Community Network', value: Math.min(100, 60 + formattedPosts.length * 4), color: 'bg-secondary' },
      ],
    },
    admin: {
      metrics: [
        { title: 'Total Active Users', value: users.length.toLocaleString(), change: '+Live', icon: 'groups' },
        { title: 'Emission Records', value: emissions.length.toLocaleString(), change: 'Synced', icon: 'bolt' },
        { title: 'System Carbon Offset', value: `${(currentMonthEmissions * 0.28).toFixed(1)} kg`, change: '+Live', icon: 'eco' },
        { title: 'Ledger Audit Score', value: `${avgEcoScore}/100`, change: 'Dynamic', icon: 'verified' },
      ],
      growthData: monthlyTrend.length ? monthlyTrend : [{ month: 'JAN', amount: 40 }],
      moderationList: emissions.slice(0, 8).map((log) => ({
        id: String(log._id),
        date: new Date(log.createdAt).toLocaleString(),
        title: `${titleCase(log.category)} Estimate`,
        sector: titleCase(log.category),
        credits: amountOf(log).toFixed(1),
        status: log.estimatedBy === 'carbon_interface' ? 'Verified' : 'Flagged',
        icon: log.category === 'electricity' ? 'bolt' : log.category === 'flights' ? 'flight' : 'eco',
      })),
    },
  };
}

router.get('/snapshot', async (req, res) => {
  try {
    res.json(await buildSnapshot());
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/community/posts', async (req, res) => {
  try {
    const { author, avatar, role, content, image } = req.body;
    if (!content?.trim()) return res.status(400).json({ msg: 'Post content is required' });

    if (!hasMongoConnection()) {
      const post = {
        id: `memory-${Date.now()}`,
        author: author || 'CarbonLens Member',
        avatar,
        role,
        content,
        image,
        likes: 0,
        createdAt: new Date(),
      };
      memoryPosts.unshift(post);
      return res.json({
        id: post.id,
        author: post.author,
        avatar: post.avatar,
        role: post.role,
        date: 'Just now',
        content: post.content,
        image: post.image,
        likes: post.likes,
      });
    }

    const post = await CommunityPost.create({
      author: author || 'CarbonLens Member',
      avatar,
      role,
      content,
      image,
    });
    res.json({
      id: post._id,
      author: post.author,
      avatar: post.avatar,
      role: post.role,
      date: 'Just now',
      content: post.content,
      image: post.image,
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/community/posts/:id/like', async (req, res) => {
  try {
    if (!hasMongoConnection()) {
      const post = memoryPosts.find((item) => item.id === req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
      post.likes += 1;
      return res.json({ id: post.id, likes: post.likes });
    }

    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json({ id: post._id, likes: post.likes });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
