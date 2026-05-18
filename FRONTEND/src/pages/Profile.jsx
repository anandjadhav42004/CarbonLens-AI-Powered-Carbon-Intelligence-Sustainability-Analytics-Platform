import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user ? user.name : 'Dr. Aris Thorne');
  const [location, setLocation] = useState(user ? user.location : 'Amazon Basin Reserve IV');
  const [tier, setTier] = useState(user ? user.tier : 'Apex Restorationist');

  const handleSave = (e) => {
    e.preventDefault();
    if (user) {
      setUser({
        ...user,
        name,
        location,
        tier
      });
    }
    setEditing(false);
    toast.success('Curator credentials updated successfully!');
  };

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-6 flex justify-between items-center">
        <div>
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Eco Passport Vault</h2>
          <p className="text-secondary text-sm mt-1">Official authenticated sustainability profile credentials and verified curator achievements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Passport Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#EFE8DA] p-6 md:p-8 rounded-3xl border border-primary/20 shadow-soft relative overflow-hidden text-left flex flex-col">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-[#8FA892]/20 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="engraved-border mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary">
                  <img 
                    alt="Curator Portrait" 
                    className="w-full h-full object-cover" 
                    src={user ? user.avatar : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddBDSnyKnzhYahgwnfatZ7VdfRC_UIXC-nI_W0BIZU2TleAP5l24hSPBVRhEomyyjrkoxX8Jh1JbvUNkm3-u25x2X2qwNK7FYVaEzhUm1J2ABEUucA5xLclzjOLbPrmmMFF9AVniCj4t5cDEBywYQUar8aR01kJngHztCNQSteT4bsY9_zMImAA4N03Kqm_lobbhQfQ5hbvrOR0V33uHL4iDHC3LHW_Jz4jfa5fGOMbUdpr_o8sLrHFX6aJxLyTZVt6B-li2xZJ0'} 
                  />
                </div>
              </div>
              
              <h3 className="font-literata text-xl font-bold text-primary mb-1">{user ? user.name : 'Dr. Aris Thorne'}</h3>
              <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold mb-6">
                <span className="material-symbols-outlined text-xs mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Verified Curator
              </span>

              {editing ? (
                <form onSubmit={handleSave} className="w-full text-left space-y-4 pt-4 border-t border-outline-variant/30">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-outline-variant/30 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-1">Reserve Station</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-outline-variant/30 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-1">Membership Rank</label>
                    <input 
                      type="text" 
                      value={tier} 
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-outline-variant/30 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-soft">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 border border-outline-variant bg-white text-secondary text-xs rounded-xl">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="w-full text-left space-y-4 pt-6 border-t border-[#8FA892]/20">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-outline block">Passport ID</label>
                    <p className="font-mono text-xs font-bold text-primary">{user ? user.id : 'CL-8829-THORNE'}</p>
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-outline block">Station Location</label>
                    <p className="text-xs text-on-surface font-semibold">{user ? user.location : 'Amazon Basin Reserve IV'}</p>
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-outline block">Membership Tier</label>
                    <p className="text-xs text-on-surface italic">{user ? user.tier : 'Apex Restorationist'}</p>
                  </div>
                  <button 
                    onClick={() => setEditing(true)}
                    className="w-full py-2.5 bg-transparent border border-secondary text-primary rounded-full hover:bg-secondary-container/20 transition-all font-mono text-[9px] uppercase tracking-widest font-bold mt-6"
                  >
                    Edit Curator Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Eco-Index Score Card */}
          <div className="bg-[#EFE8DA] p-6 rounded-3xl border border-primary/20 shadow-soft flex items-center justify-between">
            <div>
              <label className="font-mono text-[9px] uppercase tracking-widest text-outline block mb-1">Eco-Index Score</label>
              <p className="font-literata text-3xl font-bold text-primary leading-none">{user ? user.ecoIndex : 942}</p>
              <p className="font-mono text-[9px] text-[#A35C44] mt-1.5 font-bold">+12 this cycle</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 relative">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
            </div>
          </div>
        </div>

        {/* Right Side: Achievements & Streaks (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Milestones grid */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft text-left">
            <div className="flex justify-between items-end mb-6 border-b border-outline-variant/30 pb-4">
              <h3 className="font-literata text-xl font-bold text-primary">Curator Milestones</h3>
              <span className="font-mono text-[10px] text-outline uppercase">12 / 24 Collected</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Soil Restorer', tier: 'Tier III', icon: 'energy_savings_leaf', color: 'text-yellow-800' },
                { name: 'Forest Guardian', tier: 'Founding Member', icon: 'forest', color: 'text-primary' },
                { name: 'Carbon Neutral', tier: 'In Progress', icon: 'co2', color: 'text-outline', disabled: true }
              ].map((m) => (
                <div 
                  key={m.name} 
                  className={`flex flex-col items-center p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-center hover:shadow-sm transition-all ${
                    m.disabled ? 'opacity-50' : ''
                  }`}
                >
                  <div className="w-14 h-14 mb-3 relative flex items-center justify-center">
                    <span className={`material-symbols-outlined text-4xl ${m.color}`}>{m.icon}</span>
                    <div className="absolute inset-0 border-2 border-double border-primary/20 rounded-full"></div>
                  </div>
                  <span className="font-semibold text-xs text-on-surface">{m.name}</span>
                  <span className="font-mono text-[9px] text-outline uppercase tracking-wider mt-1">{m.tier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 30 Day streak tracker */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft text-left relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">potted_plant</span>
              <h3 className="font-literata text-xl font-bold text-primary">30-Day Growth Streak</h3>
            </div>
            
            <div className="flex items-center justify-between gap-1 h-16 relative px-4">
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-outline-variant/30 -translate-y-1/2"></div>
              <div className="absolute left-4 top-1/2 h-0.5 bg-primary -translate-y-1/2 w-4/5"></div>
              
              <div className="relative z-10 w-7 h-7 rounded-full jade-gradient flex items-center justify-center text-white font-mono text-[9px] font-bold">1</div>
              <div className="relative z-10 w-7 h-7 rounded-full jade-gradient flex items-center justify-center text-white font-mono text-[9px] font-bold">5</div>
              <div className="relative z-10 w-7 h-7 rounded-full jade-gradient flex items-center justify-center text-white font-mono text-[9px] font-bold">10</div>
              <div className="relative z-10 w-10 h-10 rounded-full border-2 border-white jade-gradient shadow-md flex items-center justify-center text-white font-mono text-[10px] font-bold">22</div>
              <div className="relative z-10 w-7 h-7 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-secondary font-mono text-[9px] font-bold">25</div>
              <div className="relative z-10 w-7 h-7 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-secondary font-mono text-[9px] font-bold">30</div>
            </div>
            
            <p className="text-secondary text-xs italic mt-4">
              "Your ecological presence has expanded by 14% since the last moon cycle."
            </p>
          </div>

          {/* Restoration Meters */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft text-left">
            <h3 className="font-literata text-lg font-bold text-primary mb-6">Restoration Meters</h3>
            <div className="space-y-6">
              {[
                { name: 'Biodiversity Density', value: 82, color: 'jade-gradient' },
                { name: 'Carbon Sequestration', value: 64, color: 'bg-primary' },
                { name: 'Community Network', value: 91, color: 'bg-secondary' }
              ].map((meter) => (
                <div key={meter.name}>
                  <div className="flex justify-between items-end mb-2 text-xs">
                    <span className="font-medium text-on-surface">{meter.name}</span>
                    <span className="font-mono font-bold text-primary">{meter.value}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                    <div className={`h-full rounded-full ${meter.color}`} style={{ width: `${meter.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
