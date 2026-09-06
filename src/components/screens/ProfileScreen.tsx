import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Shield,
  Smartphone,
  Moon,
  Sun,
  Database,
  Award,
  PhoneCall,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Sliders,
  LogOut,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setUserRole, addEmergencyContact } from '../../store/slices/userSlice';
import { setThemeMode, setPlatform, setSyncModalOpen, showToast } from '../../store/slices/uiSlice';
import { DevicePlatform, ThemeMode, UserRole } from '../../types';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, vouchers } = useAppSelector((s) => s.user);
  const themeMode = useAppSelector((s) => s.ui.themeMode);
  const platform = useAppSelector((s) => s.ui.platform);

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

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
    <div className="w-full pb-24 select-none space-y-4 px-4 pt-2">
      {/* Profile Header */}
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
              Score: {profile.safetyScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher (Citizen vs NDRF Responder) */}
      <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Active App Role
          </span>
          <span className="text-[11px] text-neutral-400">SIH Cross-Role Architecture</span>
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
                    title: `Switched to ${r === 'citizen' ? 'Citizen App' : 'Responder Tactical'}`,
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

      {/* Device & Appearance Settings */}
      <div className="p-4 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Device & Theme Options
        </h4>

        {/* Theme mode toggle */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Appearance Mode
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
            Device Mockup Frame
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
              AsyncStorage Local Cache
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
          Application uses React Native AsyncStorage abstraction for persistent offline storage.
          All reports, routes, and credentials persist across browser reloads.
        </p>
      </div>

      {/* Emergency Contacts Manager */}
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
          <form onSubmit={handleAddContactSubmit} className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2 text-xs">
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
                <span className="font-bold text-neutral-900 dark:text-neutral-100 block">{c.name}</span>
                <span className="text-[11px] text-neutral-500">
                  {c.relationship} • {c.phone}
                </span>
              </div>
              <a href={`tel:${c.phone}`} className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                <PhoneCall className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
