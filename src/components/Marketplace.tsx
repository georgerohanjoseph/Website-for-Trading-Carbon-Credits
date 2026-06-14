import React, { useState } from 'react';
import { CarbonProject, Currency, Transaction } from '../types';
import { CURRENCY_LIST } from '../initialData';
import { Search, MapPin, DollarSign, ArrowUpRight, Scale, Filter, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MarketplaceProps {
  projects: CarbonProject[];
  onExecuteTrade: (tradeParams: {
    projectId: string;
    buyerName: string;
    buyerCompany: string;
    buyerCountry: string;
    credits: number;
    currency: Currency;
  }) => void;
}

export default function Marketplace({ projects, onExecuteTrade }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [selectedProjectForTrade, setSelectedProjectForTrade] = useState<CarbonProject | null>(null);

  // Trade form states
  const [buyerName, setBuyerName] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [buyerCountry, setBuyerCountry] = useState('United States');
  const [purchaseCredits, setPurchaseCredits] = useState<number>(100);
  const [tradeExecutedSuccessfully, setTradeExecutedSuccessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Get current active currency details
  const activeCurrency = CURRENCY_LIST.find(c => c.code === selectedCurrency) || CURRENCY_LIST[0];

  // Price conversion helper
  const convertPrice = (usdPrice: number) => {
    return usdPrice * activeCurrency.rateToUSD;
  };

  // Filter projects by search query and type
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleOpenTradeDial = (project: CarbonProject) => {
    setSelectedProjectForTrade(project);
    setPurchaseCredits(Math.min(100, project.verifiedCredits - project.soldCredits));
    setTradeExecutedSuccessfully(false);
    setErrorMessage('');
  };

  const submitTradeProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForTrade) return;

    if (!buyerName.trim() || !buyerCompany.trim() || !buyerCountry.trim()) {
      setErrorMessage('Please complete all identification fields to sign the ledger.');
      return;
    }

    const maxAvailable = selectedProjectForTrade.verifiedCredits - selectedProjectForTrade.soldCredits;
    if (purchaseCredits <= 0) {
      setErrorMessage('Purchase quantity must be greater than 0.');
      return;
    }

    if (purchaseCredits > maxAvailable) {
      setErrorMessage(`Insufficient available credits. This project only has ${maxAvailable} remaining.`);
      return;
    }

    // Call high level trading runner
    onExecuteTrade({
      projectId: selectedProjectForTrade.id,
      buyerName,
      buyerCompany,
      buyerCountry,
      credits: purchaseCredits,
      currency: selectedCurrency
    });

    setTradeExecutedSuccessfully(true);
    setTimeout(() => {
      setSelectedProjectForTrade(null);
      setTradeExecutedSuccessfully(false);
    }, 1500);
  };

  // List of high prominence industrialist countries
  const countriesList = [
    'United States', 'Singapore', 'India', 'Australia', 'New Zealand', 
    'United Kingdom', 'United Arab Emirates', 'Germany', 'France', 'Japan', 'Canada'
  ];

  return (
    <div className="space-y-6">
      {/* Search & Global Currency Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-950 font-display">
              Carbon Exchange Market
            </h3>
            <p className="text-xs text-slate-500">
              Procure certified compliance tokens directly from verified farmers and reserves.
            </p>
          </div>

          {/* Master Currency Converter */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
              Trading Currency:
            </span>
            <div className="flex bg-white rounded-lg border border-slate-150 p-1 shadow-xs">
              {CURRENCY_LIST.map((curr) => {
                const isSelected = selectedCurrency === curr.code;
                return (
                  <button
                    key={curr.code}
                    id={`curr-tab-${curr.code}`}
                    onClick={() => setSelectedCurrency(curr.code)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {curr.code} ({curr.symbol})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick filters and search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {/* Search bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by project name, country, or reserve operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            {['All', 'Forestry', 'Agroforestry', 'Blue Carbon', 'Soil Carbon', 'Peatland'].map((type) => (
              <button
                key={type}
                id={`filter-type-${type}`}
                onClick={() => setSelectedType(type)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition ${
                  selectedType === type
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Carbon Project Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const available = p.verifiedCredits - p.soldCredits;
          const percentageSold = (p.soldCredits / p.verifiedCredits) * 100;

          return (
            <div
              key={p.id}
              id={`listing-card-${p.id}`}
              className="bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 transition duration-300 shadow-xs flex flex-col justify-between overflow-hidden group"
            >
              {/* Card top half */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {p.type}
                    </span>
                    <h4 className="text-base font-bold text-slate-950 font-display line-clamp-1 mt-1.5 hover:text-emerald-700 transition">
                      {p.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px]">
                  {p.description}
                </p>

                {/* Country and coordinate indicators */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono py-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.country}</span>
                  </div>
                  <div className="text-right text-slate-400">
                    {p.latitude.toFixed(2)}°N, {p.longitude.toFixed(2)}°E
                  </div>
                </div>

                {/* Ledger metrics details */}
                <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Secured Ledger:</span>
                    <span className="font-semibold text-slate-800">
                      {available.toLocaleString()} / {p.verifiedCredits.toLocaleString()} tCO₂e
                    </span>
                  </div>
                  
                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${percentageSold}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{percentageSold.toFixed(0)}% Retired</span>
                    <span>{available.toLocaleString()} tCO₂e Available</span>
                  </div>
                </div>
              </div>

              {/* Price and Transaction trigger block */}
              <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100/90 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Price per tCO₂e
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600 font-display flex items-baseline">
                    {activeCurrency.symbol}
                    {convertPrice(p.pricePerCreditUSD).toFixed(2)}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">/{selectedCurrency}</span>
                  </div>
                </div>

                <button
                  id={`buy-btn-${p.id}`}
                  onClick={() => handleOpenTradeDial(p)}
                  disabled={available <= 0}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    available > 0
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs group-hover:bg-emerald-600 group-hover:border-emerald-600'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {available > 0 ? (
                    <>
                      Buy Offset
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    'Sold Out'
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-50 rounded-xl p-12 border-2 border-dashed border-slate-200 text-center text-slate-500">
            No projects matched search criteria.
          </div>
        )}
      </div>

      {/* Trade Proposal Dialog Modal */}
      {selectedProjectForTrade && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div id="trade-modal-box" className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl relative animate-fade-in-up">
            
            {/* Modal Title Banner */}
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedProjectForTrade(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10">
                  DECENTRALIZED CRYPTO LEDGER
                </span>
                <h3 className="text-lg font-bold font-display mt-2">
                  Initiate Secure Buying Proposal
                </h3>
                <p className="text-xs text-slate-400">
                  Transacting on virtual blockchain for transparent compliance validation.
                </p>
              </div>
            </div>

            {/* Modal Body & Trade details Form */}
            <form onSubmit={submitTradeProposal} className="p-6 space-y-5">
              {/* Selected project meta */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1 text-xs">
                <div className="text-slate-500">Project Reference:</div>
                <div className="font-bold text-slate-900 text-sm font-display">
                  {selectedProjectForTrade.name}
                </div>
                <div className="flex justify-between text-slate-500 mt-1">
                  <span>Location: {selectedProjectForTrade.location}, {selectedProjectForTrade.country}</span>
                  <span className="font-mono text-emerald-600 font-bold">
                    Price: {activeCurrency.symbol}{convertPrice(selectedProjectForTrade.pricePerCreditUSD).toFixed(2)} / tCO₂e
                  </span>
                </div>
              </div>

              {tradeExecutedSuccessfully ? (
                <div className="p-6 flex flex-col items-center justify-center space-y-3 text-center bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Trade Transmitted to Ledger Pool</h4>
                    <p className="text-xs text-slate-500">
                      Cryptographic confirmation complete. Block mining in process...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-100 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  {/* Buyer details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Industrialist/Buyer Information
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Authorized Signatory</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jean Dupont"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Company Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Global Logistics Inc."
                          value={buyerCompany}
                          onChange={(e) => setBuyerCompany(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Operating Country</label>
                        <select
                          value={buyerCountry}
                          onChange={(e) => setBuyerCountry(e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        >
                          {countriesList.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Purchase credits quantity */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                          <span>Credits to Purchase</span>
                          <span className="text-[9px] text-slate-400 font-normal">tCO₂e</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={selectedProjectForTrade.verifiedCredits - selectedProjectForTrade.soldCredits}
                          value={purchaseCredits}
                          onChange={(e) => setPurchaseCredits(Number(e.target.value))}
                          className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono font-bold text-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing transparency checkout calculations */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Total Credits Value:</span>
                      <span className="font-mono text-slate-800">
                        {activeCurrency.symbol}
                        {(convertPrice(selectedProjectForTrade.pricePerCreditUSD) * purchaseCredits).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCurrency}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Ledger Gas & Mining Fee:</span>
                      <span className="font-mono text-emerald-600">
                        FREE (Sponsored Ecosystem Node)
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-900 font-bold pt-1.5 border-t border-dashed border-slate-200">
                      <span>Total Secure Checkout:</span>
                      <span className="font-mono text-slate-950">
                        {activeCurrency.symbol}
                        {(convertPrice(selectedProjectForTrade.pricePerCreditUSD) * purchaseCredits).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCurrency}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectForTrade(null)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition"
                    >
                      Cancel Trade
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      Sign & Transmit Block
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
