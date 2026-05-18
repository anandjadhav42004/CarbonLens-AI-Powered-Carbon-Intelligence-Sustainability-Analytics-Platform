import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

const communityMetrics = [
  { icon: 'eco', label: 'Reforestation Progress', value: '14,204 Hectares', detail: '+12% vs LY' },
  { icon: 'bolt', label: 'Renewable Adoption', value: '88.4 GW Tracked', detail: 'Active Now' },
  { icon: 'group', label: 'Community Campaigns', value: '2,840 Successes', detail: 'Global Reach' },
];

const Community = () => {
  const { user } = useAuth();
  
  // Newsfeed posts
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: 'Elias Vance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz-RyG3IzGBfiRDTwR2jfVC_LwkoRQ2lw3fuqb-Ga1tQsaLFAc2ThFio0dhnToAnZY_4AbWpsMcCnX4oO3V_yBAX1Hikn54FY_9FBzv2q3PKdKtbyICEqOcMDBM6o4c7aNEIOrPgI8qbSji51RaBLgMzXcx2Od1jzMMGIRTUbtgCke2SQWfDec33JgErxnWPQQ_tugVSTZOK_2eaaQfuWq3f0ummnDNWtHUBNVHlmkDMDwb7hQWCVegKCLg8dTmwahziSxIeeifk',
      role: 'Apex Conservation',
      date: '2 hours ago',
      content: 'Just finalized our seasonal boreal soil audit. Soil moisture is at a peak, indicating operational latency in organic degradation is down by 5.2%. Here are some telemetry files for analysis.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsXIV36c0U4--OlyzVAIgPbXgYZjl2SpO7ZJYWqR3VZY9jheUUmo7B5ugAHQtw1OwcPb8di66lIwToIOytdGq3-L35hj99x3PQ6JUOUjBJX0TUwqZ2aiROMZYLyyvlViuY4Gy5CTltjRannJcu_yku-1paSe_xhcpXLQIQUf_tTsXqThFUotTQkr3_kdZUefg3aJ3X1669hwQ-bYs6KXyn6KYOgSJWVX3IpHXrcrWal3gvJZKTQYmKsHAl1cvVeJ97MT4lfMd-jTc',
      likes: 24,
      liked: false,
    },
    {
      id: '2',
      author: 'Maya Lin',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUTlgzxZhrwUUkKJuB746FmGPlFETp8OWc-8z4OZMUrIrpwUpSl9h585IdgiDtl61XkmfPEohGiOKNwYySBIPpQSR0odqwd9Okx1kI9cnK9iwszOkk1SQQdac_1L8Qa7Omh-ABgI56QG96AV3z3jSsFI6V5wTJinLcUh1fWdJHBLeIEBLenCvW8F_-QI_mWdfwY9vWu3FlUT72RHjCzdShyX6NcpL9eDTfZ1HHzT9h16EghuRjhMs_qKm27mwK1PBuMJapCL-yVTY',
      role: 'Urban Canopy Initiative',
      date: '1 day ago',
      content: 'Urban forestry indices in Sector A show a 14% improvement in foliage shading capacity. This will reduce cooling emissions spikes this summer!',
      likes: 18,
      liked: false,
    }
  ]);

  // Form state
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast.error('Post content cannot be empty.');
      return;
    }

    const newPost = {
      id: Math.random().toString(),
      author: user ? user.name : 'Dr. Aris Thorne',
      avatar: user ? user.avatar : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAddBDSnyKnzhYahgwnfatZ7VdfRC_UIXC-nI_W0BIZU2TleAP5l24hSPBVRhEomyyjrkoxX8Jh1JbvUNkm3-u25x2X2qwNK7FYVaEzhUm1J2ABEUucA5xLclzjOLbPrmmMFF9AVniCj4t5cDEBywYQUar8aR01kJngHztCNQSteT4bsY9_zMImAA4N03Kqm_lobbhQfQ5hbvrOR0V33uHL4iDHC3LHW_Jz4jfa5fGOMbUdpr_o8sLrHFX6aJxLyTZVt6B-li2xZJ0',
      role: user ? user.tier : 'Apex Restorationist',
      date: 'Just now',
      content: newPostContent,
      likes: 0,
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Journal update published to the global ledger network.');
  };

  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-6">
        <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Global Curator Network</h2>
        <p className="text-secondary text-sm mt-1">Connect, collaborate, and share verified botanical and ecological telemetry updates.</p>
      </div>

      {/* Imported community impact widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {communityMetrics.map((metric) => (
          <div key={metric.label} className="bg-white border border-outline-variant p-6 rounded-3xl shadow-soft flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl">{metric.icon}</span>
              <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">{metric.detail}</span>
            </div>
            <div className="mt-10">
              <div className="font-mono text-[9px] text-outline uppercase tracking-wider mb-1">{metric.label}</div>
              <div className="font-literata text-xl font-bold text-on-surface">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Feed vs Clubs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Newsfeed Columns (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Create Post Card */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft text-left">
            <h4 className="font-literata text-lg font-bold text-primary mb-3">Publish Field Update</h4>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
                placeholder="Share seasonal telemetry data, soil indices or carbon calculations..."
              />
              <div className="flex justify-between items-center">
                <button 
                  type="button" 
                  onClick={() => toast.success('Telemetry files attached.')}
                  className="p-2 border border-outline-variant rounded-xl hover:bg-surface-container text-secondary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">attachment</span>
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-primary-container active:scale-95 transition-all shadow-soft"
                >
                  Publish to Network
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft flex flex-col gap-4 text-left">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full border border-outline-variant object-cover" 
                      src={post.avatar} 
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-on-surface">{post.author}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-secondary mt-0.5">
                        <span className="font-mono uppercase tracking-wider">{post.role}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-sm cursor-pointer hover:text-primary">more_horiz</span>
                </div>

                <p className="text-xs text-on-surface leading-relaxed">{post.content}</p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-outline-variant/30">
                    <img alt="Field Asset" className="w-full h-full object-cover" src={post.image} />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/10 text-xs">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.liked ? 'text-primary font-bold' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: post.liked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => toast.success('Mock comments triggered.')}
                    className="flex items-center gap-1.5 text-secondary hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                    <span>Comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missions and Research Circles (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Weekly Mission Commuter challenge */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="material-symbols-outlined text-primary/10 text-5xl font-bold">trophy</span>
            </div>
            
            <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/5 px-2.5 py-1 rounded-full">
              Weekly Challenge
            </span>
            <h4 className="font-literata text-lg font-bold text-primary mt-3 mb-2">Boreal Commuter Quest</h4>
            <p className="text-secondary text-xs leading-relaxed mb-4">
              Accumulate less than 15kg CO₂e on daily transit emissions for 7 consecutive days.
            </p>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-2">
              <div className="h-full bg-primary" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-outline font-mono uppercase font-bold">
              <span>Progress: 5/7 Days</span>
              <span className="text-primary">+50 Eco-Index</span>
            </div>
          </div>

          {/* Research Circles */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft text-left">
            <h4 className="font-literata text-base font-bold text-primary mb-4">Research Circles</h4>
            <div className="space-y-4">
              {[
                { name: 'Boreal Initiative', members: '1.2k members', icon: 'forest', joined: true },
                { name: 'Urban Canopy Project', members: '840 members', icon: 'park', joined: false },
                { name: 'Agri-Carbon Tech', members: '412 members', icon: 'agriculture', joined: false }
              ].map((circle) => (
                <div key={circle.name} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/5 border border-outline-variant/30 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-base">{circle.icon}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-on-surface">{circle.name}</h5>
                      <span className="font-mono text-[9px] text-outline">{circle.members}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.success(`Mock Joined: ${circle.name}`)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg border font-mono uppercase ${
                      circle.joined 
                        ? 'border-primary/20 bg-primary/5 text-primary' 
                        : 'border-outline-variant hover:bg-surface-container text-secondary'
                    }`}
                  >
                    {circle.joined ? 'Joined' : 'Join'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
