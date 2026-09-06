import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, DevicePlatform, ActiveTab } from '../../types';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
}

interface UiState {
  themeMode: ThemeMode;
  platform: DevicePlatform;
  activeTab: ActiveTab;
  isReportModalOpen: boolean;
  isRouteModalOpen: boolean;
  isSyncModalOpen: boolean;
  isExplainModalOpen: boolean;
  dynamicIslandExpanded: boolean;
  toast: ToastNotification | null;
}

const initialState: UiState = {
  themeMode: 'dark', // default dark mode as requested
  platform: 'ios', // default iOS frame
  activeTab: 'home',
  isReportModalOpen: false,
  isRouteModalOpen: false,
  isSyncModalOpen: false,
  isExplainModalOpen: false,
  dynamicIslandExpanded: false,
  toast: {
    id: 'welcome',
    title: 'Offline Sync Ready',
    message: 'AsyncStorage engine initialized with real-time state caching.',
    type: 'info',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setPlatform: (state, action: PayloadAction<DevicePlatform>) => {
      state.platform = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<ActiveTab>) => {
      state.activeTab = action.payload;
    },
    setReportModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isReportModalOpen = action.payload;
    },
    setRouteModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRouteModalOpen = action.payload;
    },
    setSyncModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSyncModalOpen = action.payload;
    },
    setExplainModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExplainModalOpen = action.payload;
    },
    toggleDynamicIsland: (state) => {
      state.dynamicIslandExpanded = !state.dynamicIslandExpanded;
    },
    setDynamicIslandExpanded: (state, action: PayloadAction<boolean>) => {
      state.dynamicIslandExpanded = action.payload;
    },
    showToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      state.toast = {
        ...action.payload,
        id: `toast-${Date.now()}`,
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setThemeMode,
  setPlatform,
  setActiveTab,
  setReportModalOpen,
  setRouteModalOpen,
  setSyncModalOpen,
  setExplainModalOpen,
  toggleDynamicIsland,
  setDynamicIslandExpanded,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
