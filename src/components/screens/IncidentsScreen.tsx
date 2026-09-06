import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Filter,
  Plus,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Database,
  Search,
  Check,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setReportModalOpen, showToast } from '../../store/slices/uiSlice';
import { setSelectedCategory, updateIncidentStatus } from '../../store/slices/incidentsSlice';

export const IncidentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedCategory } = useAppSelector((s) => s.incidents);
  const networkState = useAppSelector((s) => s.offlineSync.networkState);

  const categories = [
    { id: 'all', label: 'All Feeds' },
    { id: 'flooding', label: '🌊 Flooding' },
    { id: 'blocked_road', label: '🚧 Blocked Roads' },
    { id: 'structural_collapse', label: '🏚️ Collapse' },
    { id: 'medical_emergency', label: '🚑 Medical' },
  ];

  const filteredIncidents =
    selectedCategory === 'all'
      ? items
      : items.filter((inc) => inc.category === selectedCategory);

  return (
    <div className="w-full pb-20 select-none space-y-3 px-4 pt-2">
      {/* Header with New Incident Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Camera className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Field Incident Intelligence</span>
          </h3>
          <p className="text-[11px] text-neutral-500">
            Citizen telemetry & AI Computer Vision damage classification
          </p>
        </div>

        <button
          id="report-incident-top-btn"
          onClick={() => dispatch(setReportModalOpen(true))}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs transition shadow-md shadow-rose-950/20"
        >
          <Plus className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-incident-${cat.id}`}
            onClick={() => dispatch(setSelectedCategory(cat.id))}
            className={`px-3 py-1.5 rounded-full font-medium transition shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredIncidents.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-500">
            No incidents found in this category.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 p-4"
            >
              {/* Card Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : inc.severity === 'HIGH'
                        ? 'bg-orange-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-400">
                    {inc.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {inc.synced ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      Synced
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      <Database className="w-3 h-3" />
                      In AsyncStorage
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-snug">
                  {inc.title}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                  {inc.description}
                </p>
              </div>

              {/* Attached Image & AI Vision assessment badge */}
              {inc.imageUri && (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                  <img
                    src={inc.imageUri}
                    alt={inc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover"
                  />

                  {inc.aiDamageAssessment && (
                    <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 font-bold text-amber-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Damage Model
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400">
                          Conf: {Math.round(inc.aiDamageAssessment.confidence * 100)}%
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {inc.aiDamageAssessment.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-neutral-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="text-[10px] text-neutral-300 pt-0.5">
                        <span className="font-semibold text-white">Recommended:</span>{' '}
                        {inc.aiDamageAssessment.suggestedAction}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location & Reporter info */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {inc.locationName}
                </span>
                <span>By {inc.reportedBy}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
