import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Waves,
  ShieldAlert,
  Tent,
  HeartPulse,
  PackageCheck,
  AlertTriangle,
  Camera,
  Satellite,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight,
  Droplets,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setActiveTab,
  setReportModalOpen,
  setRouteModalOpen,
  setExplainModalOpen,
  setSyncModalOpen,
  showToast,
} from '../../store/slices/uiSlice';
import { setSelectedZone } from '../../store/slices/riskSlice';
import { setSelectedShelterId } from '../../store/slices/sheltersSlice';
import { redeemVoucher } from '../../store/slices/userSlice';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const zones = useAppSelector((s) => s.risk.zones);
  const incidents = useAppSelector((s) => s.incidents.items);
  const shelters = useAppSelector((s) => s.shelters.items);
  const { profile, vouchers } = useAppSelector((s) => s.user);
  const criticalZone = zones.find((z) => z.severity === 'CRITICAL') || zones[0];

  const handleOpenZone = (zoneId: string) => {
    dispatch(setSelectedZone(zoneId));
    dispatch(setActiveTab('map'));
  };

  const handleOpenShelter = (shelterId: string) => {
    dispatch(setSelectedShelterId(shelterId));
    dispatch(setActiveTab('shelters'));
  };

  return (
    <div className="w-full pb-20 space-y-4 select-none">
      {/* ShopBack style Top Header: Relief Balance & Search */}
      <div className="px-4 pt-2 space-y-3">
        {/* Wallet & Rewards summary bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-100 block">
                Disaster Relief Fund & Points
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold font-mono tracking-tight">
                  ₹{profile.reliefWalletBalance.toLocaleString()}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-bold">
                  Active
                </span>
              </div>
            </div>
          </div>

          <button
            id="home-vouchers-btn"
            onClick={() => dispatch(setActiveTab('shelters'))}
            className="px-3 py-1.5 rounded-xl bg-white text-rose-600 font-bold text-xs hover:bg-rose-50 transition shadow-sm active:scale-95 flex items-center gap-1"
          >
            <span>Vouchers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search bar */}
        <div
          onClick={() => dispatch(setActiveTab('map'))}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border cursor-pointer transition bg-neutral-100 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          <Search className="w-4 h-4 text-neutral-400" />
          <span className="text-xs">Search safe zones, flood radar, shelters, relief...</span>
        </div>
      </div>

      {/* Hero Urgent Carousel: Critical Alert (ShopBack Hero Banner Style) */}
      <div className="px-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden rounded-3xl p-4 text-white bg-gradient-to-br from-rose-700 via-rose-800 to-neutral-900 border border-rose-500/30 shadow-xl"
        >
          {/* Subtle wave watermark effect */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-wider uppercase animate-pulse">
                Live Alert
              </span>
              <span className="text-[11px] font-medium text-rose-200">
                Yamuna Crest in 3.8 hrs
              </span>
            </div>
            <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded-lg text-rose-300">
              87% Flood Risk
            </span>
          </div>

          <div className="mt-3 relative z-10">
            <h3 className="text-base font-bold leading-snug">
              Hathnikund Discharge: 3.52 Lakh Cusecs Approaching Old Bridge
            </h3>
            <p className="text-xs text-rose-100/90 mt-1 leading-relaxed">
              Low-lying settlements in Sector 4 under mandatory evacuation notice. Elevated corridors active.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 relative z-10">
            <button
              id="hero-evac-route-btn"
              onClick={() => dispatch(setRouteModalOpen(true))}
              className="flex-1 py-2 px-3 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 active:scale-95 transition shadow flex items-center justify-center gap-1.5"
            >
              <span>Safe Evac Corridor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-explain-ai-btn"
              onClick={() => dispatch(setExplainModalOpen(true))}
              className="py-2 px-3 rounded-xl bg-black/40 hover:bg-black/60 active:scale-95 text-xs font-semibold text-rose-200 border border-white/10 transition"
            >
              Why 87%?
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Grid (ShopBack Style 8-Icon Grid) */}
      <div className="px-4">
        <div className="grid grid-cols-4 gap-2.5">
          {[
            {
              id: 'radar',
              label: 'Flood Radar',
              icon: Waves,
              color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
              action: () => dispatch(setActiveTab('map')),
            },
            {
              id: 'shelters',
              label: 'Safe Shelters',
              icon: Tent,
              color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
              action: () => dispatch(setActiveTab('shelters')),
            },
            {
              id: 'sos',
              label: 'SOS Beacon',
              icon: ShieldAlert,
              color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
              action: () => dispatch(setActiveTab('sos')),
            },
            {
              id: 'vouchers',
              label: 'Free Rations',
              icon: PackageCheck,
              color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
              action: () => dispatch(setActiveTab('shelters')),
            },
            {
              id: 'medical',
              label: 'Medical Aid',
              icon: HeartPulse,
              color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
              action: () => dispatch(setActiveTab('shelters')),
            },
            {
              id: 'report',
              label: 'Report Damage',
              icon: Camera,
              color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
              action: () => dispatch(setReportModalOpen(true)),
            },
            {
              id: 'roads',
              label: 'Road Blocks',
              icon: AlertTriangle,
              color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
              action: () => dispatch(setActiveTab('incidents')),
            },
            {
              id: 'offline',
              label: 'Offline Vault',
              icon: Satellite,
              color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
              action: () => dispatch(setSyncModalOpen(true)),
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`quick-action-${item.id}`}
                onClick={item.action}
                className="flex flex-col items-center p-2 rounded-2xl border transition group active:scale-95 bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 shadow-sm"
              >
                <div className={`p-2.5 rounded-xl border mb-1.5 transition-transform group-hover:scale-105 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight leading-tight text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Intervention Hotspots (ShopBack Flash Deals Style Section) */}
      <div className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>Immediate Intervention Hotspots</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </h4>
            <p className="text-[11px] text-neutral-500">Live AI Risk Priority Triage</p>
          </div>

          <button
            onClick={() => dispatch(setActiveTab('map'))}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleOpenZone(zone.id)}
              className="p-3.5 rounded-2xl border cursor-pointer transition bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        zone.severity === 'CRITICAL'
                          ? 'bg-rose-500 text-white'
                          : zone.severity === 'HIGH'
                          ? 'bg-orange-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {zone.severity} RISK
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {zone.district}, {zone.state}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 mt-1">
                    {zone.name}
                  </h5>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono text-lg font-black ${
                      zone.riskScore > 80
                        ? 'text-rose-600 dark:text-rose-400'
                        : zone.riskScore > 60
                        ? 'text-orange-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {zone.riskScore}%
                  </span>
                  <span className="text-[9px] text-neutral-400 block font-medium">Risk Score</span>
                </div>
              </div>

              {/* Mini telemetry row */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Rainfall 24h</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {zone.rainfall24h} mm
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">River Level</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {zone.riverLevel}m
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">At-Risk Pop.</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {zone.populationAtRisk.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Claimable Relief Vouchers (ShopBack Cashback/Voucher Hub) */}
      <div className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
              Government Relief Vouchers & Kits
            </h4>
            <p className="text-[11px] text-neutral-500">Free subsidized emergency provisions</p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            100% Free
          </span>
        </div>

        <div className="space-y-2">
          {vouchers.map((vch) => (
            <div
              key={vch.id}
              className="p-3 rounded-2xl border flex items-center justify-between bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                  {vch.provider}
                </span>
                <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                  {vch.title}
                </h5>
                <p className="text-[11px] text-neutral-500">{vch.value}</p>
                <span className="inline-block text-[10px] font-mono text-neutral-400">
                  Code: {vch.code}
                </span>
              </div>

              <button
                id={`redeem-voucher-${vch.id}`}
                onClick={() => {
                  if (!vch.isRedeemed) {
                    dispatch(redeemVoucher(vch.id));
                    dispatch(
                      showToast({
                        title: 'Voucher Redeemed!',
                        message: `Pass code ${vch.code} shown at relief distribution point. +250 points added!`,
                        type: 'success',
                      })
                    );
                  }
                }}
                disabled={vch.isRedeemed}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  vch.isRedeemed
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-md shadow-emerald-900/20'
                }`}
              >
                {vch.isRedeemed ? 'Claimed' : 'Claim Kit'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Incidents Feed Preview */}
      <div className="px-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            Latest Field Reconnaissance
          </h4>
          <button
            onClick={() => dispatch(setActiveTab('incidents'))}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
          >
            All Reports ({incidents.length})
          </button>
        </div>

        {incidents.slice(0, 2).map((inc) => (
          <div
            key={inc.id}
            className="p-3 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {inc.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-[10px] text-neutral-400">{inc.timestamp}</span>
            </div>
            <h5 className="font-bold text-xs text-neutral-900 dark:text-neutral-100 leading-snug">
              {inc.title}
            </h5>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
              {inc.description}
            </p>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" />
                {inc.locationName}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {inc.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
