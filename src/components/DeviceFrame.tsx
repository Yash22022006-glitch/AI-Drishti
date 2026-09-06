import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  AlertTriangle,
  Database,
  User,
  Shield,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setPlatform,
  setThemeMode,
  setSyncModalOpen,
  hideToast,
} from '../store/slices/uiSlice';
import { setNetworkState } from '../store/slices/offlineSyncSlice';
import { setUserRole } from '../store/slices/userSlice';
import { DevicePlatform, ThemeMode, NetworkState, UserRole } from '../types';
import { TopStatusBar } from './TopStatusBar';
import { NetworkStatusBar } from './NetworkStatusBar';
import { BottomTabBar } from './BottomTabBar';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { platform, themeMode, toast } = useAppSelector((s) => s.ui);
  const { networkState, queue } = useAppSelector((s) => s.offlineSync);
  const userRole = useAppSelector((s) => s.user.profile.role);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start sm:py-6 sm:px-4 transition-colors duration-300 ${
        themeMode === 'dark' ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-200 text-neutral-900'
      }`}
    >
      {/* External Desktop Control Dock (SIH Demonstration Bar) */}
      <header className="w-full max-w-2xl mb-4 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-300 dark:border-neutral-800 shadow-md flex flex-wrap items-center justify-between gap-2.5 text-xs select-none">
        {/* Brand & Platform */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
            AI
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-neutral-900 dark:text-white">
              AI-DRISHTI
            </span>
            <span className="text-[10px] text-neutral-500 block leading-none">
              SIH 2026 • Flood MVP
            </span>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Device Platform switch */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl text-[11px] font-semibold">
            {(['ios', 'android', 'fullscreen'] as DevicePlatform[]).map((p) => (
              <button
                key={p}
                id={`dock-platform-${p}`}
                onClick={() => dispatch(setPlatform(p))}
                className={`px-2 py-1 rounded-lg capitalize transition ${
                  platform === p
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {p === 'ios' ? 'iPhone 16' : p === 'android' ? 'Pixel 9' : 'Full'}
              </button>
            ))}
          </div>

          {/* Role switch */}
          <button
            id="dock-role-toggle-btn"
            onClick={() => dispatch(setUserRole(userRole === 'citizen' ? 'responder' : 'citizen'))}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-semibold border transition text-[11px] ${
              userRole === 'responder'
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}
            title="Toggle between Citizen Mobile and NDRF Responder App"
          >
            {userRole === 'responder' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            <span>{userRole === 'responder' ? 'NDRF Mode' : 'Citizen Mode'}</span>
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            id="dock-theme-toggle-btn"
            onClick={() => dispatch(setThemeMode(themeMode === 'dark' ? 'light' : 'dark'))}
            className="p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            title="Toggle Dark / Light theme"
          >
            {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-700" />}
          </button>

          {/* AsyncStorage Cache Inspector */}
          <button
            id="dock-async-storage-btn"
            onClick={() => dispatch(setSyncModalOpen(true))}
            className="flex items-center gap-1 px-2 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold text-[11px]"
            title="View AsyncStorage State"
          >
            <Database className="w-3.5 h-3.5" />
            <span>AsyncStorage</span>
          </button>
        </div>
      </header>

      {/* Main Device Chassis Mockup */}
      <div
        className={`relative transition-all duration-300 overflow-hidden flex flex-col ${
          platform === 'fullscreen'
            ? 'w-full max-w-2xl h-screen sm:h-[90vh] sm:rounded-3xl border border-neutral-300 dark:border-neutral-800 shadow-2xl'
            : platform === 'ios'
            ? 'w-full sm:w-[412px] h-screen sm:h-[844px] sm:rounded-[52px] border-[10px] border-neutral-850 dark:border-neutral-800 shadow-2xl ring-1 ring-neutral-400/30'
            : 'w-full sm:w-[412px] h-screen sm:h-[844px] sm:rounded-[42px] border-[8px] border-neutral-850 dark:border-neutral-800 shadow-2xl ring-1 ring-neutral-400/30'
        } ${themeMode === 'dark' ? 'dark bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900'}`}
      >
        {/* iOS Side Button accents on desktop mockup */}
        {platform === 'ios' && (
          <>
            <div className="hidden sm:block absolute -left-[14px] top-28 w-1 h-10 bg-neutral-700 rounded-l" />
            <div className="hidden sm:block absolute -left-[14px] top-42 w-1 h-12 bg-neutral-700 rounded-l" />
            <div className="hidden sm:block absolute -right-[14px] top-32 w-1 h-16 bg-neutral-700 rounded-r" />
          </>
        )}

        {/* Native Status Bar */}
        <TopStatusBar />

        {/* Network & Offline persistent sync status bar */}
        <NetworkStatusBar />

        {/* Screen Content Container with Smooth Scroll (side scrollbar hidden) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>

        {/* ShopBack style bottom navigation bar */}
        <BottomTabBar />

        {/* Floating In-App Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-20 left-4 right-4 z-50 p-3 rounded-2xl shadow-xl border flex items-start gap-2.5 backdrop-blur-xl select-none bg-white/95 dark:bg-neutral-900/95 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
            >
              <div
                className={`p-1.5 rounded-xl shrink-0 ${
                  toast.type === 'critical'
                    ? 'bg-rose-500 text-white'
                    : toast.type === 'warning'
                    ? 'bg-amber-500 text-white'
                    : toast.type === 'success'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-sky-500 text-white'
                }`}
              >
                {toast.type === 'critical' || toast.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1">
                <h5 className="font-bold text-xs leading-tight">{toast.title}</h5>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                  {toast.message}
                </p>
              </div>

              <button
                id="dismiss-toast-btn"
                onClick={() => dispatch(hideToast())}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
