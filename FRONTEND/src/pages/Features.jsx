import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const featureCards = [
  {
    icon: 'analytics',
    title: 'Carbon Tracking',
    text: 'Automated footprint calculations across mobility, nutrition, utilities, and daily field activity.',
  },
  {
    icon: 'psychology',
    title: 'AI Insights',
    text: 'Operational recommendations that turn carbon telemetry into practical next steps.',
  },
  {
    icon: 'bar_chart',
    title: 'Smart Analytics',
    text: 'Seasonal trends, peer benchmarks, and sustainability performance patterns in one view.',
  },
  {
    icon: 'emoji_events',
    title: 'Eco Challenges',
    text: 'Milestones and missions designed to keep long-term sustainable habits visible.',
  },
  {
    icon: 'description',
    title: 'Detailed Reports',
    text: 'Audit-ready sustainability reports for individual profiles, teams, and organizations.',
  },
  {
    icon: 'groups',
    title: 'Community',
    text: 'Collaborate with researchers, restoration groups, and climate-minded operators.',
  },
  {
    icon: 'flag',
    title: 'Goal Setting',
    text: 'Define measurable objectives and follow progress with clear, low-friction indicators.',
  },
  {
    icon: 'speed',
    title: 'Real-Time Flow',
    text: 'Live updates on your carbon position as new activities enter the ledger.',
  },
];

const workflowSteps = [
  {
    step: '01',
    title: 'Track Activities',
    text: 'Log transport, nutrition, energy, water, and offsets from one connected workspace.',
  },
  {
    step: '02',
    title: 'Analyze Impact',
    text: 'CarbonLens compares your data against practical sustainability benchmarks.',
  },
  {
    step: '03',
    title: 'Improve Daily',
    text: 'Translate measurements into small, repeatable changes that compound over time.',
  },
];

const Features = () => {
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col gap-12 text-left relative z-20">
      <section className="pt-4 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
            Platform Capabilities
          </span>
          <h1 className="font-literata text-4xl md:text-6xl font-bold leading-tight mt-6 mb-6">
            Everything You Need to Build Sustainable Habits.
          </h1>
          <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-10">
            CarbonLens combines intelligent tracking, sustainability analytics, and community-driven climate action into one precise field ledger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={user ? '/calculator' : '/register'}
              className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-center hover:shadow-lg active:scale-95 transition-all"
            >
              Start Tracking
            </Link>
            <Link
              to="/insights"
              className="border border-outline-variant bg-white text-primary px-8 py-3.5 rounded-xl font-bold text-center hover:bg-surface-container-low transition-all"
            >
              Explore Analytics
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="absolute -top-8 -left-4 bg-white border border-outline-variant p-5 rounded-2xl shadow-soft z-10 w-60 hidden sm:block">
            <span className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">
              Carbon Saved Today
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-2xl font-bold text-primary">12,842</span>
              <span className="font-mono text-[10px] text-secondary">kg</span>
            </div>
            <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[74%]"></div>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden aspect-square border border-outline-variant shadow-soft bg-surface-container">
            <img
              alt="Mountain landscape"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTFyebVY7ojhZda-U4JmUntfhiM2i-kRGyBAxYXa2L0lE8xFkrr2gixEZkVjoxCYlh0C0TUnEmoijxPHAgOmUDIzZRloVth1nQlZje_sTgDjtJch2GU48_IGZZtMIioQS9NFu64OARt_voQ4YMB4suKmFwUvU1PHZa4wNlrkIE1vl9Gl3NDLQEX9cdCVgWhKC_TxY_uWimr2f0VGwQqx2bwTHVCEqG6DI4GjpwMmUQ2XANFX_P8_BJqO60IyW-1vS7Rw_A_r6kN1A"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 bg-white border border-outline-variant p-5 rounded-2xl shadow-soft z-10 w-52 hidden sm:block">
            <span className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-4">
              Reduction Trend
            </span>
            <div className="flex items-end gap-2 h-16">
              <div className="w-full bg-primary/20 h-[30%] rounded-t-sm"></div>
              <div className="w-full bg-primary/30 h-[45%] rounded-t-sm"></div>
              <div className="w-full bg-primary/50 h-[65%] rounded-t-sm"></div>
              <div className="w-full bg-primary h-[90%] rounded-t-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-outline-variant/30">
        <div className="text-center mb-14">
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-on-surface">
            Precision Engineering for the Planet.
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-outline-variant p-7 rounded-2xl shadow-soft hover:border-primary/30 hover:-translate-y-1 transition-all"
            >
              <span className="material-symbols-outlined text-primary text-3xl mb-5 block">
                {feature.icon}
              </span>
              <h3 className="font-literata text-xl font-bold text-primary mb-3">{feature.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="border border-outline-variant rounded-3xl p-8 md:p-12 shadow-soft grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden">
          <div>
            <h2 className="font-literata text-3xl md:text-5xl font-bold leading-tight mb-6">
              Unprecedented Clarity Into Your Impact.
            </h2>
            <p className="text-secondary text-lg leading-relaxed mb-8">
              Jade Pillar visualizations make carbon reductions readable at a glance, from daily habits to team-level operations.
            </p>
            <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
                <div>
                  <h4 className="font-mono text-[10px] text-primary uppercase tracking-wider font-bold mb-1">
                    AI Recommendation
                  </h4>
                  <p className="text-sm text-secondary leading-relaxed">
                    Switching weekend transport to electric rail would reduce your monthly footprint by another 12%.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center min-h-[340px]">
            <div className="flex items-end gap-4 h-[340px]">
              {[25, 40, 60, 86, 50, 66].map((height, index) => (
                <div
                  key={height}
                  className={`w-10 md:w-12 rounded-t-xl ${index === 3 ? 'bg-primary shadow-lg shadow-primary/20' : index === 2 ? 'bg-primary-container' : 'bg-surface-container'}`}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 bg-white border border-outline-variant p-4 rounded-full shadow-soft flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-r-transparent"></div>
              <div className="pr-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-outline block leading-none">
                  Reduction
                </span>
                <span className="font-mono text-xl font-bold text-primary">82%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="font-literata text-3xl md:text-4xl font-bold text-center mb-16">
          The Path to Zero.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-outline-variant/40 z-0"></div>
          {workflowSteps.map((item, index) => (
            <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-soft border ${
                index === workflowSteps.length - 1
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-primary border-outline-variant'
              }`}>
                <span className="font-literata text-2xl font-bold">{item.step}</span>
              </div>
              <h3 className="font-literata text-xl font-bold text-primary mb-4">{item.title}</h3>
              <p className="text-secondary text-sm leading-relaxed max-w-xs">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-outline-variant/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-literata text-3xl md:text-5xl font-bold mb-6">
            Commit to a Future of Precision.
          </h2>
          <p className="text-secondary text-lg leading-relaxed mb-10">
            Start your journey toward a lower-carbon life with a refined tool built for measurement, habit, and momentum.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? '/calculator' : '/register'}
              className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:shadow-lg active:scale-95 transition-all"
            >
              Get Started
            </Link>
            <Link
              to="/community"
              className="border border-outline-variant bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-surface-container-low transition-all"
            >
              See Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
