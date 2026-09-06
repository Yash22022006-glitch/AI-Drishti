import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Navigation, ShieldCheck, AlertTriangle, ArrowRight, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setRouteModalOpen } from '../../store/slices/uiSlice';

export const EvacuationRouteModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isRouteModalOpen);
  const route = useAppSelector((s) => s.shelters.activeRoute);

  if (!isOpen || !route) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="w-full sm:max-w-lg max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">AI Dynamic Evacuation Corridor</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Calculated safe elevation path avoiding flooded roads
                </p>
              </div>
            </div>
            <button
              id="close-route-modal-btn"
              onClick={() => dispatch(setRouteModalOpen(false))}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Route Overview banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{route.safetyScore}% Safety Index Guaranteed</span>
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-500 mt-0.5">
                Destination: <strong>{route.destinationName}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {route.estTimeMinutes} min
              </span>
              <span className="block text-[10px] text-neutral-500">{route.distanceKm} km walking</span>
            </div>
          </div>

          {/* Hazard Notice */}
          {route.hazardWarnings.length > 0 && (
            <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <strong className="block font-bold">Avoid Submerged Waypoints:</strong>
                {route.hazardWarnings.map((warn, i) => (
                  <p key={i} className="text-[11px] leading-tight mt-0.5 text-rose-700 dark:text-rose-400">
                    • {warn}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Turn-by-turn list */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Verified Waypoint Navigation
            </h5>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
              {route.steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 bg-emerald-500" />
                  
                  <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Step {idx + 1}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-500">
                        {step.distance}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug">
                      {step.instruction}
                    </p>
                    {step.hazardNote && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ {step.hazardNote}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Offline Cached in AsyncStorage</span>
            </div>
            <button
              id="start-evac-navigation-btn"
              onClick={() => dispatch(setRouteModalOpen(false))}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition shadow-md shadow-emerald-900/30"
            >
              <span>Follow Safe Path</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
