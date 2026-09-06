import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Database, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Layers, Key, ArrowDownRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSyncModalOpen, showToast } from '../../store/slices/uiSlice';
import { completeSyncCycle, setSyncing, clearAllLogs } from '../../store/slices/offlineSyncSlice';
import AsyncStorage from '../../storage/asyncStorage';

export const OfflineSyncModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.ui.isSyncModalOpen);
  const { queue, isSyncing, lastSyncedAt, syncLogs, networkState } = useAppSelector((s) => s.offlineSync);

  const [storedKeys, setStoredKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyContent, setKeyContent] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadStorageKeys();
    }
  }, [isOpen, queue]);

  const loadStorageKeys = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setStoredKeys(Array.from(keys));
      if (keys.length > 0 && !selectedKey) {
        inspectKey(keys[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const inspectKey = async (key: string) => {
    setSelectedKey(key);
    const content = await AsyncStorage.getItem(key);
    if (content) {
      try {
        const parsed = JSON.parse(content);
        setKeyContent(JSON.stringify(parsed, null, 2));
      } catch {
        setKeyContent(content);
      }
    } else {
      setKeyContent('(empty)');
    }
  };

  const handleClearStorage = async () => {
    await AsyncStorage.clear();
    setStoredKeys([]);
    setKeyContent('');
    setSelectedKey(null);
    dispatch(
      showToast({
        title: 'AsyncStorage Cleared',
        message: 'All local cached keys and values have been purged.',
        type: 'info',
      })
    );
  };

  const handleForceSync = () => {
    if (networkState === 'offline') {
      dispatch(
        showToast({
          title: 'Cannot Sync Offline',
          message: 'Please toggle network simulator to Online or Degraded first.',
          type: 'warning',
        })
      );
      return;
    }
    dispatch(setSyncing(true));
    setTimeout(() => {
      dispatch(completeSyncCycle());
      loadStorageKeys();
      dispatch(
        showToast({
          title: 'Offline Queue Synchronized',
          message: 'All pending actions committed to the Central Disaster Database.',
          type: 'success',
        })
      );
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="w-full sm:max-w-xl max-h-[85vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] border shadow-2xl overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">AsyncStorage & Offline State Hub</h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Local persistence engine mirroring @react-native-async-storage
                </p>
              </div>
            </div>
            <button
              id="close-sync-modal-btn"
              onClick={() => dispatch(setSyncModalOpen(false))}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {/* Status overview cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-semibold uppercase">
                  Network Link
                </span>
                <span className="font-bold capitalize text-neutral-900 dark:text-neutral-100 mt-0.5 block">
                  {networkState}
                </span>
              </div>
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-semibold uppercase">
                  Offline Queue
                </span>
                <span className="font-mono font-bold text-amber-500 text-sm mt-0.5 block">
                  {queue.length} items
                </span>
              </div>
              <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 block font-semibold uppercase">
                  Last Synced
                </span>
                <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300 text-[11px] mt-0.5 block">
                  {lastSyncedAt}
                </span>
              </div>
            </div>

            {/* Queue Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Pending Offline Queue Actions ({queue.length})
                </h5>
                {queue.length > 0 && (
                  <button
                    onClick={handleForceSync}
                    disabled={isSyncing}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    Flush Now
                  </button>
                )}
              </div>

              {queue.length === 0 ? (
                <div className="p-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-center text-xs text-neutral-400">
                  No actions pending in queue. App is in sync with Central Server.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {queue.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-400 block">
                          {item.actionType}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          Created at {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                        Awaiting Signal
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AsyncStorage Keys Inspector */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Persisted AsyncStorage Keys
              </h5>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {storedKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => inspectKey(key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                      selectedKey === key
                        ? 'bg-sky-500 text-white font-bold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {selectedKey && (
                <div className="rounded-xl border bg-neutral-900 text-neutral-200 p-3 font-mono text-[11px] overflow-x-auto max-h-48 border-neutral-800">
                  <div className="text-[10px] text-neutral-500 pb-1 border-b border-neutral-800 mb-2 flex items-center justify-between">
                    <span>Key: @AI_DRISHTI:{selectedKey}</span>
                    <span>JSON Payload</span>
                  </div>
                  <pre>{keyContent}</pre>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/80 flex items-center justify-between">
            <button
              onClick={handleClearStorage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Cache</span>
            </button>

            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 active:scale-95 text-white transition shadow-md shadow-sky-900/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync All</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
