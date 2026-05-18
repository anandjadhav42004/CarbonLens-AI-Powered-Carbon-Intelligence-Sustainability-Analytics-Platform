import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Calculator = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('mobility');

  // Input states
  const [transitKm, setTransitKm] = useState(25);
  const [transitType, setTransitType] = useState('petrol_car');
  const [dietType, setDietType] = useState('balanced');
  const [waterLitres, setWaterLitres] = useState(150);
  const [electricityKwh, setElectricityKwh] = useState(12);
  const [energySource, setEnergySource] = useState('grid_mix');

  // Aggregated score calculations
  let mobilityFactor = 0.18;
  if (transitType === 'ev') mobilityFactor = 0.05;
  else if (transitType === 'transit') mobilityFactor = 0.03;
  else if (transitType === 'bicycle') mobilityFactor = 0;
  const mobilityScore = parseFloat((transitKm * mobilityFactor).toFixed(1));

  let dietScore = 5.2;
  if (dietType === 'meat_heavy') dietScore = 8.5;
  else if (dietType === 'vegetarian') dietScore = 3.1;
  else if (dietType === 'vegan') dietScore = 1.8;

  let energyFactor = 0.4;
  if (energySource === 'renewable') energyFactor = 0.05;
  else if (energySource === 'solar') energyFactor = 0.01;
  const homeScore = parseFloat(((electricityKwh * energyFactor) + (waterLitres * 0.002)).toFixed(1));
  const totalScore = parseFloat((mobilityScore + dietScore + homeScore).toFixed(1));

  const handleLockCoordinates = () => {
    // Increase eco score on locking in coords
    if (user) {
      setUser({
        ...user,
        ecoIndex: user.ecoIndex + 10
      });
    }
    toast.success(`Calculated emissions Locked! Coordinates submitted: ${totalScore} kg CO₂e.`);
  };

  // Radial meter math
  const maxAllowableEmissions = 30; // 30kg is standard threshold limit
  const percentage = Math.min((totalScore / maxAllowableEmissions) * 100, 100);
  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-6">
        <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Carbon Telemetry Calculator</h2>
        <p className="text-secondary text-sm mt-1">An analog scientific journal tool mapping absolute vehicle, utility, and diet coordinates.</p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Cards Container (Left 7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Tab selector */}
          <div className="flex border-b border-outline-variant/30 font-mono text-[11px] uppercase tracking-wider gap-6">
            <button
              onClick={() => setActiveTab('mobility')}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === 'mobility' ? 'text-primary' : 'text-outline hover:text-primary'
              }`}
            >
              {activeTab === 'mobility' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
              Mobility Telemetry
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === 'diet' ? 'text-primary' : 'text-outline hover:text-primary'
              }`}
            >
              {activeTab === 'diet' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
              Nutrition Sector
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`pb-3 font-bold transition-all relative ${
                activeTab === 'home' ? 'text-primary' : 'text-outline hover:text-primary'
              }`}
            >
              {activeTab === 'home' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
              Home & Utilities
            </button>
          </div>

          {/* Tab Content Cards */}
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft">
            
            {activeTab === 'mobility' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Transit Commute Coordinates</h4>
                  <p className="text-secondary text-xs">Configure daily mileage and vehicle telemetry coordinates.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Vehicle Type</label>
                    <select
                      value={transitType}
                      onChange={(e) => setTransitType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                    >
                      <option value="petrol_car">Standard Petrol Sedan</option>
                      <option value="ev">Electric Vehicle (EV)</option>
                      <option value="transit">Metro Transit / Electric Train</option>
                      <option value="bicycle">Bicycle / Green Walking</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-outline">Daily Commuting Range</label>
                      <span className="font-mono text-xs font-bold text-primary">{transitKm} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={transitKm}
                      onChange={(e) => setTransitKm(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diet' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Nutritional Habit Diary</h4>
                  <p className="text-secondary text-xs">Input primary nourishment intake category coordinates.</p>
                </div>

                <div className="space-y-4">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-outline block">Select Nutrition Profile</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'meat_heavy', label: 'Meat Intensive', desc: 'Frequent beef, pork, and high-intensity poultry consumption.' },
                      { id: 'balanced', label: 'Balanced Diet', desc: 'Mixed grain, seafood, poultry, with occasional beef/dairy.' },
                      { id: 'vegetarian', label: 'Vegetarian', desc: 'Exclusion of meat/seafood. High egg and dairy alternatives.' },
                      { id: 'vegan', label: 'Plant-Based / Vegan', desc: 'Pure biological grain, legume, organic vegetables sourcing.' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setDietType(opt.id)}
                        className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                          dietType === opt.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-outline-variant/30 hover:border-outline hover:bg-surface-container-low'
                        }`}
                      >
                        <span className="font-mono text-[11px] uppercase tracking-wider font-bold">{opt.label}</span>
                        <p className="text-[10px] text-secondary mt-2 leading-relaxed">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'home' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Household & Utility Telemetry</h4>
                  <p className="text-secondary text-xs">Configure energy sourcing matrices and water logging indicators.</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Utility Source Matrix</label>
                    <select
                      value={energySource}
                      onChange={(e) => setEnergySource(e.target.value)}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                    >
                      <option value="grid_mix">Standard grid fossil mix</option>
                      <option value="renewable">Certified Clean Hydropower</option>
                      <option value="solar">Local Solar Generation (Active)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-outline">Electricity Usage</label>
                      <span className="font-mono text-xs font-bold text-primary">{electricityKwh} kWh/day</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={electricityKwh}
                      onChange={(e) => setElectricityKwh(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-mono text-[9px] uppercase tracking-wider text-outline">Water Consumption</label>
                      <span className="font-mono text-xs font-bold text-primary">{waterLitres} Litres/day</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={waterLitres}
                      onChange={(e) => setWaterLitres(parseInt(e.target.value))}
                      className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visual Astrolabe Radial Score Canvas (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft flex flex-col items-center justify-between text-center relative overflow-hidden">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline mb-4">Emissions Indicator Astrolabe</span>
            
            {/* SVG Astrolabe Radial Circle */}
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  className="stroke-surface-container-low fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="70"
                  className="stroke-primary fill-none transition-all duration-500"
                  strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-bold text-primary">{totalScore}</span>
                <span className="font-mono text-[9px] text-outline uppercase tracking-wider mt-1">kg CO₂e/day</span>
              </div>
            </div>

            {/* Score Breakdowns */}
            <div className="w-full space-y-3 pt-6 border-t border-outline-variant/30 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">Mobility Telemetry</span>
                <span className="font-mono font-bold text-primary">{mobilityScore} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">Nutrition Sector</span>
                <span className="font-mono font-bold text-primary">{dietScore} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-secondary">Home & Water Sourcing</span>
                <span className="font-mono font-bold text-primary">{homeScore} kg</span>
              </div>
            </div>

            <button
              onClick={handleLockCoordinates}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-soft hover:shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all text-xs uppercase tracking-wider font-mono mt-6"
            >
              Lock in Coordinates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
