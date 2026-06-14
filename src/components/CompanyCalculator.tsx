import React, { useState, useEffect } from 'react';
import { Currency } from '../types';
import { CURRENCY_LIST } from '../initialData';
import { Scale, Calculator, Building2, Zap, Truck, Plane, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CompanyCalculatorProps {
  onOffsetRequiredCalculated: (credits: number) => void;
  onNavigateToMarket: () => void;
}

export default function CompanyCalculator({ onOffsetRequiredCalculated, onNavigateToMarket }: CompanyCalculatorProps) {
  // Industrialist Profile States
  const [companyName, setCompanyName] = useState('Zenith Industrial Holdings');
  const [industryType, setIndustryType] = useState('Manufacturing');
  const [headquarters, setHeadquarters] = useState('Singapore');

  // Footprint Calculator Sliders / Inputs
  const [electricityMWh, setElectricityMWh] = useState<number>(350);
  const [shippingKm, setShippingKm] = useState<number>(24000);
  const [flightHours, setFlightHours] = useState<number>(120);
  const [directEmissions, setDirectEmissions] = useState<number>(45);

  // Computed Footprints
  const [electricityCarbon, setElectricityCarbon] = useState(0);
  const [shippingCarbon, setShippingCarbon] = useState(0);
  const [travelCarbon, setTravelCarbon] = useState(0);
  const [totalFootprint, setTotalFootprint] = useState(0);

  // Calculate carbon footprint in real-time
  useEffect(() => {
    // 1 MWh of average grid electricity ~= 0.45 tons CO2e
    const elecCO2 = Number((electricityMWh * 0.45).toFixed(1));
    // 1,000 km of standard truck freight ~= 0.12 tons of CO2e
    const shipCO2 = Number(((shippingKm / 1000) * 0.12).toFixed(1));
    // 1 hour of commercial passenger airflight ~= 0.22 tons of CO2e
    const travelCO2 = Number((flightHours * 0.22).toFixed(1));
    
    const sum = Number((elecCO2 + shipCO2 + travelCO2 + directEmissions).toFixed(1));

    setElectricityCarbon(elecCO2);
    setShippingCarbon(shipCO2);
    setTravelCarbon(travelCO2);
    setTotalFootprint(sum);
  }, [electricityMWh, shippingKm, flightHours, directEmissions]);

  // Transmit the credits demand back to the global index
  const handleApplyToExchange = () => {
    onOffsetRequiredCalculated(totalFootprint);
    onNavigateToMarket();
  };

  const industries = ['Manufacturing', 'Logistics/Freight', 'Technology', 'Energy/Power', 'Steel & Metals', 'Agribusiness'];
  const locations = ['Singapore', 'Mumbai, India', 'Sydney, Australia', 'Auckland, NZ', 'London, UK', 'Dubai, UAE', 'New York, USA'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left side: Industrial profile and calculator inputs */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-950">
              Industrialist Registry Profiler
            </h3>
            <p className="text-xs text-slate-500">
              Verify your organizational footprint and construct standard compliance reports.
            </p>
          </div>
        </div>

        {/* Company profile builder */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
              placeholder="Enter enterprise name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sector Group</label>
            <select
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
            >
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HQs Jurisdiction</label>
            <select
              value={headquarters}
              onChange={(e) => setHeadquarters(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Core Sliders Inputs */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-600" />
            Audit Parameters / Scope Emittance
          </div>

          {/* Slider 1: Electricity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                Scope 2: Purchased Electricity (Grid Consumed)
              </span>
              <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                {electricityMWh.toLocaleString()} MWh
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={electricityMWh}
              onChange={(e) => setElectricityMWh(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 MWh</span>
              <span>1 MWh ≈ 0.45 tCO₂e</span>
              <span>2,000 MWh</span>
            </div>
          </div>

          {/* Slider 2: Shipping */}
          <div className="space-y-2 pt-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                Scope 3: Logistics & Freight Shipping
              </span>
              <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                {shippingKm.toLocaleString()} km
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={shippingKm}
              onChange={(e) => setShippingKm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 km</span>
              <span>1,000 km freight ≈ 0.12 tCO₂e</span>
              <span>100,000 km</span>
            </div>
          </div>

          {/* Slider 3: Flights */}
          <div className="space-y-2 pt-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-850">
              <span className="flex items-center gap-1.5 font-medium">
                <Plane className="w-4 h-4 text-indigo-500 shrink-0" />
                Scope 3: Corporate Aviation & Employee Commutes
              </span>
              <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                {flightHours.toLocaleString()} Flight Hours
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="500"
              step="5"
              value={flightHours}
              onChange={(e) => setFlightHours(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 hours</span>
              <span>1 hr flight ≈ 0.22 tCO₂e</span>
              <span>500 hours</span>
            </div>
          </div>

          {/* Numeric Input: Direct scope 1 */}
          <div className="space-y-2 pt-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <Scale className="w-4 h-4 text-rose-500 shrink-0" />
                Scope 1: Direct Boiler Operations & Gas Fuels
              </span>
              <span className="text-slate-400 font-normal">Tons of direct CO₂</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={directEmissions}
                onChange={(e) => setDirectEmissions(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs font-bold p-2.5 pl-3 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono text-rose-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Summary widget, visual gauge and prompt to offset */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-md flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="border-b border-slate-850 pb-3">
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              {industryType} Sector Summary
            </div>
            <h3 className="text-lg font-bold font-display text-white mt-0.5">
              {companyName} Trace
            </h3>
            <span className="text-xs text-slate-400">Jurisdiction: {headquarters} HQ</span>
          </div>

          {/* Footprint breakdown indicators with mini horizontal gauges */}
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-350">
                <span>Electricity footprint:</span>
                <span className="font-mono text-white font-semibold">{electricityCarbon} tCO₂e</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (electricityCarbon / totalFootprint) * 100 || 0)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-350">
                <span>Logistics & Freight:</span>
                <span className="font-mono text-white font-semibold">{shippingCarbon} tCO₂e</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, (shippingCarbon / totalFootprint) * 100 || 0)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-350">
                <span>Aviation Commutes:</span>
                <span className="font-mono text-white font-semibold">{travelCarbon} tCO₂e</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400" style={{ width: `${Math.min(100, (travelCarbon / totalFootprint) * 100 || 0)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-350">
                <span>Direct Scope 1:</span>
                <span className="font-mono text-white font-semibold">{directEmissions} tCO₂e</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: `${Math.min(100, (directEmissions / totalFootprint) * 100 || 0)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Badge Display of required tokens */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/40 text-center space-y-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            Computed Regulatory Deficit
          </div>
          <div className="text-3xl font-extrabold text-white text-emerald-400 font-mono font-display">
            {totalFootprint.toLocaleString()}
            <span className="text-xs text-slate-300 font-normal ml-1">tCO₂e</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
            This represents the precise carbon credit purchase required to achieve certified carbon neutrality.
          </div>
        </div>

        {/* Action Button Pipeline */}
        <button
          onClick={handleApplyToExchange}
          disabled={totalFootprint <= 0}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-emerald-950" />
          Apply Deficit & Open Credits Market
        </button>
      </div>

    </div>
  );
}
