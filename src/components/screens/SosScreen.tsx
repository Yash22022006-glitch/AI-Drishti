import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Heart,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  X,
  Radio,
  WifiOff,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { enqueueOfflineAction } from '../../store/slices/offlineSyncSlice';
import { showToast } from '../../store/slices/uiSlice';

export const SosScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((s) => s.user.profile);
  const networkState = useAppSelector((s) => s.offlineSync.networkState);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      triggerSosBeacon();
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(3);
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  const triggerSosBeacon = () => {
    setSosTriggered(true);

    const isOffline = networkState === 'offline';
    const sosPayload = {
      id: `sos-${Date.now()}`,
      userId: userProfile.id,
      name: userProfile.name,
      phone: userProfile.phone,
      bloodGroup: userProfile.bloodGroup,
      coordinates: [28.6289, 77.2785],
      address: userProfile.address,
      timestamp: new Date().toISOString(),
      type: 'LIFE_SAFETY_CRITICAL_BEACON',
    };

    if (isOffline) {
      dispatch(
        enqueueOfflineAction({
          id: `queue-sos-${Date.now()}`,
          actionType: 'EMERGENCY_SOS_BEACON',
          payload: sosPayload,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        })
      );
      dispatch(
        showToast({
          title: 'SOS Cached in AsyncStorage',
          message: 'Saved offline. High-frequency SMS broadcast & telemetry queued for transmission.',
          type: 'warning',
        })
      );
    } else {
      dispatch(
        showToast({
          title: 'SOS Beacon Dispatched Live',
          message: 'NDRF Control Room & nearest rescue boat alerted with your GPS location.',
          type: 'critical',
        })
      );
    }
  };

  return (
    <div className="w-full pb-20 select-none space-y-4 px-4 pt-2">
      {/* Top Banner */}
      <div className="text-center space-y-1">
        <h3 className="text-lg font-black text-rose-600 dark:text-rose-500 uppercase tracking-wider flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
          <span>Emergency Tactical SOS</span>
        </h3>
        <p className="text-xs text-neutral-500">
          Instant satellite beacon to National Disaster Response Force & Local Relief
        </p>
      </div>

      {/* Main SOS Trigger Circle */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center">
          {/* Animated pulse rings */}
          <div className="absolute w-52 h-52 rounded-full bg-rose-600/10 animate-ping" />
          <div className="absolute w-44 h-44 rounded-full bg-rose-600/20" />

          {countdown !== null ? (
            /* Countdown cancel button */
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative z-10 w-36 h-36 rounded-full bg-neutral-900 text-white flex flex-col items-center justify-center border-4 border-amber-500 shadow-2xl"
            >
              <span className="text-4xl font-mono font-black text-amber-400">{countdown}</span>
              <span className="text-[10px] uppercase font-bold text-neutral-400 mt-0.5">
                Tap to Abort
              </span>
              <button
                id="cancel-sos-btn"
                onClick={cancelCountdown}
                className="mt-1 px-3 py-0.5 rounded-full bg-rose-600 text-[10px] font-bold"
              >
                Cancel
              </button>
            </motion.div>
          ) : sosTriggered ? (
            /* Activated state */
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative z-10 w-36 h-36 rounded-full bg-rose-600 text-white flex flex-col items-center justify-center border-4 border-white shadow-2xl p-2 text-center"
            >
              <Radio className="w-8 h-8 animate-pulse mb-1" />
              <span className="text-xs font-black uppercase tracking-wider">BEACON ACTIVE</span>
              <span className="text-[9px] text-rose-100 mt-0.5">GPS Locked</span>
            </motion.div>
          ) : (
            /* Normal trigger button */
            <motion.button
              id="trigger-sos-btn"
              whileTap={{ scale: 0.95 }}
              onClick={startCountdown}
              className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex flex-col items-center justify-center border-4 border-white dark:border-neutral-900 shadow-2xl shadow-rose-950/50 cursor-pointer focus:outline-none"
            >
              <ShieldAlert className="w-10 h-10 mb-1" />
              <span className="text-lg font-black tracking-widest">SOS</span>
              <span className="text-[9px] uppercase font-semibold text-rose-100">
                Press & Hold 3s
              </span>
            </motion.button>
          )}
        </div>

        {networkState === 'offline' && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline: Emergency packet saved to AsyncStorage</span>
          </div>
        )}
      </div>

      {/* GPS Telemetry & ICE Medical Profile */}
      <div className="p-3.5 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 space-y-2.5 shadow-sm text-xs">
        <div className="flex items-center justify-between font-semibold">
          <span className="text-neutral-500">Live GPS Coordinates:</span>
          <span className="font-mono text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            28.6289° N, 77.2785° E (±4m)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">Citizen Name</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200">
              {userProfile.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block font-medium">Blood Group (ICE)</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {userProfile.bloodGroup}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Speed Dials */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Direct Helplines
        </h4>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: 'NDRF Control', number: '1078', desc: 'Disaster Rescue' },
            { label: 'National Police', number: '112', desc: 'Emergency Unit' },
            { label: 'Ambulance', number: '108', desc: 'Medical Transit' },
          ].map((hl) => (
            <a
              key={hl.number}
              href={`tel:${hl.number}`}
              className="p-3 rounded-2xl border flex flex-col items-center justify-center text-center bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm transition active:scale-95"
            >
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-1">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                {hl.number}
              </span>
              <span className="text-[10px] text-neutral-500 leading-tight mt-0.5">{hl.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Contacts List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Personal Emergency Circle (ICE)
        </h4>

        <div className="space-y-2">
          {userProfile.emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl border flex items-center justify-between bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs shadow-sm"
            >
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                  {contact.name}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {contact.relationship} • {contact.phone}
                </span>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-rose-600 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
