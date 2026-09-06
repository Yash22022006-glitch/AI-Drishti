import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, UploadCloud, AlertCircle, MapPin, Sparkles, Check, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setReportModalOpen, showToast } from '../../store/slices/uiSlice';
import { addIncident } from '../../store/slices/incidentsSlice';
import { enqueueOfflineAction } from '../../store/slices/offlineSyncSlice';
import { incrementIncidentCount } from '../../store/slices/userSlice';
import { IncidentReport, RiskSeverity } from '../../types';

export const IncidentReportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isReportModalOpen);
  const networkState = useAppSelector((s) => s.offlineSync.networkState);
  const userProfile = useAppSelector((s) => s.user.profile);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentReport['category']>('flooding');
  const [severity, setSeverity] = useState<RiskSeverity>('HIGH');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Yamuna Khadar Pusta Road, East Delhi');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiResult, setAiResult] = useState<IncidentReport['aiDamageAssessment'] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageUri(dataUrl);
      simulateAiComputerVision(file.name);
    };
    reader.readAsDataURL(file);
  };

  const simulateAiComputerVision = (filename: string) => {
    setIsAnalyzingImage(true);
    setTimeout(() => {
      setIsAnalyzingImage(false);
      setAiResult({
        damageDetected: true,
        confidence: 0.93,
        severityEstimate: severity,
        tags: ['Inundation Level 1.2m', 'Vehicle Stalled', 'Immediate Tow Required'],
        suggestedAction: 'Deploy NDRF shallow-draft rescue boat & bar civilian approach.',
      });
      dispatch(
        showToast({
          title: 'AI Damage Triage Completed',
          message: 'Computer Vision model detected flood level > 1m with 93% confidence.',
          type: 'info',
        })
      );
    }, 900);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      dispatch(
        showToast({
          title: 'Missing Details',
          message: 'Please provide a clear incident title and description.',
          type: 'warning',
        })
      );
      return;
    }

    const isOffline = networkState === 'offline';
    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      title: title.trim(),
      category,
      severity,
      description: description.trim(),
      locationName,
      coordinates: [28.6289, 77.2785],
      reportedBy: `${userProfile.name} (${userProfile.role === 'responder' ? 'NDRF Responder' : 'Citizen'})`,
      userRole: userProfile.role,
      timestamp: 'Just now',
      status: 'verified',
      imageUri: imageUri || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      aiDamageAssessment: aiResult || {
        damageDetected: true,
        confidence: 0.88,
        severityEstimate: severity,
        tags: ['Citizen Telemetry', 'Field Incident'],
        suggestedAction: 'Assign nearest municipal rapid response team.',
      },
      synced: !isOffline,
      offlineCreated: isOffline,
    };

    dispatch(addIncident(newIncident));
    dispatch(incrementIncidentCount());

    if (isOffline) {
      dispatch(
        enqueueOfflineAction({
          id: `queue-${Date.now()}`,
          actionType: 'CREATE_INCIDENT_REPORT',
          payload: newIncident,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        })
      );
      dispatch(
        showToast({
          title: 'Saved to AsyncStorage (Offline)',
          message: 'Your report is safely stored locally and will sync automatically once signal returns.',
          type: 'warning',
        })
      );
    } else {
      dispatch(
        showToast({
          title: 'Incident Broadcasted Live',
          message: '+500 DRISHTI Relief credits earned for field reconnaissance!',
          type: 'success',
        })
      );
    }

    dispatch(setReportModalOpen(false));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Report Disaster Incident</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {networkState === 'offline' ? 'Offline Mode — Will Cache in AsyncStorage' : 'Direct Dispatch to Command Center'}
                </p>
              </div>
            </div>
            <button
              id="close-report-modal-btn"
              onClick={() => dispatch(setReportModalOpen(false))}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Category pills */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Incident Category
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(
                  [
                    { id: 'flooding', label: '🌊 Flooding' },
                    { id: 'blocked_road', label: '🚧 Blocked Road' },
                    { id: 'structural_collapse', label: '🏚️ Collapse' },
                    { id: 'medical_emergency', label: '🚑 Medical' },
                    { id: 'trapped_citizens', label: '🆘 Trapped' },
                    { id: 'supplies_needed', label: '📦 Rations' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-2 px-2 rounded-xl border text-center font-medium transition ${
                      category === cat.id
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-400 shadow-sm'
                        : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Observed Severity
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
                {(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as RiskSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 rounded-lg border text-center transition ${
                      severity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : sev === 'HIGH'
                          ? 'bg-orange-500 text-white border-orange-500'
                          : sev === 'MODERATE'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Headline / What is happening?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Bridge underpass inundated, 2 cars stranded"
                className="w-full px-3.5 py-2 rounded-xl text-xs border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Detailed Observation
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current water depth, number of victims, immediate hazards..."
                className="w-full px-3.5 py-2 rounded-xl text-xs border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Location (GPS Tagged)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-xs">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-neutral-800 dark:text-neutral-200 font-medium"
                />
              </div>
            </div>

            {/* Photo Upload & AI Computer Vision */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Attach Disaster Photo (AI Damage Detection)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageSelect(e.target.files[0]);
                  }
                }}
              />

              {!imageUri ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition border-neutral-300 dark:border-neutral-700 hover:border-rose-500 bg-neutral-50/50 dark:bg-neutral-800/20"
                >
                  <UploadCloud className="w-8 h-8 text-neutral-400 mb-1" />
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Click to browse or drag & drop disaster image
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">
                    Automatically triggers computer vision damage assessment
                  </span>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black">
                  <img
                    src={imageUri}
                    alt="Incident preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover opacity-90"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUri(null);
                      setAiResult(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* AI badge overlay */}
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-bold text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Vision Analysis
                      </span>
                      {isAnalyzingImage ? (
                        <span className="text-[10px] text-amber-300 animate-pulse">Scanning pixels...</span>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          Confidence: {Math.round((aiResult?.confidence || 0.9) * 100)}%
                        </span>
                      )}
                    </div>
                    {aiResult && !isAnalyzingImage && (
                      <div className="text-[10px] text-neutral-300">
                        <span className="font-semibold text-white">Action:</span> {aiResult.suggestedAction}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 active:scale-98 text-white transition shadow-lg shadow-rose-950/30 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {networkState === 'offline' ? 'Queue to AsyncStorage' : 'Broadcast Disaster Incident'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
