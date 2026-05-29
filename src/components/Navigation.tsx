/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Dumbbell, 
  User, 
  Shield, 
  UserCheck, 
  Building, 
  Bell, 
  ChevronDown,
  Globe,
  DollarSign
} from 'lucide-react';
import { UserRole } from '../types';

interface NavigationProps {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRoleSwitch: (role: UserRole) => void;
  userName: string;
  userAvatar: string;
}

export default function Navigation({
  currentRole,
  activeTab,
  setActiveTab,
  onRoleSwitch,
  userName,
  userAvatar
}: NavigationProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const rolesList: UserRole[] = ['User', 'Trainer', 'Gym Owner', 'Admin'];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'Gym Owner': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'Trainer': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-lime-500/20 text-lime-400 border border-lime-500/30';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin': return <Shield className="w-3.5 h-3.5 mr-1" />;
      case 'Gym Owner': return <Building className="w-3.5 h-3.5 mr-1" />;
      case 'Trainer': return <UserCheck className="w-3.5 h-3.5 mr-1" />;
      default: return <User className="w-3.5 h-3.5 mr-1" />;
    }
  };

  // Menu lists based on current user role for active dashboard tabs
  const getSubTabs = () => {
    const defaultTabs = [
      { id: 'landing', label: 'Explore' },
      { id: 'gyms', label: 'Find Gyms' },
      { id: 'pricing', label: 'Membership' },
      { id: 'trainers', label: 'Coaches' },
      { id: 'workout', label: 'AI Routine' },
      { id: 'diet', label: 'AI Diet' },
      { id: 'community', label: 'Feed & Standings' },
      { id: 'chat', label: 'Chat Help' },
    ];
    return defaultTabs;
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-xl px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')} 
          className="flex items-center gap-2 cursor-pointer group"
          id="nav-logo-btn"
        >
          <div className="bg-gradient-to-br from-blue-500 to-emerald-400 p-2 rounded-xl text-black group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <Dumbbell className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
              APEX<span className="font-light opacity-50">FIT</span>
            </span>
            <span className="hidden sm:inline bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest text-white/30 font-semibold border border-white/5 ml-2">
              SaaS Platform
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/45 p-1 rounded-full border border-white/5" id="main-nav-bar">
          {getSubTabs().map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`nav-${tab.id}`}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isSelected ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeNavBG"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full shadow-lg shadow-black/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Role Switcher, Notifications, User Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick Dashboard Toggle Button */}
          <button
            onClick={() => setActiveTab('dashboard')}
            id="nav-dashboard-shortcut"
            className={`hidden md:flex items-center gap-1 text-[11px] font-mono px-3 py-1.5 rounded-lg border uppercase tracking-wider transition-colors font-medium ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white border-blue-500 font-bold shadow-lg shadow-blue-500/25'
                : 'bg-white/5 hover:bg-white/10 text-blue-400 border-white/5'
            }`}
          >
            Dashboard
          </button>

          {/* SaaS Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setDropdownOpen(!dropdownOpen); setNotificationsOpen(false); }}
              id="role-dropdown-trigger"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white hover:bg-slate-800 transition-all cursor-pointer shadow-md"
            >
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider hidden sm:inline">Mock Role:</span>
              <span className={`flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${getRoleBadgeColor(currentRole)}`}>
                {getRoleIcon(currentRole)}
                {currentRole}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div 
                id="role-dropdown-menu" 
                className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 z-50 text-xs"
              >
                <div className="px-3 py-1.5 border-b border-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Demonstrate Dashboards
                </div>
                {rolesList.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleSwitch(role);
                      setDropdownOpen(false);
                      // Auto route to active panel
                      setActiveTab('dashboard');
                    }}
                    id={`role-switch-to-${role.toLowerCase().replace(" ", "-")}`}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                      currentRole === role ? 'bg-white/5 text-blue-400 font-medium' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center">
                      {getRoleIcon(role)}
                      {role === 'User' ? 'Member (Preeti)' : role}
                    </span>
                    {currentRole === role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Alerts Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setNotificationsOpen(!notificationsOpen); setDropdownOpen(false); }}
              id="alerts-bell-btn"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all relative cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-md animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-md" />
            </button>

            {notificationsOpen && (
              <div 
                id="alerts-bell-menu" 
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 text-xs"
              >
                <div className="px-4 py-2.5 border-b border-white/5 font-display font-medium text-white flex items-center justify-between">
                  <span>SaaS Notifications</span>
                  <span className="text-[10px] bg-lime-500/20 text-lime-400 px-1.5 py-0.5 rounded font-mono font-medium">2 Active</span>
                </div>
                <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-white/5 transition-colors">
                    <p className="text-white font-medium mb-0.5">🏋️ Class Starting in 1 Hour</p>
                    <p className="text-[11px] text-slate-400 leading-normal">Your personal training with Coach Elena Grace is confirmed for 11:00 AM dynamic squats recovery.</p>
                    <span className="text-[9px] font-mono text-slate-500 block mt-1">Today, 09:12 AM</span>
                  </div>
                  <div className="p-3 hover:bg-white/5 transition-colors">
                    <p className="text-white font-medium mb-0.5">🔥 Daily Streak Secured!</p>
                    <p className="text-[11px] text-slate-400 leading-normal">Awesome work! You logged sweet potato and grilled turkey dinner, securing your 5-day active health streak.</p>
                    <span className="text-[9px] font-mono text-slate-500 block mt-1">Today, 08:32 AM</span>
                  </div>
                </div>
                <div 
                  onClick={() => { setNotificationsOpen(false); setActiveTab('settings'); }} 
                  className="px-4 py-2 text-center text-[10px] font-medium text-slate-400 hover:text-lime-400 border-t border-white/5 cursor-pointer bg-slate-950/45 transition-colors"
                >
                  Configure Notification Settings
                </div>
              </div>
            )}
          </div>

          {/* User Profile Thumbnail */}
          <div 
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2 cursor-pointer border border-white/10 pl-1.5 pr-2.5 py-1 rounded-full bg-slate-950/40 hover:bg-slate-900 transition-all text-left"
            id="nav-user-profile-btn"
          >
            <img
              src={userAvatar}
              alt="Avatar Profile"
              className="w-6 h-6 rounded-full object-cover border border-blue-500/50"
            />
            <div className="hidden xl:block">
              <p className="text-[10px] font-semibold text-slate-200 truncate max-w-[80px leading-none]">{userName}</p>
              <p className="text-[8px] font-mono text-slate-500">{currentRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Menu */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto mt-3 py-1.5 border-t border-white/5 whitespace-nowrap scrollbar-none">
        {getSubTabs().map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              id={`nav-mobile-${tab.id}`}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors flex items-center gap-1.5 ${
                isSelected ? 'bg-white/10 text-white border border-white/10 font-semibold' : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {isSelected && <span className="w-1 h-1 rounded-full bg-blue-500"></span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
