import React, { useState, useEffect } from 'react';
import { CarbonProject, Block, Transaction, Currency } from './types';
import { INITIAL_PROJECTS, getPreminedBlocks, calculateBlockHash, CURRENCY_LIST } from './initialData';
import TelemetryDashboard from './components/TelemetryDashboard';
import Marketplace from './components/Marketplace';
import BlockchainBrowser from './components/BlockchainBrowser';
import CompanyCalculator from './components/CompanyCalculator';
import FarmerListingForm from './components/FarmerListingForm';
import { 
  Leaf, Layers, Calculator, PlusCircle, Radio, 
  HelpCircle, Database, Lock, Menu, X, Landmark, Compass, Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'market' | 'blockchain' | 'calculator' | 'register'>('dashboard');
  
  // State initialization loading from LocalStorage for durable local persistence
  const [projects, setProjects] = useState<CarbonProject[]>(() => {
    const saved = localStorage.getItem('gcc_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem('gcc_blocks');
    return saved ? JSON.parse(saved) : getPreminedBlocks();
  });

  const [selectedProject, setSelectedProject] = useState<CarbonProject | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync state with LocalStorage for flawless reload persistence
  useEffect(() => {
    localStorage.setItem('gcc_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('gcc_blocks', JSON.stringify(blocks));
  }, [blocks]);

  // Execute buy trade & Append mine block to the blockchain
  const handleExecuteTrade = ({
    projectId,
    buyerName,
    buyerCompany,
    buyerCountry,
    credits,
    currency,
  }: {
    projectId: string;
    buyerName: string;
    buyerCompany: string;
    buyerCountry: string;
    credits: number;
    currency: Currency;
  }) => {
    // 1. Locate the seller carbon project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    
    const project = projects[projectIndex];
    if (project.verifiedCredits - project.soldCredits < credits) return;

    // 2. Compute prices and exchange rate values
    const currentCurrencyDetails = CURRENCY_LIST.find(c => c.code === currency) || CURRENCY_LIST[0];
    const convertedUnitPrice = project.pricePerCreditUSD * currentCurrencyDetails.rateToUSD;
    const totalAmount = convertedUnitPrice * credits;

    // 3. Construct the cryptographic transaction receipt
    const txId = `tx-${Math.random().toString(36).substring(2, 9)}`;
    const signature = `sha256_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}_signed_by_nodes`;

    const newTransaction: Transaction = {
      id: txId,
      sellerId: project.id,
      sellerName: project.name,
      buyerName,
      buyerCompany,
      buyerCountry,
      credits,
      currency,
      pricePerCredit: Number(convertedUnitPrice.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      projectName: project.name,
      timestamp: new Date().toISOString(),
      signature,
    };

    // 4. Record sold credits internally to the listing
    const updatedProjects = [...projects];
    updatedProjects[projectIndex] = {
      ...project,
      soldCredits: project.soldCredits + credits,
    };
    setProjects(updatedProjects);

    // 5. Build, Mine and Link the next block
    const prevBlock = blocks[blocks.length - 1];
    const index = blocks.length;
    const timestamp = new Date().toISOString();
    const previousHash = prevBlock.hash;
    const nonce = Math.floor(Math.random() * 25000) + 1200; // random mining nonce value
    
    const blockHash = calculateBlockHash(
      index,
      previousHash,
      timestamp,
      [newTransaction],
      nonce
    );

    const newBlock: Block = {
      index,
      timestamp,
      transactions: [newTransaction],
      previousHash,
      hash: blockHash,
      nonce,
    };

    setBlocks(prev => [...prev, newBlock]);
  };

  // Add a newly registered Farmer / Natural Reserve project listing
  const handleAddNewProject = (newProj: Omit<CarbonProject, 'id' | 'soldCredits' | 'telemetryLogs'>) => {
    const id = `proj-${(projects.length + 1).toString().padStart(2, '0')}`;
    
    // Seed initial telemetry log values
    const telemetryLogs = [
      { timestamp: '08:00', reading: newProj.sequestrationRate, status: 'Active' as const },
      { timestamp: '09:00', reading: newProj.sequestrationRate + 0.1, status: 'Active' as const },
      { timestamp: '10:00', reading: newProj.sequestrationRate - 0.2, status: 'Active' as const },
      { timestamp: '11:00', reading: newProj.sequestrationRate, status: 'Optimal' as const }
    ];

    const completedProject: CarbonProject = {
      ...newProj,
      id,
      soldCredits: 0,
      telemetryLogs,
    };

    setProjects(prev => [completedProject, ...prev]);
  };

  // Simulate a hacking event in memory (for ledger transparent security audits)
  const handleTamperBlock = (blockIndex: number, txIndex: number, newCredits: number) => {
    if (blocks.length <= blockIndex) return;

    const modifiedBlocks = [...blocks];
    const targetBlock = { ...modifiedBlocks[blockIndex] };
    const targetTxs = [...targetBlock.transactions];
    
    if (targetTxs.length > txIndex) {
      targetTxs[txIndex] = {
        ...targetTxs[txIndex],
        credits: newCredits,
        totalAmount: targetTxs[txIndex].pricePerCredit * newCredits,
      };
      
      targetBlock.transactions = targetTxs;
      // We explicitly leave targetBlock.hash intact to check if next blocks' prevHash mismatches!
      modifiedBlocks[blockIndex] = targetBlock;
      setBlocks(modifiedBlocks);
    }
  };

  // Reset or Consensus Self-Heal the blockchain registry
  const handleResetChain = () => {
    localStorage.removeItem('gcc_projects');
    localStorage.removeItem('gcc_blocks');
    setProjects(INITIAL_PROJECTS);
    setBlocks(getPreminedBlocks());
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-100 italic-none">
      
      {/* Platform Upper Navigation Header block */}
      <header id="platform-master-header" className="bg-slate-900 text-white shadow-md sticky top-0 z-40 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Visual Brand Logo details */}
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black relative overflow-hidden group">
                <span className="absolute inset-0 bg-emerald-400 rotate-45 scale-75 group-hover:scale-110 transition duration-300" />
                <Leaf className="w-5.5 h-5.5 text-slate-950 relative z-10" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-sm font-black font-display tracking-tight text-white uppercase flex items-center gap-1">
                  Global Carbon Credit Registry
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 px-1 py-0.5 rounded font-normal uppercase normal-case">
                    vLedger
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                  DECENTRALIZED CROSS-BORDER TRADING COMPLIANCE
                </p>
              </div>
            </div>

            {/* Desktop Nav Actions */}
            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
              <button
                id="tab-dashboard"
                onClick={() => { setActiveTab('dashboard'); setSelectedProject(null); }}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wide cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-350 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Telemetry Dashboard
              </button>

              <button
                id="tab-market"
                onClick={() => setActiveTab('market')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wide cursor-pointer ${
                  activeTab === 'market'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-350 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Trade Exchange
              </button>

              <button
                id="tab-blockchain"
                onClick={() => setActiveTab('blockchain')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wide cursor-pointer ${
                  activeTab === 'blockchain'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-350 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Blockchain Ledger
              </button>

              <button
                id="tab-calculator"
                onClick={() => setActiveTab('calculator')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 uppercase tracking-wide cursor-pointer ${
                  activeTab === 'calculator'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-350 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Footprint Profiler
              </button>

              <button
                id="tab-register"
                onClick={() => setActiveTab('register')}
                className={`px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition shadow flex items-center gap-1 cursor-pointer`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
                List Reserve
              </button>
            </nav>

            {/* Mobile Nav Menu Toggler */}
            <div className="lg:hidden flex items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white focus:outline-none p-1.5 rounded border border-slate-700"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Panels */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1 text-xs">
            <button
              onClick={() => { setActiveTab('dashboard'); setSelectedProject(null); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2 uppercase font-medium"
            >
              <Radio className="w-4 h-4 text-emerald-400" />
              Telemetry Sensors Dashboard
            </button>
            <button
              onClick={() => { setActiveTab('market'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2 uppercase font-medium"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Ecosystem Trade Exchange
            </button>
            <button
              onClick={() => { setActiveTab('blockchain'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2 uppercase font-medium"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Cryptographic Blockchain Ledger
            </button>
            <button
              onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2 uppercase font-medium"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              Industrialist Carbon Calculator
            </button>
            <button
              onClick={() => { setActiveTab('register'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 bg-emerald-600 text-slate-950 rounded flex items-center gap-2 uppercase font-bold text-center justify-center shadow"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              Register Farmer Reserve Project
            </button>
          </div>
        )}
      </header>

      {/* Primary Interactive Route viewport */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <TelemetryDashboard
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
          />
        )}

        {activeTab === 'market' && (
          <Marketplace
            projects={projects}
            onExecuteTrade={handleExecuteTrade}
          />
        )}

        {activeTab === 'blockchain' && (
          <BlockchainBrowser
            blocks={blocks}
            onResetChain={handleResetChain}
            onTamperBlock={handleTamperBlock}
          />
        )}

        {activeTab === 'calculator' && (
          <CompanyCalculator
            onOffsetRequiredCalculated={(cred) => {
              // Optionally trigger navigation or helper metrics
              setActiveTab('market');
            }}
            onNavigateToMarket={() => setActiveTab('market')}
          />
        )}

        {activeTab === 'register' && (
          <FarmerListingForm
            onAddProject={handleAddNewProject}
            onSuccessNavigate={() => setActiveTab('market')}
          />
        )}
      </main>

      {/* Elegant Standard Audit compliance footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audited & verified compliance in compliance with Paris Agreement offset guidelines.</span>
          </div>
          <div className="flex items-center gap-4.5 font-mono text-[10px]">
            <span>Active Blocks: <strong className="text-slate-800">{blocks.length}</strong></span>
            <span>Connected Nodes: <strong className="text-slate-800">15 Operational</strong></span>
            <span>Consensus State: <strong className="text-emerald-600 font-bold">Consubstantiation Secured</strong></span>
          </div>
        </div>
      </footer>

    </div>
  );
}
