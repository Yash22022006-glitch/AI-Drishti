import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Layers,
  Sliders,
  AlertTriangle,
  Waves,
  Navigation,
  ShieldCheck,
  Building,
  Hospital,
  School,
  X,
  RefreshCcw,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setSelectedZone,
  setSimulatedRainfall,
  resetSimulation,
} from '../../store/slices/riskSlice';
import {
  setRouteModalOpen,
  setExplainModalOpen,
  showToast,
} from '../../store/slices/uiSlice';

export const RiskMapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { zones, selectedZoneId, isSimulating, simulatedRainfallIncreasePercent } =
    useAppSelector((s) => s.risk);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  // Map layer toggles
  const [showRadar, setShowRadar] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showBlockedRoads, setShowBlockedRoads] = useState(true);
  const [showSimulationDrawer, setShowSimulationDrawer] = useState(false);

  return (
    <div className="w-full pb-20 select-none space-y-3">
      {/* Top Map Action Bar */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Compass className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>GIS Disaster Risk Matrix</span>
          </h3>
          <p className="text-[11px] text-neutral-500">
            Real-time multi-hazard telemetry (IMD + NWIC + GPM)
          </p>
        </div>

        {/* What-If Simulation Trigger Button */}
        <button
          id="toggle-simulation-btn"
          onClick={() => setShowSimulationDrawer(!showSimulationDrawer)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isSimulating
              ? 'bg-amber-500 text-white animate-pulse'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>What-If Engine</span>
        </button>
      </div>

      {/* Layer Pills */}
      <div className="px-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setShowRadar(!showRadar)}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
            showRadar
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          🌧️ Doppler Radar {showRadar ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
            showShelters
              ? 'bg-emerald-600 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          🏕️ Safe Shelters
        </button>
        <button
          onClick={() => setShowBlockedRoads(!showBlockedRoads)}
          className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
            showBlockedRoads
              ? 'bg-rose-600 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
          }`}
        >
          🚧 Submerged Points
        </button>
      </div>

      {/* What-If Simulation Drawer */}
      {showSimulationDrawer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mx-4 p-4 rounded-3xl border bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-neutral-900/10 border-amber-500/30 text-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Disaster Simulation Scenario</span>
            </div>
            <button
              onClick={() => {
                dispatch(resetSimulation());
                setShowSimulationDrawer(false);
              }}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>Rainfall Cloudburst Multiplier</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">
                +{simulatedRainfallIncreasePercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={simulatedRainfallIncreasePercent}
              onChange={(e) => dispatch(setSimulatedRainfall(Number(e.target.value)))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
              <span>Baseline NWIC</span>
              <span>+50% Torrential</span>
              <span>+100% 100-Yr Flood</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md text-[11px] text-neutral-200 flex items-center justify-between">
            <span>Recalculated Peak Population at Risk:</span>
            <span className="font-mono font-bold text-amber-400">
              {zones.reduce((acc, z) => acc + z.populationAtRisk, 0).toLocaleString()} Citizens
            </span>
          </div>
        </motion.div>
      )}

      {/* Interactive GIS Visual Map Canvas */}
      <div className="px-4">
        <div className="relative w-full h-80 rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-inner bg-slate-900">
          {/* Simulated Topographic and Hydro Map Vector Background */}
          <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 320">
            <defs>
              <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff08" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0b1329" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* River meandering channel */}
            <path
              d="M 50,-10 C 120,60 80,140 210,180 C 310,210 270,300 380,340"
              fill="none"
              stroke="url(#riverGrad)"
              strokeWidth="28"
              strokeLinecap="round"
              className={showRadar ? 'animate-pulse' : ''}
            />

            {/* Inundated flood boundary polygons */}
            <path
              d="M 120,110 Q 180,130 220,170 Q 180,210 130,180 Z"
              fill="#e11d48"
              fillOpacity={isSimulating ? '0.45' : '0.28'}
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <path
              d="M 230,190 Q 290,210 320,250 Q 270,280 230,240 Z"
              fill="#f97316"
              fillOpacity="0.25"
              stroke="#fb923c"
              strokeWidth="2"
            />

            {/* Safe Evacuation Route line (green path avoiding inundated zone) */}
            <path
              d="M 90,220 L 110,250 L 180,270 L 260,285"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Map Overlay Markers */}
          {/* Zone 1 Marker (Yamuna Critical) */}
          <div
            onClick={() => dispatch(setSelectedZone('zone-yamuna-sec4'))}
            className="absolute top-28 left-36 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div className="relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-lg border-2 border-white ${
                  selectedZoneId === 'zone-yamuna-sec4'
                    ? 'bg-rose-600 text-white ring-4 ring-rose-500/30'
                    : 'bg-rose-500 text-white'
                }`}
              >
                87%
              </div>
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded shadow">
              Yamuna Sec 4
            </span>
          </div>

          {/* Zone 2 Marker (Assam Kaziranga) */}
          <div
            onClick={() => dispatch(setSelectedZone('zone-brahmaputra-kaz'))}
            className="absolute top-44 right-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-[11px] shadow-lg border-2 border-white ${
                selectedZoneId === 'zone-brahmaputra-kaz'
                  ? 'bg-orange-600 text-white ring-4 ring-orange-500/30'
                  : 'bg-orange-500 text-white'
              }`}
            >
              78%
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-white bg-black/70 px-1.5 py-0.5 rounded shadow">
              Kaziranga
            </span>
          </div>

          {/* Submerged Road Marker */}
          {showBlockedRoads && (
            <div className="absolute top-20 left-24 p-1 rounded-full bg-rose-600 text-white border border-white shadow animate-bounce">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Safe Shelter Marker */}
          {showShelters && (
            <div
              onClick={() => dispatch(setRouteModalOpen(true))}
              className="absolute bottom-6 right-28 p-1.5 rounded-full bg-emerald-600 text-white border border-white shadow cursor-pointer hover:scale-110 transition"
              title="Mayur Vihar Safe Relief Shelter"
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}

          {/* Map Compass HUD */}
          <div className="absolute bottom-3 left-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white text-[10px] space-y-0.5 border border-white/10 font-mono">
            <div>GIS Coord: 28.6289° N, 77.2785° E</div>
            <div className="text-emerald-400">● Safe Evacuation Corridor Active</div>
          </div>
        </div>
      </div>

      {/* Selected Zone Card Sheet */}
      <div className="px-4 space-y-3">
        <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    selectedZone.severity === 'CRITICAL'
                      ? 'bg-rose-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {selectedZone.severity} RISK
                </span>
                <span className="text-xs text-neutral-500">{selectedZone.lastUpdated}</span>
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                {selectedZone.name}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                {selectedZone.riskScore}%
              </span>
              <span className="block text-[10px] text-neutral-400">Model Probability</span>
            </div>
          </div>

          {/* Physical Environmental Factors */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-medium">River Water Level</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                {selectedZone.riverLevel}m
              </span>
              <span className="text-[10px] text-rose-500 font-semibold block">
                +{(selectedZone.riverLevel - selectedZone.dangerLevel).toFixed(2)}m Above Danger
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 block font-medium">Soil Runoff Saturation</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                {selectedZone.soilMoistureSaturation}%
              </span>
              <span className="text-[10px] text-amber-500 font-semibold block">
                Zero Absorption Capacity
              </span>
            </div>
          </div>

          {/* Infrastructure at risk */}
          <div className="flex items-center justify-between text-center p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 text-xs border border-neutral-100 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block font-mono">
                {selectedZone.criticalInfrastructure.hospitals}
              </span>
              <span className="text-[10px]">Hospitals</span>
            </div>
            <div>
              <span className="font-bold text-neutral-900 dark:text-neutral-100 block font-mono">
                {selectedZone.criticalInfrastructure.schools}
              </span>
              <span className="text-[10px]">Schools</span>
            </div>
            <div>
              <span className="font-bold text-rose-500 block font-mono">
                {selectedZone.criticalInfrastructure.bridgesBlocked}
              </span>
              <span className="text-[10px]">Bridges Cut</span>
            </div>
            <div>
              <span className="font-bold text-emerald-500 block font-mono">
                {selectedZone.criticalInfrastructure.sheltersActive}
              </span>
              <span className="text-[10px]">Shelters</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              id="map-safe-route-btn"
              onClick={() => dispatch(setRouteModalOpen(true))}
              className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Safe Evacuation Route</span>
            </button>
            <button
              id="map-explain-ai-btn"
              onClick={() => dispatch(setExplainModalOpen(true))}
              className="py-2.5 px-3.5 rounded-xl font-semibold text-xs border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 active:scale-95 transition"
            >
              Explain AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
