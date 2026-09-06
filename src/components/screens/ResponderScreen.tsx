import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Navigation,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Send,
  Radio,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateMissionStatus, addMissionLogNote } from '../../store/slices/responderSlice';
import { setRouteModalOpen, showToast } from '../../store/slices/uiSlice';
import { ResponderMission } from '../../types';

export const ResponderScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const missions = useAppSelector((s) => s.responder.missions);
  const selectedMissionId = useAppSelector((s) => s.responder.selectedMissionId);
  const activeMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const [noteInput, setNoteInput] = useState('');

  const statusFlow: ResponderMission['status'][] = [
    'assigned',
    'en_route',
    'arrived',
    'rescuing',
    'completed',
  ];

  const handleAdvanceStatus = () => {
    const currentIdx = statusFlow.indexOf(activeMission.status);
    if (currentIdx < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIdx + 1];
      dispatch(updateMissionStatus({ id: activeMission.id, status: nextStatus }));
      dispatch(
        showToast({
          title: 'Mission Status Updated',
          message: `Mission advanced to "${nextStatus.toUpperCase()}". Incident Command notified.`,
          type: 'info',
        })
      );
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    dispatch(addMissionLogNote({ id: activeMission.id, note: noteInput.trim() }));
    setNoteInput('');
    dispatch(
      showToast({
        title: 'Tactical Log Synced',
        message: 'Field log timestamped and appended to mission manifest.',
        type: 'success',
      })
    );
  };

  return (
    <div className="w-full pb-20 select-none space-y-4 px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              NDRF Tactical Operations
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500">
            Responder Mission Dispatch & Field Telemetry Unit
          </p>
        </div>

        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase">
          Unit: Alpha-8
        </span>
      </div>

      {/* Active Mission Card */}
      <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3.5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
              {activeMission.priority} PRIORITY
            </span>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mt-1">
              {activeMission.title}
            </h4>
            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {activeMission.location}
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-base font-black text-amber-500">
              {activeMission.etaMinutes} min
            </span>
            <span className="block text-[9px] text-neutral-400">Target ETA</span>
          </div>
        </div>

        {/* Status Lifecycle Stepper */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Mission Progress
          </span>
          <div className="grid grid-cols-5 gap-1 text-center">
            {statusFlow.map((step, idx) => {
              const currentIdx = statusFlow.indexOf(activeMission.status);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isPast || isCurrent
                        ? isCurrent
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-emerald-500'
                        : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  />
                  <span
                    className={`text-[9px] uppercase font-bold block ${
                      isCurrent
                        ? 'text-amber-500 font-black'
                        : isPast
                        ? 'text-emerald-500'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">Affected Citizens</span>
            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
              {activeMission.affectedCount} individuals
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">Safe Destination</span>
            <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 line-clamp-1">
              {activeMission.targetHospitalOrShelter}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            id="responder-route-btn"
            onClick={() => dispatch(setRouteModalOpen(true))}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Tactical Route</span>
          </button>

          <button
            id="advance-mission-status-btn"
            onClick={handleAdvanceStatus}
            disabled={activeMission.status === 'completed'}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-neutral-900 dark:bg-neutral-100 hover:opacity-90 active:scale-95 text-white dark:text-neutral-900 transition flex items-center justify-center gap-1.5 shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Advance Status</span>
          </button>
        </div>
      </div>

      {/* Field Tactical Logs */}
      <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Field Log Transmission (AsyncStorage Cached)</span>
        </h4>

        {/* Notes list */}
        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {activeMission.notes.map((note, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-800"
            >
              {note}
            </div>
          ))}
        </div>

        {/* Append Note Input */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add field dispatch note..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
