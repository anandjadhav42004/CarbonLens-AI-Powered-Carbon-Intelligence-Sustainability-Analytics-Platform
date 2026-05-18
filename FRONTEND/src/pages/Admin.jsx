import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useRealtimeSnapshot } from '../hooks/useRealtimeSnapshot';
import { api } from '../services/api';
import { downloadCsv, downloadSimplePdf } from '../utils/report';

const Admin = () => {
  const { snapshot, status } = useRealtimeSnapshot();
  const [chartMode, setChartMode] = useState('Quarterly');
  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [entryForm, setEntryForm] = useState({ organization: '', emissionData: '', status: 'Pending', category: '', remarks: '' });

  // Moderation entries
  const [moderationList, setModerationList] = useState([
    { id: '1', date: '2023.10.24 14:02', title: 'Reforest Station B-4', sector: 'Sequestration', credits: '1,240', status: 'Verified', icon: 'park' },
    { id: '2', date: '2023.10.24 13:45', title: 'Solar Array V12', sector: 'Renewable', credits: '890', status: 'Flagged', icon: 'solar_power' },
    { id: '3', date: '2023.10.24 12:30', title: 'Marine Ecosystem S-2', sector: 'Blue Carbon', credits: '2,550', status: 'Verified', icon: 'water_drop' },
  ]);

  // Pillar monthly analytics data
  const fallbackGrowthData = [
    { month: 'JAN', amount: 40 },
    { month: 'FEB', amount: 65 },
    { month: 'MAR', amount: 55 },
    { month: 'APR', amount: 85 },
    { month: 'MAY', amount: 70 },
    { month: 'JUN', amount: 95 },
  ];
  const adminMetrics = snapshot?.admin?.metrics || [
    { title: 'Total Active Users', value: '84,293', change: '+12.4%', icon: 'groups' },
    { title: 'Active Station Units', value: '12,402', change: '+3.1%', icon: 'bolt' },
    { title: 'System Carbon Offset', value: '2.4M tCO2e', change: '+45.8%', icon: 'eco' },
    { title: 'Ledger Audit Score', value: '94/100', change: 'Elite Tier', icon: 'verified' }
  ];
  const growthData = snapshot?.admin?.growthData?.length ? snapshot.admin.growthData : fallbackGrowthData;
  const chartData = chartMode === 'Monthly'
    ? growthData
    : growthData.reduce((acc, item, index) => {
      const bucket = Math.floor(index / 3);
      acc[bucket] = acc[bucket] || { month: `Q${bucket + 1}`, amount: 0 };
      acc[bucket].amount += item.amount || item.emissions || 0;
      return acc;
    }, []);
  const displayedModerationList = snapshot?.admin?.moderationList?.length ? snapshot.admin.moderationList : moderationList;

  const handleAuditStatus = async (id, newStatus) => {
    setModerationList(moderationList.map(entry => {
      if (entry.id === id) {
        return { ...entry, status: newStatus };
      }
      return entry;
    }));
    try {
      if (newStatus === 'Verified') await api.verifyAdminEntry(id);
      else await api.flagAdminEntry(id);
      toast.success(`Entry status updated to: ${newStatus}`);
    } catch {
      toast.error('Status updated locally only.');
    }
  };

  const createEntry = async (event) => {
    event.preventDefault();
    try {
      const entry = await api.createAdminEntry(entryForm);
      setModerationList([{
        id: entry._id,
        date: new Date(entry.createdAt || Date.now()).toLocaleString(),
        title: entry.organization,
        sector: entry.category,
        credits: entry.emissionData,
        status: entry.status,
        icon: 'eco',
      }, ...moderationList]);
      setNewEntryOpen(false);
      setEntryForm({ organization: '', emissionData: '', status: 'Pending', category: '', remarks: '' });
      toast.success('Administrative audit entry created.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const exportAudit = () => {
    downloadSimplePdf('CarbonLens_Audit_Report.pdf', [
      'CarbonLens Audit Report',
      `Generated: ${new Date().toLocaleString()}`,
      `Entries: ${displayedModerationList.length}`,
      `Verified: ${displayedModerationList.filter((entry) => entry.status === 'Verified').length}`,
      `Flagged: ${displayedModerationList.filter((entry) => entry.status === 'Flagged').length}`,
    ]);
    downloadCsv('CarbonLens_Audit_Report.csv', [
      ['Date', 'Subject', 'Type', 'Credits', 'Status'],
      ...displayedModerationList.map((entry) => [entry.date, entry.title, entry.sector, entry.credits, entry.status]),
    ]);
    toast.success('Exported audit report.');
  };

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Sustainability Administration</h2>
          <p className="text-secondary text-sm mt-1">
            Lead Curators master management console and carbon asset auditing protocol.
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary ml-2">
              {status === 'live' ? 'Live' : 'Backend Offline'}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-primary font-bold">STATION_01_ACTIVE</span>
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminMetrics.map((m) => (
          <div key={m.title} className="bg-white border border-outline-variant rounded-[24px] p-6 shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-outline">{m.title}</span>
              <span className="material-symbols-outlined text-primary text-xl">{m.icon}</span>
            </div>
            <div>
              <h3 className="font-mono text-2xl font-bold text-primary">{m.value}</h3>
              <span className="font-mono text-[10px] text-primary font-bold block mt-1">{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Large graph & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Growth Pillar graph (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-literata text-xl font-bold text-primary">Ecosystem Sequestration Growth</h3>
              <p className="text-secondary text-xs">Aggregated verified carbon credits across global research coordinate zones.</p>
            </div>
            <div className="flex gap-2">
              {['Monthly', 'Quarterly'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-4 py-1.5 rounded-full font-mono text-[9px] uppercase ${chartMode === mode ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4ede1" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E7E7E7', fontFamily: 'Inter' }}
                  labelStyle={{ fontWeight: 'bold', color: '#274a31' }}
                />
                <Bar name="Growth Credits" dataKey="amount" fill="#3e6247" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Side panel (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-outline-variant rounded-3xl p-6 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="font-literata text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3.5 bg-primary/5 border-l-4 border-primary rounded-xl text-left">
                <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold block mb-1">Opportunity Detected</span>
                <p className="text-[11px] text-on-surface leading-normal italic">
                  "Sector B-12 shows 22% latent carbon capacity. Recommend immediate reallocation of monitoring sensors."
                </p>
              </div>
              <div className="p-3.5 bg-tertiary/5 border-l-4 border-tertiary rounded-xl text-left">
                <span className="font-mono text-[9px] uppercase tracking-wider text-tertiary font-bold block mb-1">Anomaly Alert</span>
                <p className="text-[11px] text-on-surface leading-normal italic">
                  "Unusual activity spike in Southeast European region. Validating data integrity..."
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden aspect-[16/10] mt-6 border border-outline-variant/30">
            <img 
              alt="Forest monitoring" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsXIV36c0U4--OlyzVAIgPbXgYZjl2SpO7ZJYWqR3VZY9jheUUmo7B5ugAHQtw1OwcPb8di66lIwToIOytdGq3-L35hj99x3PQ6JUOUjBJX0TUwqZ2aiROMZYLyyvlViuY4Gy5CTltjRannJcu_yku-1paSe_xhcpXLQIQUf_tTsXqThFUotTQkr3_kdZUefg3aJ3X1669hwQ-bYs6KXyn6KYOgSJWVX3IpHXrcrWal3gvJZKTQYmKsHAl1cvVeJ97MT4lfMd-jTc" 
            />
          </div>
        </div>
      </div>

      {/* Moderation table ledger */}
      <div className="bg-white border border-outline-variant rounded-3xl shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/30 flex justify-between items-center">
          <div>
            <h3 className="font-literata text-xl font-bold text-primary">Moderation Ledger</h3>
            <p className="text-secondary text-xs">Real-time audit audit logs of community carbon credit claims.</p>
          </div>
          <button 
            onClick={() => setNewEntryOpen(true)}
            className="bg-primary text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-primary-container active:scale-95"
          >
            New Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/40">
                <th className="px-6 py-3.5 font-mono text-[9px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Timestamp</th>
                <th className="px-6 py-3.5 font-mono text-[9px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Subject</th>
                <th className="px-6 py-3.5 font-mono text-[9px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Type</th>
                <th className="px-6 py-3.5 font-mono text-[9px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Credit Value</th>
                <th className="px-6 py-3.5 font-mono text-[9px] uppercase tracking-wider text-outline border-b border-outline-variant/30 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {displayedModerationList.map((entry) => (
                <tr key={entry.id} className="hover:bg-surface-container-low/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-[11px] text-secondary">{entry.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-primary/5 border border-outline-variant/30 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-sm">{entry.icon}</span>
                      </div>
                      <span className="font-semibold text-xs text-on-surface">{entry.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[9px] uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded-full text-secondary font-bold">
                      {entry.sector}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-primary">{entry.credits}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 items-center">
                    <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border mr-2 ${
                      entry.status === 'Verified' 
                        ? 'border-primary/20 text-primary bg-primary/5' 
                        : 'border-red-600/20 text-red-800 bg-red-50'
                    }`}>
                      {entry.status}
                    </span>
                    <button 
                      onClick={() => handleAuditStatus(entry.id, 'Verified')}
                      className="px-2.5 py-1 bg-primary text-white font-mono text-[9px] uppercase rounded hover:bg-primary-container"
                    >
                      Verify
                    </button>
                    <button 
                      onClick={() => handleAuditStatus(entry.id, 'Flagged')}
                      className="px-2.5 py-1 border border-red-500 text-red-700 font-mono text-[9px] uppercase rounded hover:bg-red-50"
                    >
                      Flag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom bento resources info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        <div className="md:col-span-1 bg-white border border-outline-variant rounded-[24px] p-6 shadow-soft flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-3">military_tech</span>
          <h3 className="font-literata text-base font-bold text-on-surface">Lead Auditor Status</h3>
          <p className="text-secondary text-[11px] mt-1">Lead Curators system privileges confirmed for STATION_01</p>
        </div>

        <div className="md:col-span-2 bg-white border border-outline-variant rounded-[24px] p-6 shadow-soft flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-literata text-base font-bold text-on-surface">System Performance Analytics</h3>
              <p className="text-secondary text-[11px]">Active telemetry processing nodes health</p>
            </div>
            <span className="font-mono text-sm font-bold text-primary">99.9%</span>
          </div>
          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary" style={{ width: '99.9%' }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-mono text-[9px] text-outline block mb-1">Latency</span>
              <span className="font-mono text-xs font-bold text-on-surface">12ms</span>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl">
              <span className="font-mono text-[9px] text-outline block mb-1">Active Nodes</span>
              <span className="font-mono text-xs font-bold text-on-surface">2,412</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 bg-primary text-white rounded-[24px] p-6 shadow-soft flex flex-col justify-between">
          <h3 className="font-literata text-lg font-bold text-[#b3dcba] leading-tight">Generate Official Audit Report</h3>
          <p className="text-[#b3dcba]/80 text-xs mt-2">Download official PDF diagnostics for reserve curators.</p>
          <button 
            onClick={exportAudit}
            className="w-full py-2.5 bg-[#b3dcba] text-primary font-bold rounded-full font-mono text-[10px] uppercase tracking-wider hover:brightness-105 active:scale-95 transition-all mt-4 flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export Audit
          </button>
        </div>
      </div>

      {newEntryOpen && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
          <form onSubmit={createEntry} className="w-full max-w-lg bg-white rounded-3xl border border-outline-variant shadow-luxury p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-literata text-2xl font-bold text-primary">New Audit Entry</h3>
              <button type="button" onClick={() => setNewEntryOpen(false)} className="text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {[
              ['organization', 'Organization'],
              ['emissionData', 'Emission Data'],
              ['category', 'Category'],
              ['remarks', 'Remarks'],
            ].map(([key, label]) => (
              <input
                key={key}
                required={key !== 'remarks'}
                type={key === 'emissionData' ? 'number' : 'text'}
                value={entryForm[key]}
                onChange={(e) => setEntryForm({ ...entryForm, [key]: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm focus:outline-none"
                placeholder={label}
              />
            ))}
            <select value={entryForm.status} onChange={(e) => setEntryForm({ ...entryForm, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 text-sm focus:outline-none">
              <option>Pending</option>
              <option>Verified</option>
              <option>Flagged</option>
            </select>
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold">Create Entry</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Admin;
