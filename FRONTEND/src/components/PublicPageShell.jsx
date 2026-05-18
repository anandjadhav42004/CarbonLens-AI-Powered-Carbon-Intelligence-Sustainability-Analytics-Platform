import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navItems = [
  { name: 'Features', path: '/features' },
  { name: 'Insights', path: '/insights' },
  { name: 'Community', path: '/community' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

const PublicPageShell = ({ active, children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter overflow-x-hidden relative">
      <div className="grain-overlay"></div>

      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex justify-between items-center gap-6">
          <Link to="/" className="font-literata text-2xl font-bold italic text-primary">
            CarbonLens
          </Link>
          <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-wider">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  active === item.name
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-secondary hover:text-primary transition-colors'
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-md active:scale-95 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-on-surface font-semibold text-sm px-2 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-md active:scale-95 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {children}
      </main>

      <footer className="bg-white border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="font-literata text-2xl font-bold italic text-primary mb-2">CarbonLens</div>
            <p className="text-secondary text-sm">Precision in Sustainability.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-secondary">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="hover:text-primary">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPageShell;
