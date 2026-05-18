import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { name: 'Calculator', path: '/calculator', icon: 'calculate' },
    { name: 'Insights', path: '/dashboard/insights', icon: 'analytics' },
    { name: 'Community', path: '/dashboard/community', icon: 'groups' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'leaderboard' },
    { name: 'Eco Passport', path: '/profile', icon: 'military_tech' },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Administration', path: '/admin', icon: 'security' });
  }

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-on-surface font-inter flex flex-col md:flex-row relative">
      <div className="grain-overlay"></div>

      {/* Mobile Top Navbar */}
      <header className="md:hidden bg-white/95 backdrop-blur-md border-b border-outline-variant/30 w-full fixed top-0 left-0 z-50 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="font-literata text-2xl text-primary italic font-bold tracking-tight">CarbonLens</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-on-surface p-1 hover:bg-surface-container rounded"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          {user && (
            <img 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-outline-variant object-cover" 
              src={user.avatar} 
            />
          )}
        </div>
      </header>

      {/* Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[57px] left-0 w-full bg-white border-b border-outline-variant/50 z-40 py-4 px-6 flex flex-col gap-2 shadow-lg"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-4 px-4 py-3 rounded-xl font-mono text-[12px] uppercase tracking-wider transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white font-bold' 
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogoutClick();
              }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-mono text-[12px] uppercase tracking-wider text-red-700 hover:bg-red-50 text-left w-full mt-2"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-white w-64 h-screen fixed left-0 top-0 z-40 border-r border-outline-variant/30 flex-col p-6 shadow-luxury">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant/30">
            <img 
              alt="CarbonLens Spine" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5IT6UYShrp8i9U44TWkvgbXgrP5L_lbK3Pl1qrkJ7Kjw8DfpGqymUphYnu9Hi8fu3tYMJlxqROuJTxannJ1znqqHVX8pz5_ny530skQMFvkPxtOxXR8sfgPnHH1w9tCVGxpLpXlDwWfHoGqIP79DgSUJxq9Jem9VK6r5dkWwES-8qzLR-W2-DIOoKn3xlwfUgzJJdiiHFGByoB3FA9xghSlE7V4RhBo9aP-3068ZR0hUihb1_xHPEDc65b-vkGmd3e4oWSH0aSUs" 
            />
          </div>
          <div>
            <h1 className="font-literata text-2xl text-primary font-bold leading-none">CarbonLens</h1>
            <span className="font-mono text-[10px] text-outline uppercase tracking-wider">Field Ledger v2.4</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3 rounded-xl font-mono text-[11px] uppercase tracking-wider transition-all duration-200 hover:translate-x-1 ${
                  isActive 
                    ? 'bg-primary text-white font-bold shadow-inner' 
                    : 'text-secondary hover:bg-surface-container-low hover:text-primary'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </div>

        {user && (
          <div className="pt-4 border-t border-outline-variant/20 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-3 flex-1 group">
                <img 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border border-outline-variant object-cover group-hover:brightness-95 transition-all" 
                  src={user.avatar} 
                />
                <div className="flex flex-col truncate">
                  <span className="font-mono text-[11px] font-bold text-on-surface truncate">{user.name}</span>
                  <span className="text-[9px] text-outline truncate">{user.tier}</span>
                </div>
              </Link>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="w-full py-2.5 px-4 rounded-full border border-secondary text-secondary font-mono text-[10px] uppercase tracking-wider hover:bg-secondary hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full box-border">
        {children}
      </main>
    </div>
  );
};

export default Layout;
