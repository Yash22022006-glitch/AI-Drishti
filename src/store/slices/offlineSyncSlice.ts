import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkState, OfflineQueueItem } from '../../types';

interface SyncLog {
  id: string;
  timestamp: string;
  summary: string;
  status: 'synced' | 'queued' | 'retrying';
}

interface OfflineSyncState {
  networkState: NetworkState;
  queue: OfflineQueueItem[];
  isSyncing: boolean;
  lastSyncedAt: string;
  syncLogs: SyncLog[];
}

const initialState: OfflineSyncState = {
  networkState: 'online',
  queue: [],
  isSyncing: false,
  lastSyncedAt: 'Just now',
  syncLogs: [
    {
      id: 'log-1',
      timestamp: '19:02:14',
      summary: 'Initial telemetry bundle cached to AsyncStorage',
      status: 'synced',
    },
  ],
};

export const offlineSyncSlice = createSlice({
  name: 'offlineSync',
  initialState,
  reducers: {
    setNetworkState: (state, action: PayloadAction<NetworkState>) => {
      state.networkState = action.payload;
    },
    enqueueOfflineAction: (state, action: PayloadAction<OfflineQueueItem>) => {
      state.queue.push(action.payload);
      state.syncLogs.unshift({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        summary: `Action queued offline: ${action.payload.actionType}`,
        status: 'queued',
      });
    },
    removeQueuedAction: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter((item) => item.id !== action.payload);
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    completeSyncCycle: (state) => {
      const drainedCount = state.queue.length;
      state.queue = [];
      state.isSyncing = false;
      state.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (drainedCount > 0) {
        state.syncLogs.unshift({
          id: `log-${Date.now()}`,
          timestamp: state.lastSyncedAt,
          summary: `Flushed and synced ${drainedCount} offline action(s) to Central Server`,
          status: 'synced',
        });
      }
    },
    clearAllLogs: (state) => {
      state.syncLogs = [];
      state.queue = [];
    },
  },
});

export const {
  setNetworkState,
  enqueueOfflineAction,
  removeQueuedAction,
  setSyncing,
  completeSyncCycle,
  clearAllLogs,
} = offlineSyncSlice.actions;

export default offlineSyncSlice.reducer;
