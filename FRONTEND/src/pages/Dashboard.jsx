import { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import toast from 'react-hot-toast';
import { api, getAuthToken } from '../services/api';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [liveSummary, setLiveSummary] = useState(null);
  const [liveStatus, setLiveStatus] = useState(getAuthToken() ? 'syncing' : 'preview');
  
  // State for mock log ledger
  const [logs, setLogs] = useState([
    { id: '1', date: '2023-10-24', category: 'Mobility', title: 'Low Emission Commute', value: -2.4, status: 'Verified' },
    { id: '2', date: '2023-10-21', category: 'Diet', title: 'Plant-Based Meal Choice', value: -1.1, status: 'Verified' },
    { id: '3', date: '2023-10-18', category: 'Home Energy', title: 'Smart Thermostat Offsetting', value: -5.2, status: 'Verified' },
    { id: '4', date: '2023-10-15', category: 'Waste', title: 'Composting & Recycle Audit', value: -0.8, status: 'Pending Verification' },
  ]);

  // Form states for adding manual entries
  const [category, setCategory] = useState('Mobility');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  // Weekly data for Pillar comparison
  const weeklyData = [
    { day: 'Mon', average: 12.4, you: 8.2 },
    { day: 'Tue', average: 12.4, you: 7.9 },
    { day: 'Wed', average: 12.4, you: 9.1 },
    { day: 'Thu', average: 12.4, you: 6.8 },
    { day: 'Fri', average: 12.4, you: 8.5 },
    { day: 'Sat', average: 10.1, you: 5.2 },
    { day: 'Sun', average: 10.1, you: 4.8 },
  ];

  const fallbackMonthlyData = [
    { month: 'Jan', emissions: 412, offsets: 82 },
    { month: 'Feb', emissions: 388, offsets: 94 },
    { month: 'Mar', emissions: 354, offsets: 128 },
    { month: 'Apr', emissions: 331, offsets: 142 },
    { month: 'May', emissions: 302, offsets: 171 },
    { month: 'Jun', emissions: 276, offsets: 196 },
  ];

  const fallbackCategoryBreakdown = [
    { name: 'Transport', value: 108, color: '#274a31' },
    { name: 'Electricity', value: 74, color: '#3E6247' },
    { name: 'Diet', value: 52, color: '#7A8F55' },
    { name: 'Flights', value: 28, color: '#A35C44' },
    { name: 'Shopping', value: 22, color: '#C8A97E' },
    { name: 'Waste', value: 9, color: '#8b7355' },
  ];

  const palette = ['#274a31', '#3E6247', '#7A8F55', '#A35C44', '#C8A97E', '#8b7355'];
  const monthlyData = liveSummary?.monthlyTrend?.length ? liveSummary.monthlyTrend : fallbackMonthlyData;
  const categoryBreakdown = liveSummary?.categoryBreakdown?.length
    ? liveSummary.categoryBreakdown.map((item, index) => ({ ...item, color: palette[index % palette.length] }))
    : fallbackCategoryBreakdown;

  const offsetGoal = 250;
  const currentOffsets = liveSummary?.currentOffsets ?? monthlyData[monthlyData.length - 1].offsets;
  const offsetPercent = Math.min(Math.round((currentOffsets / offsetGoal) * 100), 100);
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const monthlyReduction = previousMonth.emissions - currentMonth.emissions;
  const savedThisWeek = liveSummary?.savedThisWeek ?? weeklyData
    .reduce((acc, item) => acc + Math.max(item.average - item.you, 0), 0)
    .toFixed(1);
  const topCategory = liveSummary?.topCategory
    ? { name: liveSummary.topCategory.name, value: liveSummary.topCategory.value }
    : categoryBreakdown.reduce((top, item) => (item.value > top.value ? item : top), categoryBreakdown[0]);

  useEffect(() => {
    if (!getAuthToken()) {
      return undefined;
    }

    let cancelled = false;

    const fetchSummary = async () => {
      try {
        const summary = await api.getEmissionSummary();
        if (cancelled) return;
        setLiveSummary(summary);
        setLiveStatus('live');
        if (summary.history?.length) {
          setLogs(summary.history.map((entry) => ({
            id: entry.id,
            date: new Date(entry.date).toISOString().split('T')[0],
            category: entry.category,
            title: `${entry.category} estimate`,
            value: -Math.abs(Number(entry.amountKg || entry.totalCO2 || 0)),
            status: entry.estimatedBy === 'carbon_interface' ? 'Verified' : 'Local Factor',
          })));
        }
      } catch {
        if (!cancelled) setLiveStatus('offline');
      }
    };

    const fetchLedger = async () => {
      try {
        const entries = await api.getUserLedger(user?.id || 'demo-user');
        if (!cancelled && entries?.length) {
          setLogs(entries.map((entry) => ({
            id: entry._id || entry.id,
            date: new Date(entry.timestamp || entry.createdAt || Date.now()).toISOString().split('T')[0],
            category: entry.category,
            title: entry.action,
            value: -Math.abs(Number(entry.carbonValue || 0)),
            status: 'Verified',
          })));
        }
      } catch {
        // Existing preview logs remain available if the ledger API is offline.
      }
    };

    fetchSummary();
    fetchLedger();
    const timer = setInterval(fetchSummary, 8000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [user?.id]);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!title || !value) {
      toast.error('Please enter both entry title and carbon value.');
      return;
    }

    const valNum = parseFloat(value);
    if (isNaN(valNum)) {
      toast.error('Please enter a valid numeric value.');
      return;
    }

    // Creating new entry
    const newLog = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      category,
      title,
      value: -Math.abs(valNum),
      status: 'Pending Verification'
    };

    setLogs([newLog, ...logs]);
    try {
      await api.createLedgerEntry({
        userId: user?.id || 'demo-user',
        action: title,
        category,
        carbonValue: Math.abs(valNum),
        sustainabilityScore: Math.max(0, Math.round(100 - Math.abs(valNum) * 4)),
      });
    } catch {
      toast.error('Ledger saved locally, but backend persistence is offline.');
    }
    
    // Increment EcoIndex slightly for visual feedback
    if (user) {
      setUser({
        ...user,
        ecoIndex: user.ecoIndex + 5
      });
    }

    toast.success('Field entry logged! Pending telemetry verification.');
    setTitle('');
    setValue('');
  };

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Field Journal Ledger</h2>
          <p className="text-secondary text-sm mt-1">Real-time ecological ledger of verified and pending carbon coordinates.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Ledger Sync</span>
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-primary/5 px-3 py-1 rounded-full">
            {liveStatus === 'live' && 'Live Backend'}
            {liveStatus === 'syncing' && 'Syncing Backend'}
            {liveStatus === 'offline' && 'Backend Offline'}
            {liveStatus === 'preview' && 'Preview Data'}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Emissions This Month</span>
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{currentMonth.emissions} kg</h3>
            <div className="flex items-center gap-1.5 text-secondary text-xs mt-1">
              <span className="material-symbols-outlined text-sm text-[#A35C44]">trending_down</span>
              <span>{monthlyReduction} kg lower than last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Saved This Week</span>
            <span className="material-symbols-outlined text-primary text-xl">forest</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{savedThisWeek} kg</h3>
            <p className="text-secondary text-xs mt-1">Against regional daily baseline</p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Offset Progress</span>
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{offsetPercent}%</h3>
            <p className="text-secondary text-xs mt-1">{currentOffsets} kg of {offsetGoal} kg monthly goal</p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Largest Category</span>
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{topCategory.name}</h3>
            <p className="text-secondary text-xs mt-1">{topCategory.value} kg CO2e this month</p>
          </div>
        </div>
      </div>

      {/* Real Dashboard Data */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
            <div>
              <h3 className="font-literata text-xl font-bold text-primary">Monthly Emissions Trend</h3>
              <p className="text-secondary text-xs">CO2e movement against verified offsets over the current cycle.</p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-outline bg-surface-container px-2 py-0.5 rounded">6 Month View</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4ede1" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E7E7E7', fontFamily: 'Inter' }}
                  labelStyle={{ fontWeight: 'bold', color: '#274a31' }}
                />
                <Area type="monotone" name="Emissions" dataKey="emissions" stroke="#A35C44" fill="#A35C44" fillOpacity={0.14} strokeWidth={2} />
                <Area type="monotone" name="Offsets" dataKey="offsets" stroke="#274a31" fill="#274a31" fillOpacity={0.16} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-8">
          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="font-literata text-xl font-bold text-primary">Offset Goal</h3>
                <p className="text-secondary text-xs">Monthly restoration progress</p>
              </div>
              <span className="font-mono text-xs font-bold text-primary">{offsetPercent}%</span>
            </div>
            <div className="h-3 rounded-full bg-surface-container-low overflow-hidden mb-4">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${offsetPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-secondary">
              <span>{currentOffsets} kg offset</span>
              <span>{offsetGoal - currentOffsets} kg remaining</span>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft">
            <h3 className="font-literata text-xl font-bold text-primary mb-1">Category Breakdown</h3>
            <p className="text-secondary text-xs mb-5">Current month emissions by source.</p>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={3}>
                    {categoryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E7E7E7', fontFamily: 'Inter' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categoryBreakdown.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Graph vs Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-literata text-xl font-bold text-primary">Daily Emissions Footprint</h3>
              <p className="text-secondary text-xs">Tracking transport, nutrition, and home assets (CO₂e kg)</p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-outline bg-surface-container px-2 py-0.5 rounded">Weekly View</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4ede1" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E7E7E7', fontFamily: 'Inter' }}
                  labelStyle={{ fontWeight: 'bold', color: '#274a31' }}
                />
                <Bar name="Regional Avg" dataKey="average" fill="#cce6ce" radius={[4, 4, 0, 0]} />
                <Bar name="Your Impact" dataKey="you" fill="#274a31" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manual Input Form */}
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-literata text-xl font-bold text-primary mb-1">Log Field Entry</h3>
            <p className="text-secondary text-xs mb-6">Instantly map manual metrics into the active ledger.</p>
            
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Category Sector</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                >
                  <option value="Mobility">Mobility / Commuting</option>
                  <option value="Diet">Diet / Nutrition</option>
                  <option value="Home Energy">Home Energy / Water</option>
                  <option value="Waste">Waste / Recycling</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Coordinates / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  placeholder="e.g., Hydropower usage audit"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Impact Offsets (CO₂e kg)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 pr-10"
                    placeholder="e.g., 2.4"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[9px] text-outline">kg</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-soft hover:shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all text-xs"
              >
                Log to Ledger
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ledger Journal Entries List */}
      <div className="bg-white border border-outline-variant rounded-[24px] shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <h3 className="font-literata text-xl font-bold text-primary">Ledger History</h3>
            <p className="text-secondary text-xs">A comprehensive verification audit trail of logged ecological actions.</p>
          </div>
          <span className="font-mono text-[10px] text-outline uppercase tracking-wider bg-surface-container-low px-3 py-1 rounded-full">
            {logs.length} Entries
          </span>
        </div>

        <div className="divide-y divide-outline-variant/20">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-surface-container-low/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-outline-variant/30 shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">
                      {log.category === 'Mobility' && 'directions_car'}
                      {log.category === 'Diet' && 'restaurant'}
                      {log.category === 'Home Energy' && 'bolt'}
                      {log.category === 'Waste' && 'delete_outline'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-on-surface">{log.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider">{log.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{log.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-mono text-sm font-bold text-primary">{log.value} kg</span>
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded border font-bold ${
                    log.status === 'Verified' 
                      ? 'border-primary/20 text-primary bg-primary/5' 
                      : 'border-yellow-600/20 text-yellow-800 bg-yellow-50'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
