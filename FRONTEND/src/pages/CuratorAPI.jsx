const endpointGroups = [
  { method: 'GET', path: '/api/realtime/snapshot', text: 'Live sustainability snapshot for dashboard, insights, leaderboard, and admin views.' },
  { method: 'POST', path: '/api/emissions/estimate', text: 'Create carbon estimates from calculator telemetry.' },
  { method: 'POST', path: '/api/documents/upload', text: 'Upload reports and return simulated AI sustainability analysis.' },
  { method: 'POST', path: '/api/assistant', text: 'Ask the CarbonLens sustainability assistant for recommendations.' },
];

const CuratorAPI = () => (
  <div className="min-h-screen bg-white text-on-surface font-inter px-6 py-12">
    <div className="max-w-5xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">CarbonLens Developer Surface</p>
      <h1 className="font-literata text-4xl md:text-6xl font-bold text-primary mb-6">Curator API</h1>
      <p className="text-secondary max-w-3xl leading-relaxed mb-10">
        The Curator API exposes carbon estimates, live telemetry snapshots, document analysis, community interactions, and assistant recommendations for sustainability workflows.
      </p>
      <div className="grid grid-cols-1 gap-4">
        {endpointGroups.map((item) => (
          <div key={item.path} className="border border-outline-variant rounded-2xl p-5 shadow-soft bg-white">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-primary text-white rounded-full px-3 py-1 self-start">{item.method}</span>
              <code className="font-mono text-sm text-primary">{item.path}</code>
            </div>
            <p className="text-secondary text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CuratorAPI;
