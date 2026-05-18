import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useRealtimeSnapshot } from '../hooks/useRealtimeSnapshot';

const LandingPage = () => {
  const { user } = useAuth();
  const { snapshot, status } = useRealtimeSnapshot();
  const primaryCta = user ? '/dashboard' : '/register';
  const secondaryCta = user ? '/calculator' : '/login';
  const platformStats = snapshot?.platformStats;
  const previewBars = snapshot?.dashboard?.monthlyTrend?.length
    ? snapshot.dashboard.monthlyTrend.map((item) => Math.max(18, Math.min(92, item.emissions || item.amount || 18)))
    : [62, 48, 72, 44, 35, 28, 22];
  const maxPreviewBar = Math.max(...previewBars, 1);

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter overflow-x-hidden selection:bg-primary-container/10 relative">
      <div className="grain-overlay"></div>

      {/* Top Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl rounded-full border border-outline-variant bg-white/80 backdrop-blur-md shadow-soft flex justify-between items-center px-6 md:px-8 py-3.5 z-50">
        <div className="font-literata text-2xl font-bold text-primary italic">CarbonLens</div>
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/features" className="text-secondary hover:text-primary transition-colors font-medium">Features</Link>
          {user ? (
            <>
              <Link to="/insights" className="text-secondary hover:text-primary transition-colors font-medium">Insights</Link>
              <Link to="/community" className="text-secondary hover:text-primary transition-colors font-medium">Community</Link>
              <Link to="/leaderboard" className="text-secondary hover:text-primary transition-colors font-medium">Leaderboard</Link>
            </>
          ) : (
            <>
              <Link to="/community" className="text-secondary hover:text-primary transition-colors font-medium">Community</Link>
              <Link to="/insights" className="text-secondary hover:text-primary transition-colors font-medium">Insights</Link>
            </>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2">
                <img 
                  alt="Curator Avatar" 
                  className="w-8 h-8 rounded-full border border-outline-variant object-cover" 
                  src={user.avatar} 
                />
                <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-primary font-bold">{user.name}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-on-surface font-semibold text-sm px-3 py-2">Login</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full font-semibold text-sm hover:shadow-md transition-all active:scale-95">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[92vh] pt-32 md:pt-36 pb-14 flex items-end overflow-hidden">
        <img
          alt="Dense green forest canopy"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/42"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-5 inline-flex items-center gap-2 bg-white/80 border border-outline-variant px-3 py-1.5 rounded-full shadow-soft">
              <span className={`w-2 h-2 rounded-full ${status === 'live' ? 'bg-primary' : 'bg-outline'}`}></span>
              Carbon intelligence - {status === 'live' ? 'Live backend sync' : 'Preview mode'}
            </span>
            <h1 className="font-literata text-5xl md:text-7xl lg:text-8xl font-bold text-on-surface leading-[0.98] tracking-tight mb-7">
              CarbonLens
            </h1>
            <p className="text-on-surface/80 text-lg md:text-xl leading-relaxed max-w-2xl mb-9">
              An AI-powered sustainability dashboard that turns daily transport, electricity, diet, shopping, and waste data into clear carbon decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Link to="/calculator" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-center hover:shadow-lg active:scale-95 transition-all">
                Open Calculator
              </Link>
              <Link to={user ? '/dashboard' : '/register'} className="border border-outline-variant bg-white/90 text-on-surface px-8 py-3.5 rounded-full font-bold text-center hover:bg-white transition-all">
                {user ? 'View Dashboard' : 'Start Free'}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl">
            {[
              { label: 'Monthly CO2e', value: platformStats ? `${platformStats.totalEmissions.toLocaleString()} kg` : '276 kg' },
              { label: 'Saved this week', value: platformStats ? `${platformStats.savedThisWeek} kg` : '31.7 kg' },
              { label: 'Eco index', value: platformStats ? `${platformStats.avgEcoScore}%` : '84%' },
              { label: 'AI status', value: status === 'live' ? 'Synced' : 'Ready' },
            ].map((item) => (
              <div key={item.label} className="bg-white/86 backdrop-blur-md border border-outline-variant rounded-2xl p-4 shadow-soft">
                <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-2">{item.label}</p>
                <p className="font-literata text-2xl font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hidden">
      <section className="relative pt-36 md:pt-48 pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4 bg-primary/5 px-3 py-1 rounded-full">
              Ecological Field Ledger · {status === 'live' ? 'Live Data' : 'Preview Data'}
            </span>
            <h1 className="font-literata text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface leading-[1.08] tracking-tight mb-8">
              Documenting the Earth’s Vigor.
            </h1>
            <p className="text-secondary text-lg leading-relaxed max-w-xl mb-10">
              An elegant, scientific platform mapping verified biological sequestration. Quantify your transport, diet, and home energy offsets on a gorgeous, high-fidelity carbon ledger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to={primaryCta} className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-center hover:shadow-lg active:scale-95 transition-all">
                {user ? 'Open Dashboard' : 'Access the Ledger'}
              </Link>
              <Link to={secondaryCta} className="border border-outline-variant bg-white text-on-surface px-8 py-3.5 rounded-full font-bold text-center hover:bg-surface-container-low transition-all">
                {user ? 'Use Calculator' : 'Sign in to Dashboard'}
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative h-[380px] md:h-[450px] rounded-3xl overflow-hidden border border-outline-variant shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-10 pointer-events-none"></div>
            <img 
              alt="Pristine Forest Ecosystem" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsXIV36c0U4--OlyzVAIgPbXgYZjl2SpO7ZJYWqR3VZY9jheUUmo7B5ugAHQtw1OwcPb8di66lIwToIOytdGq3-L35hj99x3PQ6JUOUjBJX0TUwqZ2aiROMZYLyyvlViuY4Gy5CTltjRannJcu_yku-1paSe_xhcpXLQIQUf_tTsXqThFUotTQkr3_kdZUefg3aJ3X1669hwQ-bYs6KXyn6KYOgSJWVX3IpHXrcrWal3gvJZKTQYmKsHAl1cvVeJ97MT4lfMd-jTc" 
            />
            <div className="absolute bottom-6 left-6 z-20 bg-white/80 backdrop-blur-md border border-outline-variant p-4 rounded-xl shadow-soft flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              <div>
                <div className="font-mono text-[9px] text-outline uppercase tracking-wider">Verified Sequestration</div>
                <div className="font-literata text-base font-bold text-primary">Amazon Basin Reserve IV</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Client Logos Section */}
      <section className="py-12 border-y border-outline-variant/30 bg-surface-container-low/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-outline mb-6">
            Supporting standard carbon verification agencies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60">
            <span className="font-literata font-bold text-xl text-secondary">Verra Standard</span>
            <span className="font-literata font-bold text-xl text-secondary">Gold Standard</span>
            <span className="font-literata font-bold text-xl text-secondary">Plan Vivo</span>
            <span className="font-literata font-bold text-xl text-secondary">Climate Forward</span>
          </div>
        </div>
      </section>

      {/* Product Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-12">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4 block">
              Carbon Intelligence
            </span>
            <h2 className="font-literata text-3xl md:text-5xl font-bold leading-tight mb-5">
              A cleaner operating layer for every sustainability decision.
            </h2>
            <p className="text-secondary text-base leading-relaxed">
              CarbonLens turns daily activity into audit-ready insight, giving teams and individuals a calmer way to measure, compare, and improve their footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: 'monitoring',
                title: 'Live Carbon Signals',
                copy: 'Track transport, energy, diet, and offset activity with clear category-level movement.'
              },
              {
                icon: 'verified',
                title: 'Verified Progress',
                copy: 'Keep every improvement tied to a visible ledger record, badges, and transparent scoring.'
              },
              {
                icon: 'groups',
                title: 'Community Momentum',
                copy: 'Compare progress, join climate challenges, and stay motivated through shared goals.'
              }
            ].map((benefit) => (
              <div key={benefit.title} className="border border-outline-variant rounded-2xl bg-white p-6 shadow-soft">
                <span className="material-symbols-outlined text-primary text-3xl mb-5 block">{benefit.icon}</span>
                <h3 className="font-literata text-xl font-bold text-on-surface mb-3">{benefit.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{benefit.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="py-20 bg-surface-container-low/30 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4 block">
              Platform Preview
            </span>
            <h2 className="font-literata text-3xl md:text-5xl font-bold leading-tight mb-6">
              Dashboard, calculator, and passport views built for quick decisions.
            </h2>
            <p className="text-secondary text-base leading-relaxed mb-8">
              Move from carbon estimate to action plan without digging through spreadsheets. The main workspace keeps impact, trend, and next action visible together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/calculator" className="bg-primary text-white px-7 py-3 rounded-full font-bold text-center hover:shadow-lg active:scale-95 transition-all">
                Try Calculator
              </Link>
              <Link to="/dashboard" className="border border-outline-variant bg-white text-on-surface px-7 py-3 rounded-full font-bold text-center hover:bg-white/70 transition-all">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 rounded-[28px] border border-outline-variant bg-white shadow-soft overflow-hidden">
              <div className="border-b border-outline-variant/40 px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-outline">Dashboard</p>
                  <h3 className="font-literata text-xl font-bold text-primary">Monthly Carbon Flow</h3>
                </div>
                <span className="material-symbols-outlined text-primary">eco</span>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-5">
                <div className="h-52 border border-outline-variant/40 rounded-2xl p-4 bg-surface-container-low/30">
                  <div className="h-full flex items-end gap-3">
                    {previewBars.map((value, index) => (
                      <div key={`${value}-${index}`} className="flex-1 h-full flex flex-col justify-end gap-2">
                        <div
                          className="w-full rounded-t-lg bg-primary shadow-sm min-h-6"
                          style={{ height: `${Math.max(18, (value / maxPreviewBar) * 88)}%` }}
                        ></div>
                        <div className="h-1 rounded-full bg-outline-variant/60"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-outline-variant/40 p-4">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-1">Saved This Month</p>
                    <p className="font-literata text-3xl font-bold text-primary">
                      {platformStats ? `${platformStats.savedThisWeek} kg` : '312 kg'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/40 p-4">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-1">Eco Index</p>
                    <p className="font-literata text-3xl font-bold text-primary">
                      {platformStats ? `${platformStats.avgEcoScore}%` : '84%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-outline-variant bg-white shadow-soft p-5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-2">Calculator</p>
              <h3 className="font-literata text-lg font-bold text-on-surface mb-5">Transport Estimate</h3>
              <div className="space-y-3">
                <div className="h-3 rounded-full bg-primary/15 overflow-hidden">
                  <div className="h-full w-[68%] bg-primary rounded-full"></div>
                </div>
                <div className="h-3 rounded-full bg-primary/15 overflow-hidden">
                  <div className="h-full w-[42%] bg-secondary rounded-full"></div>
                </div>
                <div className="h-3 rounded-full bg-primary/15 overflow-hidden">
                  <div className="h-full w-[24%] bg-outline rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-outline-variant bg-white shadow-soft p-5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-2">Eco Passport</p>
              <h3 className="font-literata text-lg font-bold text-on-surface mb-5">Restorer Level</h3>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-literata text-2xl font-bold">A</div>
                <div>
                  <p className="text-primary font-bold">Apex Path</p>
                  <p className="text-secondary text-xs">9 badges earned</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section id="metrics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start text-left">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4">
              Real-time Ledger
            </span>
            <h2 className="font-literata text-3xl md:text-5xl font-bold leading-tight mb-6">
              Precision Telemetry for Environmental Stewardship.
            </h2>
            <p className="text-secondary text-base leading-relaxed mb-8">
              Ditch estimates. Our ledger matches data against standard IPCC telemetry formulas. Get micro-level views of vehicle, diet, water usage, and offsets visualized as structural columns.
            </p>
            <div className="grid grid-cols-2 gap-6 w-full mb-8">
              <div className="p-5 border border-outline-variant rounded-2xl bg-white shadow-soft">
                <h4 className="font-literata text-2xl font-bold text-primary">
                  {platformStats ? platformStats.totalEmissions.toLocaleString() : '14.2k'}
                </h4>
                <p className="text-secondary text-xs mt-1">Tons CO₂e Verified Sequestration</p>
              </div>
              <div className="p-5 border border-outline-variant rounded-2xl bg-white shadow-soft">
                <h4 className="font-literata text-2xl font-bold text-primary">
                  {platformStats ? platformStats.avgEcoScore : '99.9'}%
                </h4>
                <p className="text-secondary text-xs mt-1">Live Eco Score Average</p>
              </div>
            </div>
            <Link to="/features" className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-2">
              Learn about our telemetry metrics
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="bg-white p-8 md:p-10 border border-outline-variant rounded-[32px] shadow-soft relative overflow-hidden flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
              <span className="font-literata font-bold text-lg text-primary">Eco Pillar Ledger</span>
              <span className="font-mono text-[10px] text-outline uppercase tracking-wider">
                {status === 'live' ? 'LIVE_01' : 'STATION_01'}
              </span>
            </div>
            <div className="h-64 grid grid-cols-3 gap-6 px-4 pt-6">
              {[
                { label: 'Global Avg', value: 80, tone: 'bg-[#d8cfbf]', fill: 'bg-primary/25', badge: null },
                { label: 'You', value: platformStats ? Math.max(28, Math.min(72, 100 - platformStats.avgEcoScore / 2)) : 45, tone: 'bg-primary', fill: null, badge: '-35%' },
                { label: 'Regional', value: 95, tone: 'bg-[#d8cfbf]', fill: null, badge: null },
              ].map((bar) => (
                <div key={bar.label} className="h-full flex flex-col items-center justify-end gap-3">
                  <div className="w-full h-48 flex items-end justify-center">
                    <div
                      className={`relative w-full max-w-28 min-h-12 rounded-t-lg ${bar.tone} shadow-sm overflow-visible`}
                      style={{ height: `${bar.value}%` }}
                    >
                      {bar.fill && <div className={`absolute bottom-0 left-0 w-full h-[60%] rounded-t-lg ${bar.fill}`}></div>}
                      {bar.badge && (
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-white font-mono text-[9px] py-1 px-2 rounded font-bold">
                          {bar.badge}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${bar.label === 'You' ? 'text-primary font-bold' : 'text-secondary'}`}>
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between gap-8 items-start mb-12">
            <div className="max-w-2xl">
              <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4 block">
                Trusted by Climate Teams
              </span>
              <h2 className="font-literata text-3xl md:text-5xl font-bold leading-tight">
                Clear enough for teams, detailed enough for analysts.
              </h2>
            </div>
            <Link to="/community" className="border border-outline-variant bg-white text-on-surface px-7 py-3 rounded-full font-bold hover:bg-surface-container-low transition-all">
              See Community
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: 'CarbonLens helped our field team turn rough activity logs into decisions we could actually defend.',
                name: 'Mira Shah',
                role: 'Sustainability Lead'
              },
              {
                quote: 'The calculator makes the first step feel manageable, and the dashboard keeps the next step obvious.',
                name: 'Jon Bell',
                role: 'Operations Analyst'
              },
              {
                quote: 'Community challenges gave our volunteers a shared rhythm instead of another static report.',
                name: 'Leah Moreno',
                role: 'Restoration Coordinator'
              }
            ].map((testimonial) => (
              <figure key={testimonial.name} className="border border-outline-variant rounded-2xl bg-white p-6 shadow-soft">
                <span className="material-symbols-outlined text-primary text-3xl mb-5 block">format_quote</span>
                <blockquote className="font-literata text-xl leading-relaxed text-on-surface mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption>
                  <p className="font-bold text-primary">{testimonial.name}</p>
                  <p className="text-secondary text-xs">{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Quote Section */}
      <section id="about" className="py-24 bg-surface-container-low/30 border-y border-outline-variant/30 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="material-symbols-outlined text-primary text-5xl mb-6">format_quote</span>
          <blockquote className="font-literata text-2xl md:text-4xl text-on-surface italic leading-relaxed mb-8">
            "The greatest threat to our planet is the belief that someone else will save it. CarbonLens provides the ledger of action, proving what is measured becomes managed."
          </blockquote>
          <cite className="font-mono text-[11px] uppercase tracking-wider text-secondary not-italic font-bold">
            — Dr. Aris Thorne, Lead Restoration Curator
          </cite>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center border border-outline-variant rounded-[40px] py-20 bg-white shadow-soft">
          <h2 className="font-literata text-3xl md:text-5xl font-bold text-on-surface mb-6">
            Start with one calculation. Leave with a direction.
          </h2>
          <p className="text-secondary text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Estimate your footprint, open your dashboard, and turn the next improvement into a visible record.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculator" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all">
              Open Calculator
            </Link>
            <Link to="/dashboard" className="border border-outline-variant bg-white text-on-surface px-10 py-4 rounded-full font-bold hover:bg-surface-container-low transition-all">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="bg-white border-t border-outline-variant w-full mt-10">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="font-literata text-2xl font-bold text-primary italic mb-6">CarbonLens</div>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Precision in Sustainability. We provide the structural architecture for a greener future, one data point at a time.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h5 className="font-bold mb-4 text-sm">Product</h5>
              <ul className="space-y-3 text-sm text-secondary">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link to="/calculator" className="hover:text-primary transition-colors">Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-sm">Platform</h5>
              <ul className="space-y-3 text-sm text-secondary">
                <li><Link to="/insights" className="hover:text-primary transition-colors">Insights</Link></li>
                <li><Link to="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 text-sm">Support</h5>
              <ul className="space-y-3 text-sm text-secondary">
                <li><Link to="/curator-api" className="hover:text-primary transition-colors">Curator API</Link></li>
                <li><Link to="/telemetry-specs" className="hover:text-primary transition-colors">Telemetry Specs</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-xs">© 2026 CarbonLens. Precision in Sustainability.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">Global Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
