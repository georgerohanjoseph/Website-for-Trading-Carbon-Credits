import React, { useState, useEffect } from 'react';
import { CarbonProject } from '../types';
import { Leaf, Radio, Thermometer, Droplets, MapPin, Globe, Cpu, AlertCircle, RefreshCw } from 'lucide-react';

interface TelemetryDashboardProps {
  projects: CarbonProject[];
  selectedProject: CarbonProject | null;
  onSelectProject: (project: CarbonProject) => void;
}

export default function TelemetryDashboard({
  projects,
  selectedProject,
  onSelectProject,
}: TelemetryDashboardProps) {
  const activeProj = selectedProject || projects[0] || null;
  
  // Real-time globally sequestrated CO2 offsets counter (simulated ticking)
  const [globalSequestration, setGlobalSequestration] = useState(1458920.450);
  
  // Local telemetry state updates to simulate sensor fluctuations
  const [liveReading, setLiveReading] = useState(activeProj ? activeProj.sequestrationRate : 0);
  const [sensorHealth, setSensorHealth] = useState(99.4);
  const [temp, setTemp] = useState(24.5);
  const [humidity, setHumidity] = useState(72.0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Total sequestration calculation sum rate
  const totalHourlyRate = projects.reduce((acc, p) => acc + p.sequestrationRate, 0);
  const perSecondRate = totalHourlyRate / 3600; // tCO2e per second

  useEffect(() => {
    // Tick every 100ms for high-precision decimal loading
    const interval = setInterval(() => {
      setGlobalSequestration(prev => prev + (perSecondRate * 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [perSecondRate]);

  // Handle active project changes
  useEffect(() => {
    if (activeProj) {
      setLiveReading(activeProj.sequestrationRate);
      // Generate some stable random values based on latitude/country
      const baseSeed = activeProj.latitude + activeProj.longitude;
      setTemp(Number((20 + Math.abs(baseSeed % 15)).toFixed(1)));
      setHumidity(Number((60 + Math.abs(baseSeed % 30)).toFixed(1)));
      setSensorHealth(Number((98 + Math.abs(baseSeed % 2)).toFixed(1)));
    }
  }, [activeProj]);

  // Simulate an interactive sensor "ping" to refresh logs
  const handlePingSensors = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      if (activeProj) {
        setLiveReading(Number((activeProj.sequestrationRate + (Math.random() * 2 - 1)).toFixed(2)));
        setTemp(prev => Number((prev + (Math.random() * 0.6 - 0.3)).toFixed(1)));
        setHumidity(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
        setSensorHealth(Number((97.5 + Math.random() * 2).toFixed(1)));
      }
    }, 800);
  };

  // Safe coordinate normalization for the simple static World Radar map
  const getMapCoordinates = (lat: number, lon: number) => {
    // Simple projection from lat [-90, 90] and lon [-180, 180] to [0%, 100%]
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  // Generate coordinates for the SVG Telemetry Chart
  const svgWidth = 500;
  const svgHeight = 120;
  const points = activeProj
    ? activeProj.telemetryLogs.map((log, index) => {
        const x = (index / (activeProj.telemetryLogs.length - 1)) * (svgWidth - 40) + 20;
        // Normalize readings [10, 80]
        const y = svgHeight - ((log.reading - 10) / 70) * (svgHeight - 30) - 15;
        return { x, y, ...log };
      })
    : [];

  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPointsString = points.length ? `20,${svgHeight - 10} ${pointsString} ${points[points.length - 1].x},${svgHeight - 10}` : '';

  return (
    <div className="space-y-6">
      {/* Top Banner Ticker with visual counter */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Globe className="w-48 h-48 animate-spin-slow text-emerald-400" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Global Sequestration Satellite Ticker
            </div>
            <h2 className="text-3xl font-bold font-display text-white mt-1">
              {globalSequestration.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tons of equivalent CO₂ (tCO₂e) sequestrated in real-time since platform genesis block.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Combined Live Rate</div>
              <div className="text-lg font-bold font-display text-emerald-400">
                +{totalHourlyRate.toFixed(1)} tCO₂e / hour
              </div>
              <div className="text-xs text-slate-500">From {projects.length} connected reserves</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry map & detail cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Dynamic list of connected nodes */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-display">
              Sensor Nodes Network
            </h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              {projects.length} Online
            </span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {projects.map((p) => {
              const isActive = activeProj && activeProj.id === p.id;
              return (
                <button
                  key={p.id}
                  id={`node-btn-${p.id}`}
                  onClick={() => onSelectProject(p)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-center justify-between group ${
                    isActive
                      ? 'bg-slate-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500/10'
                      : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400 group-hover:bg-emerald-400'}`}></span>
                      {p.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.location}, {p.country}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-600 font-mono">
                      {p.sequestrationRate} t/hr
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {p.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Project details and telemetry feedback */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between space-y-6">
          {activeProj ? (
            <>
              {/* Header metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100 uppercase">
                      {activeProj.type} PROJECT
                    </span>
                    <span className="text-xs text-slate-500 font-mono">ID: {activeProj.id}</span>
                  </div>
                  <h3 className="text-xl font-bold font-display text-slate-950 mt-1">{activeProj.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Managed by <strong className="text-slate-700 font-medium">{activeProj.ownerName}</strong> ({activeProj.ownerType}) &bull; {activeProj.location}, {activeProj.country}
                  </p>
                </div>

                <button
                  id="ping-sensor-btn"
                  onClick={handlePingSensors}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium transition duration-200 self-start disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Synchronizing Recalculation...' : 'Ping Live Telemetry Node'}
                </button>
              </div>

              {/* Status and telemetry logs values */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    Live Capture
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600 font-display">
                    {liveReading.toFixed(2)}
                    <span className="text-[10px] text-slate-500 font-normal ml-1">tCO₂e/hr</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Satellite calculated telemetry</div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    Temperature
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800">
                    {temp}°C
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Sensors calibrated locally</div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    Humidity
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-800">
                    {humidity}%
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Relative canopy moisture</div>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-semibold flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    Node Integrity
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-600">
                    {sensorHealth}%
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Consensus check online</div>
                </div>
              </div>

              {/* Graphic Plot Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Absorption Sequestration History (24-Hour Telemetry)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Verified in Blocks Daily</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 relative h-36 flex items-end">
                  <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2={svgWidth} y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="60" x2={svgWidth} y2="60" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
                    <line x1="0" y1="90" x2={svgWidth} y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />

                    {/* Polygon Area */}
                    {points.length > 0 && (
                      <polygon points={areaPointsString} fill="url(#chartGradient)" />
                    )}

                    {/* Line Chart */}
                    {points.length > 0 && (
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        points={pointsString}
                      />
                    )}

                    {/* Nodes and Dots */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                        <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="600" fontFamily="monospace">
                          {p.reading} t/hr
                        </text>
                        <text x={p.x} y={svgHeight - 1} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="500">
                          {p.timestamp}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Geographic Micro Map projection */}
              <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 relative">
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  International Sequestration Network Positioning
                </div>
                
                <div className="h-28 bg-slate-200/60 rounded-lg relative overflow-hidden flex items-center justify-center">
                  {/* Styled Minimal grid background to look like a telemetry overlay map */}
                  <div className="absolute inset-0 bg-grid-slate-200" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }} />
                  
                  {/* Simulated equator and central grid */}
                  <div className="absolute left-0 right-0 h-px bg-slate-300/40 top-1/2" />
                  <div className="absolute top-0 bottom-0 w-px bg-slate-300/40 left-1/2" />

                  {/* World labels */}
                  <div className="absolute left-4 top-2 text-[8px] text-slate-400 font-mono uppercase">North West</div>
                  <div className="absolute right-4 top-2 text-[8px] text-slate-400 font-mono uppercase">North East</div>
                  <div className="absolute left-4 bottom-2 text-[8px] text-slate-400 font-mono uppercase">South West</div>
                  <div className="absolute right-4 bottom-2 text-[8px] text-slate-400 font-mono uppercase">South East</div>

                  {/* Render active telemetry indicators */}
                  {projects.map((p) => {
                    const isSelected = activeProj && p.id === activeProj.id;
                    const coords = getMapCoordinates(p.latitude, p.longitude);
                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectProject(p)}
                        className="absolute cursor-pointer transition-all duration-300"
                        style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                      >
                        {/* Ping rings */}
                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                          <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-40 -left-2.5 -top-2.5 ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-slate-400 opacity-20'}`}></span>
                          <div className={`w-3 h-3 rounded-full border border-white flex items-center justify-center shadow-sm ${isSelected ? 'bg-emerald-600 scale-125 z-20' : 'bg-slate-600 hover:bg-emerald-500'}`} />
                        </div>
                        {/* Hover tag description */}
                        {isSelected && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-semibold font-mono text-[9px] px-2 py-0.5 rounded shadow whitespace-nowrap z-50">
                            {p.country}: {p.sequestrationRate} t/hr
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-slate-400">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm">Please select a sensor node network to inspect telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
