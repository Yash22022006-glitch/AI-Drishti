import React from 'react';
import { motion } from 'motion/react';
import { Home, Compass, AlertOctagon, Camera, Tent, User, ShieldAlert } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveTab } from '../store/slices/uiSlice';
import { ActiveTab } from '../types';

export const BottomTabBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((s) => s.ui.activeTab);
  const platform = useAppSelector((s) => s.ui.platform);
  const queueCount = useAppSelector((s) => s.offlineSync.queue.length);
  const userRole = useAppSelector((s) => s.user.profile.role);

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Explore', icon: Home },
    { id: 'map', label: 'Risk Map', icon: Compass },
    { id: 'sos', label: 'SOS', icon: ShieldAlert },
    { id: 'incidents', label: 'Incidents', icon: Camera, badge: queueCount > 0 ? queueCount : undefined },
    { id: 'shelters', label: 'Shelters', icon: Tent },
  ];

  return (
    <div className="w-full relative z-30 select-none pb-2 pt-1 border-t transition-colors bg-white/95 dark:bg-neutral-950/95 border-neutral-200 dark:border-neutral-800/80 backdrop-blur-xl">
      <div className="max-w-md mx-auto px-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isSos = tab.id === 'sos';
          const Icon = tab.icon;

          if (isSos) {
            return (
              <button
                key={tab.id}
                id={`tab-button-${tab.id}`}
                onClick={() => dispatch(setActiveTab(tab.id))}
                className="relative -top-4 flex flex-col items-center justify-center group focus:outline-none"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white border-white dark:border-neutral-900 ring-4 ring-rose-500/20'
                      : 'bg-rose-600 hover:bg-rose-500 text-white border-white dark:border-neutral-900'
                  }`}
                >
                  <Icon className="w-6 h-6 animate-pulse" />
                </motion.div>
                <span
                  className={`text-[10px] font-bold mt-0.5 tracking-wider uppercase ${
                    isActive ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-500 dark:text-neutral-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className="relative flex-1 py-1 flex flex-col items-center justify-center text-center transition group focus:outline-none"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-rose-600 dark:text-rose-400 stroke-[2.4]'
                      : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-bold font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 w-4 h-0.5 rounded-full bg-rose-600 dark:bg-rose-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* iOS Home Indicator Bar or Android Navigation Bar */}
      {platform === 'ios' && (
        <div className="w-32 h-1 mx-auto mt-2 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
      )}
      {platform === 'android' && (
        <div className="w-20 h-1 mx-auto mt-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full" />
      )}
    </div>
  );
};
