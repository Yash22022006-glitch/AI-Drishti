import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, RefreshCw, Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setNetworkState, completeSyncCycle, setSyncing } from '../store/slices/offlineSyncSlice';
import { setSyncModalOpen, showToast } from '../store/slices/uiSlice';
import { NetworkState } from '../types';

export const NetworkStatusBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { networkState, queue, isSyncing, lastSyncedAt } = useAppSelector((s) => s.offlineSync);
  const themeMode = useAppSelector((s) => s.ui.themeMode);

  const handleManualSync = () => {
    if (networkState === 'offline') {
      dispatch(
        showToast({
          title: 'Offline Mode Active',
          message: 'Switch to Online or Degraded network state to flush cached AsyncStorage items.',
          type: 'warning',
        })
      );
      return;
    }

    dispatch(setSyncing(true));
    setTimeout(() => {
      dispatch(completeSyncCycle());
      dispatch(
        showToast({
          title: 'Sync Complete',
          message: 'All queued incidents and telemetry successfully synchronized with Central GIS Server.',
          type: 'success',
        })
      );
    }, 1200);
  };

  const cycleNetworkState = () => {
    const states: NetworkState[] = ['online', 'degraded', 'offline'];
    const nextIdx = (states.indexOf(networkState) + 1) % states.length;
    const nextState = states[nextIdx];
    dispatch(setNetworkState(nextState));

    if (nextState === 'offline') {
      dispatch(
        showToast({
          title: 'Offline Emergency Mode',
          message: 'All incident reports, SOS beacons, and route requests will persist locally in AsyncStorage.',
          type: 'warning',
        })
      );
    } else if (nextState === 'online') {
      dispatch(
        showToast({
          title: 'Network Restored',
          message: 'Connected to high-speed satellite telemetry. Auto-flushing offline queue.',
          type: 'success',
        })
      );
      if (queue.length > 0) {
        handleManualSync();
      }
    } else {
      dispatch(
        showToast({
          title: 'Degraded Connectivity (2G/EDGE)',
          message: 'Reduced bandwidth. Text telemetry prioritized; heavy media queued.',
          type: 'info',
        })
      );
    }
  };

  const getBadgeStyle = () => {
    switch (networkState) {
      case 'online':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'degraded':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'offline':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="w-full px-3 py-1.5 flex items-center justify-between border-b text-xs select-none transition-colors border-neutral-200 dark:border-neutral-800/80 bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur-md">
      {/* Network toggle button */}
      <button
        id="network-state-toggle-btn"
        onClick={cycleNetworkState}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium transition-all hover:opacity-90 active:scale-95 ${getBadgeStyle()}`}
        title="Tap to cycle between Online, Degraded (2G), and Offline modes"
      >
        {networkState === 'online' && <Wifi className="w-3.5 h-3.5" />}
        {networkState === 'degraded' && <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
        {networkState === 'offline' && <WifiOff className="w-3.5 h-3.5" />}
        <span className="capitalize font-semibold tracking-wide">
          {networkState === 'degraded' ? '2G Degraded' : networkState}
        </span>
      </button>

      {/* AsyncStorage queue & sync status */}
      <div className="flex items-center gap-2">
        <button
          id="async-storage-inspector-btn"
          onClick={() => dispatch(setSyncModalOpen(true))}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          title="Inspect AsyncStorage data & sync queue"
        >
          <Database className="w-3 h-3 text-sky-500" />
          <span className="font-mono text-[10px]">
            {queue.length > 0 ? (
              <span className="text-amber-500 font-bold">{queue.length} Queued</span>
            ) : (
              'Synced'
            )}
          </span>
        </button>

        <button
          id="trigger-sync-btn"
          onClick={handleManualSync}
          disabled={isSyncing}
          className="p-1 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition disabled:opacity-50"
          title="Force Sync with Central GIS"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
