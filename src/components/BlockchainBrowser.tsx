import React, { useState } from 'react';
import { Block, Transaction } from '../types';
import { calculateBlockHash } from '../initialData';
import { 
  Database, ShieldCheck, ShieldAlert, Cpu, 
  Layers, HardDrive, RefreshCw, Eye, EyeOff, Play, History, Signature, Flame, ArrowUpCircle
} from 'lucide-react';

interface BlockchainBrowserProps {
  blocks: Block[];
  onResetChain: () => void;
  onTamperBlock: (blockIndex: number, txIndex: number, newCredits: number) => void;
}

export default function BlockchainBrowser({ blocks, onResetChain, onTamperBlock }: BlockchainBrowserProps) {
  const [activeExpandedBlock, setActiveExpandedBlock] = useState<number | null>(null);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [auditedIndex, setAuditedIndex] = useState<number>(-1);
  const [auditResultMsg, setAuditResultMsg] = useState('');
  const [failedBlockIndex, setFailedBlockIndex] = useState<number | null>(null);

  // Run the full validation scanning engine
  const handleRunConsensusAudit = () => {
    setAuditStatus('scanning');
    setAuditedIndex(-1);
    setFailedBlockIndex(null);
    setAuditResultMsg('Initializing peer consensus validation checks...');

    // Stagger block validation to make the scan visually satisfying
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= blocks.length) {
        clearInterval(interval);
        
        // Final audit check
        let chainIsPerfect = true;
        let brokenIndex = -1;

        for (let i = 0; i < blocks.length; i++) {
          const currentBlock = blocks[i];
          
          // 1. Recalculate block's own hash from its contents
          const calculatedThisHash = calculateBlockHash(
            currentBlock.index,
            currentBlock.previousHash,
            currentBlock.timestamp,
            currentBlock.transactions,
            currentBlock.nonce
          );

          if (calculatedThisHash !== currentBlock.hash) {
            chainIsPerfect = false;
            brokenIndex = i;
            break;
          }

          // 2. Compare previousHash to preceding block's hash
          if (i > 0) {
            const prevBlock = blocks[i - 1];
            if (currentBlock.previousHash !== prevBlock.hash) {
              chainIsPerfect = false;
              brokenIndex = i;
              break;
            }
          }
        }

        if (chainIsPerfect) {
          setAuditStatus('success');
          setAuditResultMsg('Consensus Verified! Cryptographic signatures and double-hashing links match across all 15 peer validators. Ledger is 100% secure.');
        } else {
          setAuditStatus('failed');
          setFailedBlockIndex(brokenIndex);
          setAuditResultMsg(`INTEGRITY BREACH DETECTED: Cryptographic mismatch at Block #${brokenIndex}! Calculated Hash does not chain with previous nodes. Consensus automatically rejected and quarantined.`);
        }
        return;
      }

      setAuditedIndex(currentIndex);
      setAuditResultMsg(`Auditing block #${currentIndex} hash, nonce and signatures...`);
      currentIndex++;
    }, 400);
  };

  // Trigger a simulated hack on Block 1/2
  const handleTriggerTamperMock = (blockIndex: number) => {
    if (blocks.length <= blockIndex) return;
    const targetBlock = blocks[blockIndex];
    if (targetBlock.transactions.length === 0) return;

    // Change credits purchased to 99,999 tCO2e to simulate massive value fraud
    onTamperBlock(blockIndex, 0, 99999);
    setAuditStatus('idle'); // reset audit state so they can scan
    setAuditResultMsg(`CRITICAL ALERT: Block #${blockIndex} transaction quantities mutated inside memory! Cryptographic chain links are now orphaned. Execute a peer audit to witness detection.`);
  };

  const toggleExpandBlock = (index: number) => {
    setActiveExpandedBlock(activeExpandedBlock === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Consensus Control Panel & Auditing dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold font-display text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Decentralized Peer Consensus & Audit Node
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Every carbon purchase is cryptographically signed and compiled into self-linked blockchain blocks. Below, run ledger consensus audits in real-time or simulate network security attacks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="consensus-audit-btn"
              onClick={handleRunConsensusAudit}
              disabled={auditStatus === 'scanning'}
              className="px-4.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow disabled:opacity-50"
            >
              <Cpu className="w-3.5 h-3.5" />
              {auditStatus === 'scanning' ? 'Auditing Ledger...' : 'Run Consensus Audit'}
            </button>

            <button
              id="consensus-reset-btn"
              onClick={onResetChain}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Synchronize/Self-Heal Chain
            </button>
          </div>
        </div>

        {/* Dynamic Audit Scan results banner */}
        {auditStatus !== 'idle' && (
          <div className={`mt-5 p-4 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
            auditStatus === 'scanning'
              ? 'bg-slate-800/60 border-indigo-500/30 text-indigo-200'
              : auditStatus === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
          }`}>
            <div className="shrink-0 pt-0.5">
              {auditStatus === 'scanning' && <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />}
              {auditStatus === 'success' && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
              {auditStatus === 'failed' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
            </div>
            
            <div className="space-y-1 w-full text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider">
                  {auditStatus === 'scanning' ? `SCAN IN PROGRESS (Block ${auditedIndex + 1}/${blocks.length})` : `AUDIT RESOLVED`}
                </span>
                <span className="font-mono text-[10px]">Validator Node: Peer_ID_749b</span>
              </div>
              <p className="font-mono text-[11px] leading-relaxed">{auditResultMsg}</p>
              
              {/* Micro audit scan progress indicators */}
              {auditStatus === 'scanning' && (
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${((auditedIndex + 1) / blocks.length) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cyber Attack Simulation Sandbox */}
      <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-display">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              Platform Cyber Range & Tampering Sandbox
            </h4>
            <p className="text-[11px] text-slate-500">
              Inject rogue mutations into block transactions to see how cryptographic links shatter instantly inside peer audits.
            </p>
          </div>

          <div className="flex gap-2">
            {blocks.map((block) => (
              block.index > 0 && (
                <button
                  key={block.index}
                  id={`tamper-bt-${block.index}`}
                  onClick={() => handleTriggerTamperMock(block.index)}
                  className="px-3 py-1.5 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Flame className="w-3.5 h-3.5" />
                  Tamper Block #{block.index}
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* The Visual Block Chain List representation */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Transparent Ledger Timeline ({blocks.length} Blocks)
        </h4>

        <div className="space-y-5">
          {blocks.map((block, bIdx) => {
            const isExpanded = activeExpandedBlock === block.index;
            const isAuditedAndLegit = auditStatus === 'success' || (auditStatus === 'scanning' && auditedIndex >= block.index);
            const isAuditedAndSpurious = failedBlockIndex !== null && block.index >= failedBlockIndex;
            
            // Re-calculate hash to see if this individual block has been modified
            const recalculateCheck = calculateBlockHash(
              block.index,
              block.previousHash,
              block.timestamp,
              block.transactions,
              block.nonce
            );
            const isBlockTampered = recalculateCheck !== block.hash;

            return (
              <div key={block.index} className="relative">
                {/* Visual linking spine connector to preceding block */}
                {bIdx > 0 && (
                  <div className="absolute left-6 -top-5 bottom-full w-0.5 bg-slate-200 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isAuditedAndSpurious ? 'bg-rose-100 border-rose-400 text-rose-500' : 'bg-emerald-50 border-emerald-400 text-emerald-500'}`}>
                      <Layers className="w-2 h-2" />
                    </div>
                  </div>
                )}

                <div 
                  id={`block-card-${block.index}`}
                  className={`bg-white rounded-xl border transition-all duration-300 shadow-sm ${
                    isBlockTampered 
                      ? 'border-rose-400 bg-rose-50/20 shadow-rose-100' 
                      : isAuditedAndSpurious 
                      ? 'border-yellow-400 bg-yellow-50/10'
                      : 'border-slate-200/90 hover:border-slate-350 bg-white'
                  }`}
                >
                  {/* Block Header summary bar */}
                  <div className="p-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg shrink-0 ${
                        isBlockTampered 
                          ? 'bg-rose-100 text-rose-700' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        <HardDrive className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
                          Block #{block.index} 
                          {block.index === 0 && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 rounded uppercase border border-indigo-100">
                              Genesis Block
                            </span>
                          )}
                          {isBlockTampered && (
                            <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 rounded uppercase flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              Modified / Orphaned
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Timestamp: {new Date(block.timestamp).toLocaleString()}</span>
                          <span>&bull;</span>
                          <span>Nonce: <strong className="font-mono text-slate-800">{block.nonce}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Current active block Hash shortened representation */}
                      <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Block Hash</div>
                        <div className={`text-xs font-mono font-bold truncate max-w-[180px] ${
                          isBlockTampered ? 'text-rose-600' : 'text-slate-700'
                        }`}>
                          {block.hash}
                        </div>
                      </div>

                      <button
                        id={`expand-block-btn-${block.index}`}
                        onClick={() => toggleExpandBlock(block.index)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition shrink-0"
                        title={isExpanded ? 'Hide ledger details' : 'Inspect ledger details'}
                      >
                        {isExpanded ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Block Transactions detailed viewport */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-150 p-5 space-y-4 rounded-b-xl animate-fade-in text-xs">
                      {/* Cryptographic Metadata table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 font-mono p-3.5 bg-white rounded-lg border border-slate-200">
                        <div className="space-y-1">
                          <span className="text-slate-400 uppercase text-[9px] font-bold block">Previous Block Hash</span>
                          <span className="text-slate-700 break-all text-[11px]">
                            {block.previousHash}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-slate-400 uppercase text-[9px] font-bold block">Current Cryptographic Hash</span>
                          <span className={`break-all text-[11px] ${isBlockTampered ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-bold'}`}>
                            {block.hash}
                          </span>
                          {isBlockTampered && (
                            <span className="text-[10px] text-rose-500 block font-normal mt-1 leading-relaxed">
                              * Does not match recalculation: <code className="break-all font-bold">{recalculateCheck}</code>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Header log */}
                      <div className="space-y-2">
                        <h5 className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
                          Compiled Transactions Log ({block.transactions.length})
                        </h5>

                        <div className="space-y-3">
                          {block.transactions.map((tx, txIdx) => (
                            <div 
                              key={tx.id || txIdx}
                              className={`p-4 rounded-lg bg-white border flex flex-col md:flex-row justify-between gap-4 transition ${
                                isBlockTampered ? 'border-rose-100 bg-rose-50/10' : 'border-slate-150'
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-bold">
                                    ID: {tx.id}
                                  </span>
                                  <span className="text-slate-400 text-[10px]">&bull;</span>
                                  <span className="text-slate-700 font-medium">Project: {tx.projectName}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-600">
                                  <div>
                                    <strong className="text-slate-800 font-medium">Buyer:</strong> {tx.buyerCompany} ({tx.buyerName}) &bull; {tx.buyerCountry}
                                  </div>
                                  <div>
                                    <strong className="text-slate-800 font-medium">Seller/Farmer:</strong> {tx.sellerName}
                                  </div>
                                </div>
                              </div>

                              <div className="md:text-right flex flex-row md:flex-col justify-between items-end gap-1.5">
                                <div className="text-right">
                                  <span className="text-slate-500 text-[10px] block font-bold uppercase">Volume & Cost</span>
                                  <div className="text-sm font-bold text-slate-900 font-mono">
                                    {tx.credits.toLocaleString()} tCO₂e 
                                  </div>
                                  <span className="text-[11px] font-mono text-emerald-600 font-semibold block">
                                    @ {tx.currency} {tx.pricePerCredit.toLocaleString()} &bull; Total: {tx.currency === 'USD' ? '$' : ''}{tx.totalAmount.toLocaleString()} {tx.currency}
                                  </span>
                                </div>

                                {/* Mock Cryptographic Signature seal */}
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                  <Signature className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-[9px] font-mono text-slate-500 max-w-[80px] truncate">
                                    {tx.signature}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
