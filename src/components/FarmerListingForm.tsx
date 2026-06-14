import React, { useState } from 'react';
import { CarbonProject } from '../types';
import { CURRENCY_LIST } from '../initialData';
import { Leaf, PlusCircle, Globe, DollarSign, CloudRain, Star, Sparkles, CheckCircle } from 'lucide-react';

interface FarmerListingFormProps {
  onAddProject: (project: Omit<CarbonProject, 'id' | 'soldCredits' | 'telemetryLogs'>) => void;
  onSuccessNavigate: () => void;
}

export default function FarmerListingForm({ onAddProject, onSuccessNavigate }: FarmerListingFormProps) {
  // Farm Listing registration States
  const [name, setName] = useState('');
  const [type, setType] = useState<'Forestry' | 'Agroforestry' | 'Blue Carbon' | 'Soil Carbon' | 'Renewable Energy' | 'Peatland'>('Forestry');
  const [country, setCountry] = useState('India');
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerType, setOwnerType] = useState<'Farmer' | 'Natural Reserve' | 'Cooperative' | 'NGO'>('Farmer');
  
  const [verifiedCredits, setVerifiedCredits] = useState<number>(10000);
  const [pricePerCreditUSD, setPricePerCreditUSD] = useState<number>(20.00);
  const [sequestrationRate, setSequestrationRate] = useState<number>(15.0);
  
  const [latitude, setLatitude] = useState<number>(20.5937); // India default
  const [longitude, setLongitude] = useState<number>(78.9629);
  const [description, setDescription] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  // Auto coordinate sets based on general selected regions
  const handleCountryPresetChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    switch (selectedCountry) {
      case 'India':
        setLatitude(20.5937);
        setLongitude(78.9629);
        break;
      case 'Singapore':
        setLatitude(1.3521);
        setLongitude(103.8198);
        break;
      case 'Australia':
        setLatitude(-25.2744);
        setLongitude(133.7751);
        break;
      case 'New Zealand':
        setLatitude(-40.9006);
        setLongitude(174.8860);
        break;
      case 'United Kingdom':
        setLatitude(55.3781);
        setLongitude(-3.4360);
        break;
      case 'United Arab Emirates':
        setLatitude(23.4241);
        setLongitude(53.8478);
        break;
      case 'Brazil':
        setLatitude(-14.2350);
        setLongitude(-51.9253);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !location.trim() || !ownerName.trim() || !description.trim()) {
      return;
    }

    onAddProject({
      name,
      type,
      location,
      country,
      ownerName,
      ownerType,
      verifiedCredits,
      pricePerCreditUSD,
      sequestrationRate,
      latitude,
      longitude,
      description
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccessNavigate(); // Redirect to market/telemetry view
    }, 1500);
  };

  // List of standard hot countries
  const countries = ['India', 'Singapore', 'Australia', 'New Zealand', 'United Kingdom', 'United Arab Emirates', 'Brazil'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Listing Form */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <PlusCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-slate-100 text-slate-950">
              Register Carbon Credit Reserve
            </h3>
            <p className="text-xs text-slate-500">
              List your verified forest, ocean meadows or farmland carbon captures to connect with global compliance buyers.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-emerald-50 rounded-full text-emerald-500">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Reserve Successfully Registered!</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Your telemetry coordinates have been bound and registered. The sensor node is online and listing is live.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-slate-800">
            {/* Owner meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Owner / Operator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alistair Macleod"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Operator Subgroup</label>
                <select
                  value={ownerType}
                  onChange={(e) => setOwnerType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="Farmer">Individual Farmer</option>
                  <option value="Natural Reserve">Natural Reserve / Sanctuary</option>
                  <option value="Cooperative">Farmer Cooperative</option>
                  <option value="NGO">Non-Governmental Org (NGO)</option>
                </select>
              </div>
            </div>

            {/* Project Title and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Reserve/Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peak District Peat Bog Restoration"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Offset Taxonomy Class</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="Forestry">Forestry Protection & Planting</option>
                  <option value="Blue Carbon">Blue Carbon (Seagrass/Mangrove)</option>
                  <option value="Agroforestry">Smallholder Agroforestry</option>
                  <option value="Soil Carbon">Soil Regenerative Capture</option>
                  <option value="Peatland">Peatland Hydrated Hydration</option>
                  <option value="Renewable Energy">Renewable Generation offsets</option>
                </select>
              </div>
            </div>

            {/* Geographics */}
            <div className="bg-slate-55 relative p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                Regional GIS Coordinates & Telemetry Placement
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Country Jurisdiction</label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryPresetChange(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Specific Sector Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Devonshire uplands"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scale, pricing & Sequestration metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Verified Token Supply (tCO₂e)</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={verifiedCredits}
                  onChange={(e) => setVerifiedCredits(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition font-mono font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target base price / unit (USD)</label>
                <input
                  type="number"
                  required
                  step="0.10"
                  min="5"
                  value={pricePerCreditUSD}
                  onChange={(e) => setPricePerCreditUSD(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition font-mono font-bold text-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sequestration rate (tCO₂e/hr)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={sequestrationRate}
                  onChange={(e) => setSequestrationRate(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition font-mono font-semibold"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project Narrative & Conservation Story</label>
              <textarea
                required
                rows={4}
                placeholder="Detail the conservation processes, standard methodologies used, and the direct local social/environmental impact..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
            >
              <Leaf className="w-4 h-4" />
              Authorize Node Node & Deploy Listing
            </button>
          </form>
        )}
      </div>

      {/* Conversion Equivalency Simulator Panel (Right sidebar) */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 text-white rounded-xl p-6 shadow-md flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              REGISTRY EQUIVALENCY CALCULATOR
            </span>
            <h4 className="text-base font-bold font-display text-white mt-1">
              Reciprocating Currency Matrix
            </h4>
            <p className="text-[11px] text-slate-400">
              When listing a price in USD, our cross-border ledger resolves trades dynamically in any currency selected by the buying industrialist.
            </p>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-750 flex justify-between">
              <span className="text-slate-400">USD List Price (Base)</span>
              <span className="font-bold text-emerald-400">${pricePerCreditUSD.toFixed(2)} USD</span>
            </div>

            {/* Reciprocating list */}
            {CURRENCY_LIST.map((currency) => (
              currency.code !== 'USD' && (
                <div key={currency.code} className="py-2.5 px-3 border-b border-slate-850 flex justify-between text-slate-300">
                  <span>{currency.name} ({currency.code})</span>
                  <span className="font-semibold text-white">
                    {currency.symbol}{(pricePerCreditUSD * currency.rateToUSD).toFixed(2)} {currency.code}
                  </span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-center space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">Consensus verification</span>
          <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 uppercase font-display">
            <Sparkles className="w-3.5 h-3.5" />
            VIRTUAL BLOCKCHAIN DEPLOY READY
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Standard verifications require satellite matching telemetry logs to sign compliance blocks before public trades proceed.
          </p>
        </div>
      </div>

    </div>
  );
}
