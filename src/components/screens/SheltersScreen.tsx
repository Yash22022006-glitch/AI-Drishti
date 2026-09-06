import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Tent,
  User,
  Navigation,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Users,
  ShieldCheck,
  Package,
  Droplet,
  HeartPulse,
  BedDouble,
  Award,
  Shield,
  Moon,
  Sun,
  Database,
  Plus,
  Trash2,
  Check,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedShelterId, claimShelterToken } from '../../store/slices/sheltersSlice';
import { setRouteModalOpen, showToast, setThemeMode, setPlatform, setSyncModalOpen } from '../../store/slices/uiSlice';
import { redeemVoucher, setUserRole, addEmergencyContact } from '../../store/slices/userSlice';
import { DevicePlatform, ThemeMode, UserRole } from '../../types';

interface SheltersScreenProps {
  initialSubTab?: 'shelters' | 'profile';
}

export const SheltersScreen: React.FC<SheltersScreenProps> = ({ initialSubTab = 'shelters' }) => {
  const dispatch = useAppDispatch();
  const shelters = useAppSelector((s) => s.shelters.items);
  const { profile, vouchers } = useAppSelector((s) => s.user);
  const themeMode = useAppSelector((s) => s.ui.themeMode);
  const platform = useAppSelector((s) => s.ui.platform);

  const [activeSubTab, setActiveSubTab] = useState<'shelters' | 'profile'>(initialSubTab);

  // Add Contact Form State
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const handleOpenRoute = (shelterId: string) => {
    dispatch(setSelectedShelterId(shelterId));
    dispatch(setRouteModalOpen(true));
  };

  const handleClaim = (shelterId: string, shelterName: string) => {
    dispatch(claimShelterToken(shelterId));
    dispatch(
      showToast({
        title: 'Bed & Rations Reserved',
        message: `Priority token generated for ${shelterName}. Valid for 24 hours.`,
        type: 'success',
      })
    );
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;
    dispatch(
      addEmergencyContact({
        name: newContactName,
        relationship: newContactRel || 'Family',
        phone: newContactPhone,
      })
    );
    setNewContactName('');
    setNewContactRel('');
    setNewContactPhone('');
    setShowAddContact(false);
    dispatch(
      showToast({
        title: 'Emergency Contact Added',
        message: 'Saved to local profile and persisted in AsyncStorage.',
        type: 'success',
      })
    );
  };

  return (
    <div className="w-full pb-20 select-none space-y-3 px-4 pt-2">
      {/* Header & Sub-Tab Switcher */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              {activeSubTab === 'shelters' ? (
                <>
                  <Tent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Government Shelters & Havens</span>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Citizen Profile & Relief ID</span>
                </>
              )}
            </h3>
            <p className="text-[11px] text-neutral-500">
              {activeSubTab === 'shelters'
                ? 'Real-time shelter capacity, ration stocks, and safe beds'
                : 'Emergency ICE medical data, contacts, and relief wallet'}
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {activeSubTab === 'shelters' ? `${shelters.length} Safe Camps` : `Score: ${profile.safetyScore}%`}
          </span>
        </div>

        {/* 2-Segment Control inside Shelters section */}
        <div className="flex p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 shadow-inner">
          <button
            id="shelters-subtab-camps"
            onClick={() => setActiveSubTab('shelters')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'shelters'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Tent className="w-4 h-4" />
            <span>Safe Shelters</span>
          </button>
          <button
            id="shelters-subtab-profile"
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'profile'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen Profile & ID</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'shelters' ? (
          /* ==================== SHELTERS SUB-TAB ==================== */
          <motion.div
            key="shelters-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {/* Citizen Relief Summary Banner */}
            <div
              onClick={() => setActiveSubTab('profile')}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-neutral-900/10 border border-emerald-500/20 flex items-center justify-between cursor-pointer hover:border-emerald-500/40 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block leading-tight">
                    {profile.name} • {profile.bloodGroup}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Relief Balance: ₹{profile.reliefWalletBalance.toLocaleString()} • Tap for Profile & ICE
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                Profile →
              </span>
            </div>

            {/* Shelter List */}
            {shelters.map((shelter) => {
              const occupancyPercent = Math.round(
                (shelter.currentOccupancy / shelter.capacity) * 100
              );
              const isNearlyFull = occupancyPercent >= 90;

              return (
                <motion.div
                  key={shelter.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {shelter.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-neutral-500">
                          {shelter.distanceKm} km away ({shelter.travelTimeMinutes} min walk)
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                        {shelter.name}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1">{shelter.address}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono text-base font-black ${
                          isNearlyFull ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {occupancyPercent}%
                      </span>
                      <span className="block text-[9px] text-neutral-400">Capacity Full</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                      <span>
                        Occupied: <strong>{shelter.currentOccupancy}</strong> / {shelter.capacity}
                      </span>
                      <span>{shelter.capacity - shelter.currentOccupancy} Beds Available</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isNearlyFull ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stocked Emergency Supplies Grid */}
                  <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 text-center text-xs border border-neutral-100 dark:border-neutral-800/80">
                    <div>
                      <Package className="w-3.5 h-3.5 mx-auto text-amber-500 mb-0.5" />
                      <span className="font-mono font-bold text-[11px] block">
                        {shelter.supplies.foodPacks}
                      </span>
                      <span className="text-[9px] text-neutral-400">Rations</span>
                    </div>
                    <div>
                      <Droplet className="w-3.5 h-3.5 mx-auto text-sky-500 mb-0.5" />
                      <span className="font-mono font-bold text-[11px] block">
                        {shelter.supplies.waterLiters}L
                      </span>
                      <span className="text-[9px] text-neutral-400">Water</span>
                    </div>
                    <div>
                      <HeartPulse className="w-3.5 h-3.5 mx-auto text-rose-500 mb-0.5" />
                      <span className="font-mono font-bold text-[11px] block">
                        {shelter.supplies.medicalKits}
                      </span>
                      <span className="text-[9px] text-neutral-400">First Aid</span>
                    </div>
                    <div>
                      <BedDouble className="w-3.5 h-3.5 mx-auto text-purple-500 mb-0.5" />
                      <span className="font-mono font-bold text-[11px] block">
                        {shelter.supplies.dryBeds}
                      </span>
                      <span className="text-[9px] text-neutral-400">Cots</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`shelter-route-${shelter.id}`}
                      onClick={() => handleOpenRoute(shelter.id)}
                      className="flex-1 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/20"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate Safe Route</span>
                    </button>

                    <button
                      id={`claim-token-${shelter.id}`}
                      onClick={() => handleClaim(shelter.id, shelter.name)}
                      disabled={shelter.claimedToken || isNearlyFull}
                      className={`px-3.5 py-2 rounded-xl font-bold text-xs transition active:scale-95 ${
                        shelter.claimedToken
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-default'
                          : isNearlyFull
                          ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90'
                      }`}
                    >
                      {shelter.claimedToken ? 'Reserved ✓' : 'Reserve Bed'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* ==================== CITIZEN PROFILE & ID SUB-TAB ==================== */
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-3.5"
          >
            {/* Profile Hero Card */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                {profile.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {profile.name}
                </h3>
                <p className="text-xs text-neutral-500">{profile.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                    Blood: {profile.bloodGroup}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    Safety: {profile.safetyScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Relief Fund Balance & Claimed Vouchers */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                    Disaster Relief Wallet
                  </h4>
                </div>
                <span className="font-mono text-sm font-black text-rose-600 dark:text-rose-400">
                  ₹{profile.reliefWalletBalance.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1.5">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                        {v.title}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Code: {v.code} • {v.value}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!v.isRedeemed) {
                          dispatch(redeemVoucher(v.id));
                          dispatch(
                            showToast({
                              title: 'Voucher Redeemed',
                              message: `${v.title} barcode scanned for distribution counter.`,
                              type: 'success',
                            })
                          );
                        }
                      }}
                      disabled={v.isRedeemed}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
                        v.isRedeemed
                          ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-default'
                          : 'bg-rose-600 text-white hover:bg-rose-500 active:scale-95'
                      }`}
                    >
                      {v.isRedeemed ? 'Redeemed' : 'Redeem'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Switcher (Citizen vs NDRF Responder) */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Active App Role
                </span>
                <span className="text-[11px] text-neutral-400">SIH Cross-Role System</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {(['citizen', 'responder'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    id={`switch-role-${r}`}
                    onClick={() => {
                      dispatch(setUserRole(r));
                      dispatch(
                        showToast({
                          title: `Switched to ${
                            r === 'citizen' ? 'Citizen App' : 'Responder Tactical'
                          }`,
                          message:
                            r === 'citizen'
                              ? 'Access flood radar, shelters, emergency SOS, and relief vouchers.'
                              : 'Access incident triage, mission dispatch, and field logs.',
                          type: 'info',
                        })
                      );
                    }}
                    className={`py-2.5 px-3 rounded-2xl border transition capitalize ${
                      profile.role === r
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-950/20'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-750'
                    }`}
                  >
                    {r === 'citizen' ? 'Citizen Mobile' : 'NDRF Responder'}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Contacts (ICE Circle) */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Emergency Contacts ({profile.emergencyContacts.length})
                </h4>
                <button
                  onClick={() => setShowAddContact(!showAddContact)}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contact</span>
                </button>
              </div>

              {showAddContact && (
                <form
                  onSubmit={handleAddContactSubmit}
                  className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs"
                >
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Relationship (e.g. Spouse)"
                      value={newContactRel}
                      onChange={(e) => setNewContactRel(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      placeholder="Phone (+91...)"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddContact(false)}
                      className="px-3 py-1 rounded-lg text-neutral-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-1.5">
                {profile.emergencyContacts.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 text-xs border border-neutral-100 dark:border-neutral-800"
                  >
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {c.relationship} • {c.phone}
                      </span>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                    >
                      <PhoneCall className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Appearance Settings */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Appearance & Device Frame
              </h4>

              {/* Theme mode toggle */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Theme Mode
                </span>
                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                  {(['dark', 'light'] as ThemeMode[]).map((m) => (
                    <button
                      key={m}
                      id={`theme-btn-${m}`}
                      onClick={() => dispatch(setThemeMode(m))}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold capitalize transition ${
                        themeMode === m
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      {m === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Device frame preview toggle */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Device Mockup
                </span>
                <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-[11px]">
                  {(['ios', 'android', 'fullscreen'] as DevicePlatform[]).map((p) => (
                    <button
                      key={p}
                      id={`device-platform-${p}`}
                      onClick={() => dispatch(setPlatform(p))}
                      className={`px-2.5 py-1 rounded-lg font-bold uppercase transition ${
                        platform === p
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      {p === 'ios' ? 'iOS' : p === 'android' ? 'Pixel' : 'Full'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AsyncStorage Persistence Status */}
            <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-500" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
                    AsyncStorage Persistence
                  </h4>
                </div>
                <button
                  id="profile-open-sync-inspector"
                  onClick={() => dispatch(setSyncModalOpen(true))}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Inspect Keys
                </button>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Persistent storage backed by AsyncStorage mock. State is cached offline and debounced
                automatically.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
