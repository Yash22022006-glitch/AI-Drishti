import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Waves, AlertTriangle, ShieldCheck, Navigation, ChevronRight, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDynamicIslandExpanded, setRouteModalOpen, setExplainModalOpen } from '../store/slices/uiSlice';

export const DynamicIslandAlert: React.FC = () => {
  const dispatch = useAppDispatch();
  const isExpanded = useAppSelector((s) => s.ui.dynamicIslandExpanded);
  const zones = useAppSelector((s) => s.risk.zones);
  const criticalZone = zones.find((z) => z.severity === 'CRITICAL') || zones[0];

  return (
    <div className="relative flex justify-center w-full z-50 pointer-events-auto">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className={`bg-black text-white rounded-[28px] overflow-hidden shadow-2xl border border-white/10 ${
          isExpanded ? 'w-[94%] max-w-[370px] p-3.5 mt-1' : 'w-[124px] h-[32px] px-3 flex items-center justify-between mt-1 cursor-pointer'
        }`}
        onClick={() => {
          if (!isExpanded) {
            dispatch(setDynamicIslandExpanded(true));
          }
        }}
      >
        {!isExpanded ? (
          /* Collapsed Pill state */
          <div className="flex items-center justify-between w-full select-none">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Waves className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-rose-300 tracking-tight">
              <span>{criticalZone.riskScore}%</span>
            </div>
          </div>
        ) : (
          /* Expanded Island state */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-2.5 select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-rose-500/20 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight tracking-wide text-rose-400 uppercase">
                    Critical Flood Warning
                  </h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-1">
                    {criticalZone.name}
                  </p>
                </div>
              </div>
              <button
                id="close-dynamic-island-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setDynamicIslandExpanded(false));
                }}
                className="p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-1.5 py-1 text-center bg-white/5 rounded-xl p-2 border border-white/5">
              <div>
                <span className="text-[10px] text-neutral-400 block">River Level</span>
                <span className="text-xs font-bold text-rose-300 font-mono">
                  {criticalZone.riverLevel}m
                </span>
                <span className="text-[9px] text-neutral-500 block">Danger: {criticalZone.dangerLevel}m</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-[10px] text-neutral-400 block">Runoff Risk</span>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {criticalZone.riskScore}%
                </span>
                <span className="text-[9px] text-amber-500/90 block">Peak In 3.8h</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">24h Rainfall</span>
                <span className="text-xs font-bold text-sky-300 font-mono">
                  {criticalZone.rainfall24h} mm
                </span>
                <span className="text-[9px] text-sky-500/90 block">Cloudburst</span>
              </div>
            </div>

            {/* Quick Actions inside Dynamic Island */}
            <div className="flex items-center gap-2 pt-0.5">
              <button
                id="dynamic-island-evac-route-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setDynamicIslandExpanded(false));
                  dispatch(setRouteModalOpen(true));
                }}
                className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-medium text-xs py-1.5 px-2.5 rounded-lg transition shadow-md shadow-rose-950/40"
              >
                <Navigation className="w-3 h-3" />
                <span>Safe Evacuation</span>
              </button>

              <button
                id="dynamic-island-explain-ai-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setDynamicIslandExpanded(false));
                  dispatch(setExplainModalOpen(true));
                }}
                className="flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 active:scale-95 text-neutral-200 text-xs py-1.5 px-3 rounded-lg transition"
              >
                <span>Explain AI</span>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
