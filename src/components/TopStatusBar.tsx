import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { DynamicIslandAlert } from './DynamicIslandAlert';

export const TopStatusBar: React.FC = () => {
  const platform = useAppSelector((s) => s.ui.platform);
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (platform === 'fullscreen') {
    return null;
  }

  return (
    <div className="w-full relative z-40 select-none pt-2.5 px-6 flex items-center justify-between text-neutral-800 dark:text-neutral-200 transition-colors">
      {/* Left side: Clock */}
      <div className="w-16 font-semibold text-[13px] tracking-tight text-left">
        {timeStr}
      </div>

      {/* Center: Dynamic Island on iOS or Punch Hole on Android */}
      <div className="flex-1 flex justify-center items-center">
        {platform === 'ios' ? (
          <DynamicIslandAlert />
        ) : (
          <div className="w-4 h-4 rounded-full bg-black border border-neutral-700/50 shadow-inner" />
        )}
      </div>

      {/* Right side: Signal, Wifi, Battery */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-neutral-700 dark:text-neutral-300">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
