import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const intelligenceMetrics = [
  { icon: 'eco', label: 'Carbon Saved', value: '12,842', unit: 'kg' },
  { icon: 'analytics', label: 'Eco Score', value: '94', unit: '/100' },
  { icon: 'trending_up', label: 'Efficiency', value: '+12%', unit: '' },
  { icon: 'schedule', label: 'Weekly', value: '4.2%', unit: '' },
  { icon: 'workspace_premium', label: 'Global Rank', value: 'Top 5%', unit: '' },
  { icon: 'bolt', label: 'Energy', value: '18%', unit: '' },
];

const Insights = () => {
  // Radar data representing habit sectors
  const radarData = [
    { subject: 'Mobility', value: 80, fullMark: 100 },
    { subject: 'Nutrition', value: 95, fullMark: 100 },
    { subject: 'Electricity', value: 65, fullMark: 100 },
    { subject: 'Water Sourcing', value: 70, fullMark: 100 },
    { subject: 'Waste Audit', value: 90, fullMark: 100 },
  ];

  // Document verification entries
  const [documents] = useState([
    { id: '1', name: 'Q3_Carbon_Telemetry_Report.pdf', size: '1.4 MB', date: '2023-09-30', status: 'Approved' },
    { id: '2', name: 'Amazon_Basin_Curator_Audit.pdf', size: '2.8 MB', date: '2023-10-12', status: 'Approved' },
    { id: '3', name: 'Station_04_Sensors_Operational.pdf', size: '920 KB', date: '2023-10-22', status: 'Pending Verification' },
  ]);

  const handleDownloadDoc = (name) => {
    toast.success(`Downloading audited document: ${name}`);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Sustainability Insights</h2>
          <p className="text-secondary text-sm mt-1">Multi-dimensional sustainability lifecycle telemetry and verified audit logs.</p>
        </div>
        <button 
          onClick={() => toast.success('Telemetry diagnostics synchronized.')}
          className="px-5 py-2.5 bg-primary text-white text-xs font-mono uppercase tracking-wider rounded-full hover:bg-primary-container shadow-soft"
        >
          Sync Sensors
        </button>
      </div>

      {/* Sustainability intelligence metrics from imported platform page */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {intelligenceMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`bg-white p-5 rounded-2xl border border-outline-variant shadow-soft flex flex-col gap-2 ${
              index === 4 ? 'border-l-4 border-l-primary' : ''
            }`}
          >
            <span className="material-symbols-outlined text-primary text-2xl">{metric.icon}</span>
            <span className="font-mono text-[9px] text-secondary uppercase tracking-widest">{metric.label}</span>
            <span className="font-mono text-xl font-bold text-on-surface">
              {metric.value}
              {metric.unit && <span className="text-[10px] text-secondary ml-1">{metric.unit}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Main Grid: Radar Chart + Diagnostic alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Radar Habit sector (5 columns) */}
        <div className="lg:col-span-5 bg-white border border-outline-variant rounded-3xl p-6 shadow-soft flex flex-col justify-between items-center text-center">
          <div className="w-full text-left mb-6">
            <h3 className="font-literata text-lg font-bold text-primary">Eco Habit Radar</h3>
            <p className="text-secondary text-xs">Analysis of current environmental sector compliance ratings.</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#eeeeea" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#655e4e' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Ratings" dataKey="value" stroke="#274a31" fill="#3e6247" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Diagnostic Warnings (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between text-left">
          <div>
            <h3 className="font-literata text-lg font-bold text-primary mb-1">Diagnostic Ledger Insights</h3>
            <p className="text-secondary text-xs mb-6">Machine-learned anomalies and latent resource optimizations.</p>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border-l-4 border-primary">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold">Electricity Optimization</span>
                  <span className="text-[10px] text-primary">Resolved</span>
                </div>
                <p className="text-xs text-on-surface leading-normal">
                  Latent energy capacity in water-heating coils optimized. Switched daily thermal operations schedule to local solar peak hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-tertiary/5 border-l-4 border-tertiary">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-tertiary font-bold">Mobility Latency</span>
                  <span className="text-[10px] text-tertiary font-bold">Action Needed</span>
                </div>
                <p className="text-xs text-on-surface leading-normal">
                  Average weekly vehicle emissions spiked by 14%. Switch commute pathing coordinates on Boreal paths to rail transit.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant/30 mt-6 flex justify-between items-center text-xs text-secondary">
            <span>Last audit log update: today, 14:02 UTC</span>
            <span className="font-mono text-[10px] text-primary font-bold">94% Efficiency Score</span>
          </div>
        </div>
      </div>

      {/* Imported predictive intelligence panel */}
      <div className="bg-surface-container-low p-4 md:p-6 rounded-3xl border border-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined mb-4 text-3xl">auto_awesome</span>
              <h3 className="font-literata text-2xl font-bold mb-3">AI Predictive Analysis</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Based on current trajectory, CarbonLens predicts a 24% reduction in logistics emissions by Q4.
              </p>
            </div>
            <button
              onClick={() => toast.success('Forecast execution queued.')}
              className="mt-6 bg-white text-primary px-5 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-wider font-bold self-start"
            >
              Execute Forecast
            </button>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-soft">
              <h4 className="font-literata text-xl font-bold text-primary mb-2">Supply Chain Audit</h4>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                Switching regional suppliers for the Midwest corridor could reduce transport carbon by 32%.
              </p>
              <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Impact Score: 9.4/10
              </span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-outline-variant border-l-4 border-l-secondary shadow-soft">
              <h4 className="font-literata text-xl font-bold text-primary mb-2">Thermal Efficiency</h4>
              <p className="text-secondary text-sm leading-relaxed mb-4">
                Weekend heating spikes detected in the north wing. Recommend a smart thermostat audit.
              </p>
              <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold">
                Impact Score: 7.2/10
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Portal Table */}
      <div className="bg-white border border-outline-variant rounded-3xl shadow-soft overflow-hidden">
        <div className="px-6 py-5 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-literata text-xl font-bold text-primary">Certified Audit Portal</h3>
            <p className="text-secondary text-xs">Official document ledgers submitted for IPCC verification standard compliance.</p>
          </div>
          <button 
            onClick={() => toast.success('Select audited PDF log to upload.')}
            className="px-4 py-2 border border-outline-variant bg-white text-on-surface font-mono text-[10px] uppercase tracking-wider hover:bg-surface-container rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            Upload Document
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/40">
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Document Name</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/30">File Size</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Submission Date</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/30">Verification Status</th>
                <th className="px-6 py-3.5 font-mono text-[10px] uppercase tracking-wider text-outline border-b border-outline-variant/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-surface-container-low/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">description</span>
                      <span className="font-medium text-xs text-on-surface">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-secondary">{doc.size}</td>
                  <td className="px-6 py-4 font-mono text-[11px] text-secondary">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                      doc.status === 'Approved' 
                        ? 'border-primary/20 text-primary bg-primary/5' 
                        : 'border-yellow-600/20 text-yellow-800 bg-yellow-50'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownloadDoc(doc.name)}
                      className="text-primary hover:text-primary-container text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">download</span>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insights;
