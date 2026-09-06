import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Info, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setExplainModalOpen } from '../../store/slices/uiSlice';

export const ExplainableAiModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isExplainModalOpen);
  const zones = useAppSelector((s) => s.risk.zones);
  const selectedZoneId = useAppSelector((s) => s.risk.selectedZoneId);
  const zone = zones.find((z) => z.id === selectedZoneId) || zones[0];

  if (!isOpen) return null;

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
          {/* Modal Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">AI Explainable Risk Breakdown</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Model: XGBoost-Hydro-v2.4 (SHAP Feature Attribution)
                </p>
              </div>
            </div>
            <button
              id="close-explain-modal-btn"
              onClick={() => dispatch(setExplainModalOpen(false))}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Zone summary card */}
            <div className="p-3.5 rounded-2xl border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                    Selected Hydrological Zone
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {zone.name}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-rose-500">
                    {zone.riskScore}%
                  </span>
                  <span className="block text-[10px] font-semibold text-rose-500/80 uppercase">
                    {zone.severity} RISK
                  </span>
                </div>
              </div>
            </div>

            {/* Scientific Notice */}
            <div className="flex items-start gap-2 p-3 rounded-xl text-xs bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Risk estimates are generated through tabular gradient boosting trained on NWIC, IMD precipitation telemetry, and SRTM elevation grids. Predictions represent statistical probability and should guide proactive evacuation.
              </p>
            </div>

            {/* Factors list */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Top Contributing Risk Drivers
              </h5>
              <div className="space-y-2.5">
                {zone.factors.map((factor) => (
                  <div
                    key={factor.id}
                    className="p-3 rounded-xl border bg-white dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                        {factor.name}
                      </span>
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        +{factor.contributionPercent}% impact
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full"
                        style={{ width: `${factor.contributionPercent * 2}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-neutral-600 dark:text-neutral-400">
                        Observed: <strong className="text-neutral-900 dark:text-neutral-100">{factor.value}</strong>
                      </span>
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-400">
                        <TrendingUp className="w-3 h-3 text-rose-500" />
                        {factor.trend}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/80 flex justify-end">
            <button
              id="acknowledge-explain-btn"
              onClick={() => dispatch(setExplainModalOpen(false))}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 transition"
            >
              Understood
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
