import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  
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

  // Calculated totals
  const totalOffset = logs.reduce((acc, curr) => acc + Math.abs(curr.value), 0).toFixed(1);
  const pendingCount = logs.filter(l => l.status === 'Pending Verification').length;

  const handleAddLog = (e) => {
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
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-primary/5 px-3 py-1 rounded-full">Station 04 Active</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Emissions Today</span>
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">8.5 kg</h3>
            <div className="flex items-center gap-1.5 text-secondary text-xs mt-1">
              <span className="material-symbols-outlined text-sm text-[#A35C44]">trending_down</span>
              <span>32% lower than regional average</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Total Sequestration</span>
            <span className="material-symbols-outlined text-primary text-xl">forest</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{totalOffset} kg</h3>
            <p className="text-secondary text-xs mt-1">Accumulated verified ledger entries</p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Eco-Index Score</span>
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{user ? user.ecoIndex : 942}</h3>
            <p className="text-secondary text-xs mt-1">+15 earned this cycle</p>
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-2xl p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Pending Approvals</span>
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
          </div>
          <div>
            <h3 className="font-mono text-2xl font-bold text-primary">{pendingCount}</h3>
            <p className="text-secondary text-xs mt-1">Telemetry verifications in progress</p>
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
