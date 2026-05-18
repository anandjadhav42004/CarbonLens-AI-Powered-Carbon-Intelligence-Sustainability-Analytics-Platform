import { useState } from 'react';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Initial list of leaderboard entries
  const standardRankings = [
    { rank: 4, name: 'David Chen', organization: 'Coastal Restoration', streak: '120d', icon: 'water_drop', impact: '9,420', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2YmQInxbNtNaX-H_iVWRlotsCcWbcUeje85YS7EKO3_cHws-GdlgOY41ire5kEP3KltTgmyGQceuA6-IDJg_hHFooZf9lWhOxhIGNm4i2dBlC0vnFn4MoxyIpExNwyVSVf_qY2D7XeBATv7O4rFHgqitqQTPf0chbrLo5MMTTsf184Aha4VKZMbbx1V_kJBdyZi46OT5JLuVfHxSRva2KSw-QT3D-IYkadQmwIqT5xTpilX1Tjq4yblc_fCB3o_bVcEeju8RUzyY' },
    { rank: 5, name: 'Sylvia Rossi', organization: 'Agri-Carbon Tech', streak: '12d', icon: 'agriculture', impact: '8,105', avatar: 'S' },
    { rank: 6, name: 'Elena Rostova', organization: 'Tundra Metrics', streak: '60d', icon: 'forest', impact: '7,890', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBU_uwHDdb_V3St6kXxJsNsaVfxvnTXNVrbE-xjktBxt0SR9A59DsNDcbbBAP36xs-Wn83vIO93FUFoFUe4KGPM5nWqJZTbBE0oreiOduqYCg4oFHSG2T0kIdkkt-e40lGaHoe31F2E3E1VlfiOynRpO5HomFbIuJ9pMtbOG962rtBjzv5ag2BH8GwCDNxaWnytM3mqb8muAUboSxHd0bu11PFUC838-gJDzh91DQdxbvCG4m7t_UVtUNna2FsyKOKbSdbICzcFJFQ' }
  ];

  // Filtering standard rankings dynamically
  const filteredRankings = standardRankings.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    entry.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-6">
        <div>
          <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Community Impact Ledger</h2>
          <p className="text-secondary text-sm mt-1">Global ranking of environmental curators determined by verified carbon sequestration metrics.</p>
        </div>
        
        {/* Search / Filters */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl inset-shadow-input text-xs text-on-surface focus:outline-none"
              placeholder="Search researchers..."
            />
          </div>
          <button 
            onClick={() => toast.success('Leaderboard filtering triggered.')}
            className="px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl flex items-center gap-2 hover:bg-surface-container font-mono text-[10px] uppercase tracking-wider text-on-surface"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Top 3 Podium Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-4">
        
        {/* Silver (2nd Place) */}
        <div className="bg-white rounded-[24px] border-2 silver-border p-6 flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1 mt-0 md:mt-8 shadow-soft">
          <div className="absolute top-4 left-4 font-mono text-xs font-bold text-outline">#2</div>
          <div className="w-20 h-20 rounded-full border-4 silver-border overflow-hidden mb-4 relative shadow-sm">
            <img 
              alt="Dr. Aris Thorne" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhmHw903vGWa8ZhWKgHn5QYme-F3cQyBIYpOFRNaJkXUVoEcJB1vrGTuE2x3GQ-tl8rk1TNGEc8EWlBln2ahK0O6c5XQhFGs1Fl-NSahxWfCDd-1l5U_9JPdJ7fJ4Nhyp0p6ihqp9fuuf4AxLX3X8YWipLEwdlMZYPtajZV8bkne7zbH7uNWOYbyzr6al8tittP3tPQhUfKarc5H76FQJAux51uj1bC2fL0iMdMjAof17XjlPneXRmmJi377VdBScNI2JsckXDX_g" 
            />
          </div>
          <h3 className="font-literata text-xl font-bold text-primary mb-1">Dr. Aris Thorne</h3>
          <p className="font-mono text-[9px] text-secondary mb-4 uppercase tracking-wider">Boreal Initiative</p>
          <div className="flex items-center gap-2 mb-4 bg-surface-container-low px-4 py-1.5 rounded-full inset-shadow-input">
            <span className="material-symbols-outlined text-primary text-sm">eco</span>
            <span className="font-mono text-sm font-bold text-on-surface">14.2k</span>
            <span className="font-mono text-[9px] text-outline uppercase tracking-wider">tons CO₂e</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase text-secondary font-bold" title="90 Day Streak">
              <span className="material-symbols-outlined text-xs text-[#A35C44]">local_fire_department</span>
              90d
            </div>
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase text-secondary font-bold">
              <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
              Master
            </div>
          </div>
        </div>

        {/* Gold (1st Place) */}
        <div className="bg-white rounded-[24px] border-2 gold-border p-8 flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2 transform md:-translate-y-4 shadow-luxury">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#C8A97E] to-transparent opacity-50"></div>
          <div className="absolute top-6 left-6 font-mono text-sm font-bold text-[#C8A97E]">#1</div>
          <span className="material-symbols-outlined text-[#C8A97E] text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
          <div className="w-24 h-24 rounded-full border-4 gold-border overflow-hidden mb-4 relative shadow-md">
            <img 
              alt="Elias Vance" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz-RyG3IzGBfiRDTwR2jfVC_LwkoRQ2lw3fuqb-Ga1tQsaLFAc2ThFio0dhnToAnZY_4AbWpsMcCnX4oO3V_yBAX1Hikn54FY_9FBzv2q3PKdKtbyICEqOcMDBM6o4c7aNEIOrPgI8qbSji51RaBLgMzXcx2Od1jzMMGIRTUbtgCke2SQWfDec33JgErxnWPQQ_tugVSTZOK_2eaaQfuWq3f0ummnDNWtHUBNVHlmkDMDwb7hQWCVegKCLg8dTmwahziSxIeeifk" 
            />
          </div>
          <h3 className="font-literata text-2xl font-bold text-primary mb-1">Elias Vance</h3>
          <p className="font-mono text-[9px] text-secondary mb-5 uppercase tracking-wider">Apex Conservation</p>
          <div className="flex flex-col items-center gap-1 mb-5 bg-surface-container-low px-6 py-2.5 rounded-2xl inset-shadow-input w-full">
            <span className="font-mono text-[9px] text-outline uppercase tracking-wider mb-1">Total Verified Impact</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
              <span className="font-mono text-base font-bold text-primary">28.5k</span>
              <span className="font-mono text-[9px] text-outline mt-0.5">tons</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-[#C8A97E]/10 border border-[#C8A97E]/30 px-3 py-1 rounded-full text-[9px] font-mono uppercase text-[#C8A97E] font-bold">
              <span className="material-symbols-outlined text-xs text-[#A35C44]">local_fire_department</span>
              365d
            </div>
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-3 py-1 rounded-full text-[9px] font-mono uppercase text-primary font-bold">
              <span className="material-symbols-outlined text-xs text-primary">verified_user</span>
              Guardian
            </div>
          </div>
        </div>

        {/* Bronze (3rd Place) */}
        <div className="bg-white rounded-[24px] border-2 bronze-border p-6 flex flex-col items-center text-center relative overflow-hidden order-3 mt-0 md:mt-12 shadow-soft">
          <div className="absolute top-4 right-4 font-mono text-xs font-bold text-outline">#3</div>
          <div className="w-16 h-16 rounded-full border-4 bronze-border overflow-hidden mb-4 relative shadow-sm">
            <img 
              alt="Maya Lin" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUTlgzxZhrwUUkKJuB746FmGPlFETp8OWc-8z4OZMUrIrpwUpSl9h585IdgiDtl61XkmfPEohGiOKNwYySBIPpQSR0odqwd9Okx1kI9cnK9iwszOkk1SQQdac_1L8Qa7Omh-ABgI56QG96AV3z3jSsFI6V5wTJinLcUh1fWdJHBLeIEBLenCvW8F_-QI_mWdfwY9vWu3FlUT72RHjCzdShyX6NcpL9eDTfZ1HHzT9h16EghuRjhMs_qKm27mwK1PBuMJapCL-yVTY" 
            />
          </div>
          <h3 className="font-literata text-xl font-bold text-primary mb-1">Maya Lin</h3>
          <p className="font-mono text-[9px] text-secondary mb-4 uppercase tracking-wider">Urban Canopy</p>
          <div className="flex items-center gap-2 mb-4 bg-surface-container-low px-4 py-1.5 rounded-full inset-shadow-input">
            <span className="material-symbols-outlined text-primary text-sm">eco</span>
            <span className="font-mono text-sm font-bold text-on-surface">11.8k</span>
            <span className="font-mono text-[9px] text-outline uppercase tracking-wider">tons CO₂e</span>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase text-secondary font-bold">
              <span className="material-symbols-outlined text-xs text-[#A35C44]">local_fire_department</span>
              45d
            </div>
          </div>
        </div>
      </div>

      {/* Standard Rankings List (Alternating Parchment) */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-soft">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant/30 font-mono text-[9px] text-outline uppercase tracking-wider bg-surface-container-low/40">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-10 md:col-span-5">Researcher / Entity</div>
          <div className="hidden md:block col-span-3">Status / Badges</div>
          <div className="hidden md:block col-span-3 text-right">Verified Impact (CO₂e)</div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-outline-variant/20">
          {filteredRankings.map((entry) => (
            <div key={entry.rank} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container-low/20 transition-colors">
              <div className="col-span-2 md:col-span-1 text-center font-mono text-sm font-bold text-on-surface-variant">{entry.rank}</div>
              
              <div className="col-span-10 md:col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-surface-container overflow-hidden border border-outline-variant/50 flex items-center justify-center font-mono text-xs font-bold text-primary shrink-0">
                  {entry.avatar.length === 1 ? (
                    entry.avatar
                  ) : (
                    <img alt="Avatar" className="w-full h-full object-cover" src={entry.avatar} />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-on-surface">{entry.name}</h4>
                  <span className="font-mono text-[9px] text-secondary">{entry.organization}</span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3 hidden md:flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px] font-mono text-secondary font-bold">
                  <span className="material-symbols-outlined text-[14px] text-[#A35C44]">local_fire_department</span>
                  {entry.streak}
                </div>
                <div className="w-[1px] h-3 bg-outline-variant/30 mx-1"></div>
                <span className="material-symbols-outlined text-[14px] text-primary">{entry.icon}</span>
              </div>

              <div className="col-span-12 md:col-span-3 flex justify-end items-center gap-2">
                <span className="font-mono text-xs font-bold text-on-surface">{entry.impact}</span>
                <span className="font-mono text-[9px] text-outline uppercase tracking-wider">tons</span>
              </div>
            </div>
          ))}
          {filteredRankings.length === 0 && (
            <div className="p-8 text-center text-xs text-secondary font-mono">No matching researchers found.</div>
          )}
        </div>

        {/* Load More Button */}
        <div className="p-4 text-center bg-surface-container-low/30 border-t border-outline-variant/20">
          <button 
            onClick={() => toast.success('Loading next 10 ledger rankings...')}
            className="font-mono text-[10px] text-secondary hover:text-primary transition-colors uppercase tracking-wider flex items-center justify-center w-full gap-2 py-1"
          >
            Load More Entries
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
