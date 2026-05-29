/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Lock, 
  Building, 
  HelpCircle, 
  BookOpen, 
  Cloud,
  FileText,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  profile: UserProfile;
  onUpdateProfile: (updatedData: any) => void;
}

export default function SettingsPage({
  profile,
  onUpdateProfile
}: SettingsPageProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState('preeti@saasfit.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
    });
    setSavedSuccess('Profile parameters secured! Ingesting updates in database.');
    setTimeout(() => {
      setSavedSuccess('');
    }, 4000);
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          Controls Centre
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          System Core Settings & Docs
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Aura portal configuration interface. Verify OAuth permissions, print SaaS guides, modify user profiles, or secure credentials.
        </p>
      </div>

      {savedSuccess && (
        <div id="settings-success" className="mb-6 p-4 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-mono">
          {savedSuccess}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column Settings inputs form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <h3 className="font-display font-semibold text-sm text-white flex items-center gap-1.5 pb-2.5 border-b border-white/5">
              <User className="w-4 h-4 text-lime-400" />
              Adjust Profile Parameters
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">User Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Biological Registered Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-slate-950/60 border border-white/10 text-slate-500 rounded-xl px-3 py-2 text-xs cursor-not-allowed font-mono"
                />
              </div>

              <div className="border-t border-white/5 pt-3.5 space-y-3.5">
                <h4 className="text-xs font-mono uppercase text-slate-400">Credentials Overwrite (Optional)</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-500">Configure new encryption</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="submit-settings-changes-btn"
                className="w-full py-3 bg-lime-400 hover:bg-lime-350 text-slate-950 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Secure Update Parameters
              </button>
            </form>
          </div>
        </div>

        {/* Right column Project Scaling Docs and features summary guide */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <h3 className="font-display font-semibold text-sm text-white flex items-center gap-1.5 pb-2.5 border-b border-white/5">
              <BookOpen className="w-4 h-4 text-lime-400" />
              SaaS Scale Documentation Manual
            </h3>

            <div className="space-y-3.5 text-xs text-slate-350 leading-relaxed">
              <p>Welcome to <strong>ApexFit Platform Controls</strong>. Built to serve boutique gyms, independent personal trainers, and members looking to track statistics online.</p>
              
              <div className="space-y-2">
                <p className="font-semibold text-white uppercase text-[10px] font-mono text-lime-400">Gym Manager Quick Checklist:</p>
                <ul className="space-y-1.5 list-disc list-inside bg-slate-950/60 p-3 rounded-xl border border-white/5 text-[11px] leading-normal">
                  <li>Incorporate physical branch networks under the "Gym Owner" directory.</li>
                  <li>SaaS Monthly Billings automatically calculates client membership earnings.</li>
                  <li>Gym trainers review appointment bookings directly in real-time.</li>
                  <li>Secure credentials and multi-tenant keys are maintained in Settings.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 flex gap-2 items-start text-[11px] leading-normal">
                <Cloud className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-white block">Node Cloud Run Deployments</span>
                  <p className="text-slate-500 font-mono">This system utilizes port <strong className="text-lime-400 font-bold">3000</strong> behind an Nginx reverse proxy routing requests securely to static dist files.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
