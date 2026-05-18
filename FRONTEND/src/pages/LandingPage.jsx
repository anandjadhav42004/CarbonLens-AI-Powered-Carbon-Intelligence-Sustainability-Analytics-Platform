import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const LandingPage = () => {
  const { user } = useAuth();

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
              <a href="#about" className="text-secondary hover:text-primary transition-colors font-medium">About</a>
              <a href="#metrics" className="text-secondary hover:text-primary transition-colors font-medium">Metrics</a>
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
      <section className="relative pt-36 md:pt-48 pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <span className="font-mono text-[11px] uppercase tracking-widest text-primary font-bold mb-4 bg-primary/5 px-3 py-1 rounded-full">
              Ecological Field Ledger
            </span>
            <h1 className="font-literata text-4xl md:text-6xl lg:text-7xl font-bold text-on-surface leading-[1.08] tracking-tight mb-8">
              Documenting the Earth’s Vigor.
            </h1>
            <p className="text-secondary text-lg leading-relaxed max-w-xl mb-10">
              An elegant, scientific platform mapping verified biological sequestration. Quantify your transport, diet, and home energy offsets on a gorgeous, high-fidelity carbon ledger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/register" className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-center hover:shadow-lg active:scale-95 transition-all">
                Access the Ledger
              </Link>
              <a href="#metrics" className="border border-outline-variant bg-white text-on-surface px-8 py-3.5 rounded-full font-bold text-center hover:bg-surface-container-low transition-all">
                Explore Metrics
              </a>
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
                <h4 className="font-literata text-2xl font-bold text-primary">14.2k</h4>
                <p className="text-secondary text-xs mt-1">Tons CO₂e Verified Sequestration</p>
              </div>
              <div className="p-5 border border-outline-variant rounded-2xl bg-white shadow-soft">
                <h4 className="font-literata text-2xl font-bold text-primary">99.9%</h4>
                <p className="text-secondary text-xs mt-1">Audit Ledger Integrity</p>
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
              <span className="font-mono text-[10px] text-outline uppercase tracking-wider">STATION_01</span>
            </div>
            <div className="h-64 flex items-end justify-between gap-6 px-4">
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-full bg-[#f4ede1] rounded-t-lg h-[80%] relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full bg-primary/20 h-[60%] rounded-t-lg"></div>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-secondary">Global Avg</span>
              </div>
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-full bg-primary rounded-t-lg h-[45%] shadow-md relative">
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-on-surface text-white font-mono text-[9px] py-1 px-2 rounded font-bold">-35%</div>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold">You</span>
              </div>
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="w-full bg-[#f4ede1] rounded-t-lg h-[95%]"></div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-secondary">Regional</span>
              </div>
            </div>
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
            Document Your Ecological Presence.
          </h2>
          <p className="text-secondary text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Join a global, verified network of climate researchers and sustainability advocates. Secure your Eco Passport and begin contributing to the planetary field ledger today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:shadow-lg active:scale-95 transition-all">
              Initialize Eco Passport
            </Link>
            <Link to="/login" className="border border-outline-variant bg-white text-on-surface px-10 py-4 rounded-full font-bold hover:bg-surface-container-low transition-all">
              Sign in to Ledger
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
                <li><a href="#" className="hover:text-primary transition-colors">Curator API</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Telemetry Specs</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-xs">© 2024 CarbonLens. Precision in Sustainability.</p>
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
