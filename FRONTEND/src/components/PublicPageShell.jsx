import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PublicPageShell = ({ active, children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-on-surface font-inter overflow-x-hidden relative">
      <div className="grain-overlay"></div>

      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl rounded-full border border-outline-variant bg-white/80 backdrop-blur-md shadow-soft flex justify-between items-center px-6 md:px-8 py-3.5 z-50">
        <Link to="/" className="font-literata text-2xl font-bold italic text-primary">
          CarbonLens
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            to="/features"
            className={`text-secondary hover:text-primary transition-colors font-medium ${
              active === 'Features' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
            }`}
          >
            Features
          </Link>
          {user ? (
            <>
              <Link
                to="/insights"
                className={`text-secondary hover:text-primary transition-colors font-medium ${
                  active === 'Insights' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Insights
              </Link>
              <Link
                to="/community"
                className={`text-secondary hover:text-primary transition-colors font-medium ${
                  active === 'Community' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Community
              </Link>
              <Link
                to="/leaderboard"
                className={`text-secondary hover:text-primary transition-colors font-medium ${
                  active === 'Leaderboard' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Leaderboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/community"
                className={`text-secondary hover:text-primary transition-colors font-medium ${
                  active === 'Community' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Community
              </Link>
              <Link
                to="/insights"
                className={`text-secondary hover:text-primary transition-colors font-medium ${
                  active === 'Insights' ? 'text-primary font-bold border-b-2 border-primary pb-0.5' : ''
                }`}
              >
                Insights
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
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
              <Link to="/login" className="text-on-surface font-semibold text-sm px-3 py-2">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-5 py-2 rounded-full font-semibold text-sm hover:shadow-md active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-12 md:pt-36 md:pb-16">
        {children}
      </main>

      <footer className="bg-white border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="font-literata text-2xl font-bold italic text-primary mb-2">CarbonLens</div>
            <p className="text-secondary text-sm">Precision in Sustainability.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-secondary">
            <Link to="/features" className="hover:text-primary">Features</Link>
            {user ? (
              <>
                <Link to="/insights" className="hover:text-primary">Insights</Link>
                <Link to="/community" className="hover:text-primary">Community</Link>
                <Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link>
              </>
            ) : (
              <>
                <Link to="/community" className="hover:text-primary">Community</Link>
                <Link to="/insights" className="hover:text-primary">Insights</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPageShell;
