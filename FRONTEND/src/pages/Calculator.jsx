import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api, getAuthToken } from '../services/api';

const tabs = [
  { id: 'transport', label: 'Transport', icon: 'directions_car' },
  { id: 'electricity', label: 'Electricity', icon: 'bolt' },
  { id: 'diet', label: 'Diet', icon: 'restaurant' },
  { id: 'flights', label: 'Flights', icon: 'flight' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { id: 'waste', label: 'Waste', icon: 'delete_outline' },
];

const formatKg = (value) => Number(value.toFixed(1));

const Calculator = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('transport');
  const [isSaving, setIsSaving] = useState(false);

  const [transportKm, setTransportKm] = useState(28);
  const [transportType, setTransportType] = useState('petrol_car');
  const [electricityKwh, setElectricityKwh] = useState(14);
  const [energySource, setEnergySource] = useState('grid_mix');
  const [dietType, setDietType] = useState('balanced');
  const [flightKmYear, setFlightKmYear] = useState(2400);
  const [flightClass, setFlightClass] = useState('economy');
  const [departureAirport, setDepartureAirport] = useState('SFO');
  const [destinationAirport, setDestinationAirport] = useState('JFK');
  const [passengers, setPassengers] = useState(1);
  const [clothingItems, setClothingItems] = useState(3);
  const [electronicsItems, setElectronicsItems] = useState(0);
  const [monthlySpend, setMonthlySpend] = useState(120);
  const [wasteKgWeek, setWasteKgWeek] = useState(6);
  const [recyclingRate, setRecyclingRate] = useState(45);

  const transportFactors = {
    petrol_car: 0.19,
    diesel_car: 0.21,
    hybrid: 0.11,
    ev: 0.05,
    public_transit: 0.04,
    bicycle: 0,
  };

  const electricityFactors = {
    grid_mix: 0.42,
    renewable: 0.08,
    solar: 0.02,
  };

  const dietScores = {
    meat_heavy: 8.2,
    balanced: 5.4,
    vegetarian: 3.2,
    vegan: 2.1,
  };

  const flightClassMultiplier = {
    economy: 1,
    premium: 1.35,
    business: 2.1,
  };

  const transportScore = formatKg(transportKm * transportFactors[transportType]);
  const electricityScore = formatKg(electricityKwh * electricityFactors[energySource]);
  const dietScore = dietScores[dietType];
  const flightsScore = formatKg((flightKmYear * 0.115 * flightClassMultiplier[flightClass]) / 365);
  const shoppingScore = formatKg(((clothingItems * 25) + (electronicsItems * 120) + (monthlySpend * 0.35)) / 30);
  const wasteScore = formatKg(((wasteKgWeek * 0.7) * (1 - recyclingRate / 100)) / 7);

  const breakdown = [
    { id: 'transport', label: 'Transport', value: transportScore, icon: 'directions_car' },
    { id: 'electricity', label: 'Electricity', value: electricityScore, icon: 'bolt' },
    { id: 'diet', label: 'Diet', value: dietScore, icon: 'restaurant' },
    { id: 'flights', label: 'Flights', value: flightsScore, icon: 'flight' },
    { id: 'shopping', label: 'Shopping', value: shoppingScore, icon: 'shopping_bag' },
    { id: 'waste', label: 'Waste', value: wasteScore, icon: 'delete_outline' },
  ];

  const totalDaily = formatKg(breakdown.reduce((sum, item) => sum + item.value, 0));
  const monthlyEstimate = formatKg(totalDaily * 30);
  const yearlyEstimate = formatKg(totalDaily * 365);
  const highestCategory = breakdown.reduce((top, item) => (item.value > top.value ? item : top), breakdown[0]);
  const maxCategoryValue = Math.max(...breakdown.map((item) => item.value), 1);

  const suggestions = [
    transportScore > 4 ? 'Shift two weekly trips to public transit, EV, cycling, or walking to cut transport impact quickly.' : null,
    electricityScore > 4 ? 'Move high-use appliances to off-peak hours or switch part of your supply to renewable electricity.' : null,
    dietScore > 5 ? 'Swap a few meat-heavy meals for vegetarian or plant-based meals to lower daily food emissions.' : null,
    flightsScore > 1 ? 'Bundle trips, choose economy seats, or offset long-haul flights when travel is unavoidable.' : null,
    shoppingScore > 4 ? 'Reduce new clothing/electronics purchases and favor repair, reuse, or second-hand options.' : null,
    wasteScore > 0.5 ? 'Increase recycling and composting to reduce landfill methane impact from weekly waste.' : null,
  ].filter(Boolean);

  const backendPayloads = [
    {
      category: 'transport',
      metadata: { transportType, distanceKm: transportKm },
    },
    {
      category: 'electricity',
      metadata: { energySource, kwh: electricityKwh, country: 'us', state: 'ca' },
    },
    {
      category: 'diet',
      metadata: { dietType },
    },
    {
      category: 'flights',
      metadata: {
        kmPerYear: flightKmYear,
        flightClass,
        departureAirport,
        destinationAirport,
        passengers,
      },
    },
    {
      category: 'shopping',
      metadata: { clothingItems, electronicsItems, monthlySpend },
    },
    {
      category: 'waste',
      metadata: { wasteKgWeek, recyclingRate },
    },
  ];

  const handleLockCoordinates = async () => {
    setIsSaving(true);

    try {
      if (getAuthToken()) {
        const saved = await Promise.all(
          backendPayloads.map((payload) => api.estimateEmission({ ...payload, save: true }))
        );
        const liveTotal = saved.reduce((sum, result) => sum + Number(result.amountKg || result.totalCO2 || 0), 0);
        toast.success(`Live backend updated: ${formatKg(liveTotal)} kg CO2e/day saved.`);
      } else {
        toast.success(`Estimate saved locally: ${totalDaily} kg CO2e/day.`);
      }

      if (user) {
        setUser({
          ...user,
          ecoIndex: user.ecoIndex + 10
        });
      }
    } catch (err) {
      toast.error(err.message || 'Could not save estimate to backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderRange = ({ label, value, setValue, min, max, step = 1, suffix }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="font-mono text-[9px] uppercase tracking-wider text-outline">{label}</label>
        <span className="font-mono text-xs font-bold text-primary">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

  return (
    <div className="flex-1 flex flex-col gap-8 text-left relative z-20">
      <div className="border-b border-outline-variant/30 pb-6">
        <h2 className="font-literata text-3xl md:text-4xl font-bold text-primary">Carbon Telemetry Calculator</h2>
        <p className="text-secondary text-sm mt-1">Estimate daily CO2e from transport, electricity, diet, flights, shopping, and waste.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[72px] rounded-2xl border px-3 py-3 flex flex-col items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'border-primary bg-primary text-white shadow-soft'
                    : 'border-outline-variant/40 bg-white text-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-glow" className="absolute inset-0 rounded-2xl ring-2 ring-primary/10" />
                )}
                <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                <span className="relative font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft">
            {activeTab === 'transport' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Transport</h4>
                  <p className="text-secondary text-xs">Daily distance and primary travel mode.</p>
                </div>
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Travel Mode</label>
                  <select value={transportType} onChange={(event) => setTransportType(event.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none">
                    <option value="petrol_car">Petrol car</option>
                    <option value="diesel_car">Diesel car</option>
                    <option value="hybrid">Hybrid car</option>
                    <option value="ev">Electric vehicle</option>
                    <option value="public_transit">Public transit</option>
                    <option value="bicycle">Bicycle / walking</option>
                  </select>
                </div>
                {renderRange({ label: 'Daily travel distance', value: transportKm, setValue: setTransportKm, min: 0, max: 180, suffix: ' km' })}
              </div>
            )}

            {activeTab === 'electricity' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Electricity</h4>
                  <p className="text-secondary text-xs">Household electricity use and grid source.</p>
                </div>
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Energy Source</label>
                  <select value={energySource} onChange={(event) => setEnergySource(event.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none">
                    <option value="grid_mix">Standard grid mix</option>
                    <option value="renewable">Renewable supplier</option>
                    <option value="solar">Local solar</option>
                  </select>
                </div>
                {renderRange({ label: 'Daily electricity usage', value: electricityKwh, setValue: setElectricityKwh, min: 0, max: 80, suffix: ' kWh' })}
              </div>
            )}

            {activeTab === 'diet' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Diet</h4>
                  <p className="text-secondary text-xs">Average daily dietary emissions profile.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'meat_heavy', label: 'Meat heavy', desc: 'Frequent beef, pork, and dairy.' },
                    { id: 'balanced', label: 'Balanced', desc: 'Mixed grains, poultry, dairy, and occasional beef.' },
                    { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, with dairy or eggs.' },
                    { id: 'vegan', label: 'Plant based', desc: 'Legumes, grains, vegetables, and no animal products.' },
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => setDietType(option.id)}
                      className={`p-4 border rounded-2xl text-left transition-all ${
                        dietType === option.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/30 hover:border-outline hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-wider font-bold">{option.label}</span>
                      <p className="text-[10px] text-secondary mt-2 leading-relaxed">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'flights' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Flights</h4>
                  <p className="text-secondary text-xs">Airport-route estimates use Carbon Interface when the backend API key is configured.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">From</label>
                    <input
                      type="text"
                      value={departureAirport}
                      onChange={(event) => setDepartureAirport(event.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">To</label>
                    <input
                      type="text"
                      value={destinationAirport}
                      onChange={(event) => setDestinationAirport(event.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Passengers</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={passengers}
                      onChange={(event) => setPassengers(Number(event.target.value))}
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-wider text-outline block mb-2">Cabin Class</label>
                  <select value={flightClass} onChange={(event) => setFlightClass(event.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-xl font-mono text-[11px] uppercase focus:outline-none">
                    <option value="economy">Economy</option>
                    <option value="premium">Premium economy</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                {renderRange({ label: 'Annual flight distance', value: flightKmYear, setValue: setFlightKmYear, min: 0, max: 50000, step: 100, suffix: ' km' })}
              </div>
            )}

            {activeTab === 'shopping' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Shopping</h4>
                  <p className="text-secondary text-xs">Monthly clothing, electronics, and general purchases.</p>
                </div>
                {renderRange({ label: 'New clothing items per month', value: clothingItems, setValue: setClothingItems, min: 0, max: 20, suffix: '' })}
                {renderRange({ label: 'Electronics items per month', value: electronicsItems, setValue: setElectronicsItems, min: 0, max: 6, suffix: '' })}
                {renderRange({ label: 'Other monthly spend', value: monthlySpend, setValue: setMonthlySpend, min: 0, max: 2000, step: 10, suffix: ' USD' })}
              </div>
            )}

            {activeTab === 'waste' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-literata text-lg font-bold text-primary mb-2">Waste</h4>
                  <p className="text-secondary text-xs">Weekly landfill waste and recycling rate.</p>
                </div>
                {renderRange({ label: 'Waste sent to landfill', value: wasteKgWeek, setValue: setWasteKgWeek, min: 0, max: 40, suffix: ' kg/week' })}
                {renderRange({ label: 'Recycling and composting rate', value: recyclingRate, setValue: setRecyclingRate, min: 0, max: 100, suffix: '%' })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-outline-variant rounded-3xl p-6 md:p-8 shadow-soft">
            <span className="font-mono text-[10px] uppercase tracking-wider text-outline">Clear CO2 Estimate</span>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low/30 p-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-1">Daily</p>
                <p className="font-mono text-3xl font-bold text-primary">{totalDaily} kg</p>
              </div>
              <div className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-1">Monthly</p>
                <p className="font-mono text-2xl font-bold text-primary">{monthlyEstimate} kg</p>
              </div>
              <div className="rounded-2xl border border-outline-variant/40 bg-white p-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-outline mb-1">Yearly</p>
                <p className="font-mono text-2xl font-bold text-primary">{yearlyEstimate} kg</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-literata text-xl font-bold text-primary">Breakdown</h3>
                <span className="font-mono text-[9px] uppercase tracking-wider text-outline">{highestCategory.label} leads</span>
              </div>
              <div className="space-y-3">
                {breakdown.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <span className="material-symbols-outlined text-primary text-[18px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-primary">{item.value} kg</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-low overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.max((item.value / maxCategoryValue) * 100, 3)}%` }}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLockCoordinates}
              disabled={isSaving}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-soft hover:shadow-lg hover:bg-primary-container active:scale-[0.98] transition-all text-xs uppercase tracking-wider font-mono mt-6"
            >
              {isSaving ? 'Saving Estimate...' : 'Save Estimate'}
            </button>
          </div>

          <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-soft">
            <h3 className="font-literata text-xl font-bold text-primary mb-1">Suggestions</h3>
            <p className="text-secondary text-xs mb-5">Personalized actions based on your highest inputs.</p>
            <div className="space-y-3">
              {(suggestions.length ? suggestions : ['Your current inputs are already low. Keep tracking weekly and protect the habits that are working.']).slice(0, 4).map((suggestion) => (
                <div key={suggestion} className="flex gap-3 rounded-2xl border border-outline-variant/40 p-4">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">tips_and_updates</span>
                  <p className="text-secondary text-xs leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
