const specs = [
  { title: 'Transport', body: 'Daily kilometers, mode type, fuel profile, and route assumptions produce transport CO2e.' },
  { title: 'Electricity', body: 'kWh usage, source mix, and grid region estimate electricity emissions and optimization opportunities.' },
  { title: 'Flights', body: 'Airport pairs, passenger count, and cabin class generate route-level aviation estimates.' },
  { title: 'Waste', body: 'Landfill weight plus recycling and composting rate estimate weekly waste impact.' },
];

const TelemetrySpecs = () => (
  <div className="min-h-screen bg-white text-on-surface font-inter px-6 py-12">
    <div className="max-w-5xl mx-auto">
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-3">Measurement Model</p>
      <h1 className="font-literata text-4xl md:text-6xl font-bold text-primary mb-6">Telemetry Specs</h1>
      <p className="text-secondary max-w-3xl leading-relaxed mb-10">
        CarbonLens telemetry is designed for hackathon-friendly carbon intelligence: transparent formulas, explainable recommendations, and live backend snapshots.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {specs.map((item) => (
          <div key={item.title} className="border border-outline-variant rounded-2xl p-6 shadow-soft bg-white">
            <h2 className="font-literata text-2xl font-bold text-primary mb-3">{item.title}</h2>
            <p className="text-secondary text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TelemetrySpecs;
