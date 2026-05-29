/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Dumbbell, 
  TrendingUp, 
  LineChart, 
  Users, 
  DollarSign, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Activity,
  UserCheck,
  Server,
  User,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { UserProfile, GymBranch, TrainerProfile, Booking, LoggedWorkout, SaaSAnalytics } from '../types';

interface DashboardsProps {
  currentRole: string;
  activeProfile: UserProfile;
  gyms: GymBranch[];
  trainers: TrainerProfile[];
  bookings: Booking[];
  loggedWorkouts: LoggedWorkout[];
  onConfirmBooking: (bookingId: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
  analytics: SaaSAnalytics;
  setActiveTab: (tab: string) => void;
}

export default function Dashboards({
  currentRole,
  activeProfile,
  gyms,
  trainers,
  bookings,
  loggedWorkouts,
  onConfirmBooking,
  analytics,
  setActiveTab
}: DashboardsProps) {
  
  // Ensure we render the correct portion based on active role toggle
  if (currentRole === 'Admin') {
    return <AdminDashboard analytics={analytics} gyms={gyms} />;
  } else if (currentRole === 'Gym Owner') {
    return <GymOwnerDashboard analytics={analytics} gyms={gyms} trainers={trainers} />;
  } else if (currentRole === 'Trainer') {
    return <TrainerDashboard bookings={bookings} trainers={trainers} onConfirmBooking={onConfirmBooking} />;
  } else {
    return (
      <UserDashboard 
        profile={activeProfile} 
        gyms={gyms} 
        loggedWorkouts={loggedWorkouts} 
        bookings={bookings}
        setActiveTab={setActiveTab}
      />
    );
  }
}

/* ==========================================================================
   1. USER / MEMBER DASHBOARD SUBCOMPONENT
   ========================================================================== */
function UserDashboard({
  profile,
  gyms,
  loggedWorkouts,
  bookings,
  setActiveTab
}: {
  profile: UserProfile;
  gyms: GymBranch[];
  loggedWorkouts: LoggedWorkout[];
  bookings: Booking[];
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="text-white font-sans space-y-8 text-left pb-16">
      {/* Quick stats greeting row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 backdrop-blur-md p-6 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-14 h-14 rounded-2xl object-cover border border-blue-500/50"
          />
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-base sm:text-lg text-white">Welcome Back, {profile.name}!</h2>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              <span className="flex items-center text-blue-400 font-mono font-bold">
                <Flame className="w-3.5 h-3.5 mr-1 text-orange-400 animate-pulse" />
                {profile.dailyStreak}-Day Streak Run
              </span>
              <span>•</span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-mono tracking-wider font-semibold text-blue-400">
                SaaS Member #{profile.activePlanId ? 'PRO-ACTIVE' : 'FREE-STARTER'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end w-full md:w-auto" id="user-quick-actions">
          <button
            onClick={() => setActiveTab('workout')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase cursor-pointer shadow-lg shadow-blue-600/25 transition-all"
          >
            Create AI Workout
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider uppercase cursor-pointer transition-all"
          >
            Log Nutrients
          </button>
        </div>
      </div>

      {/* Grid: Unlocked level metrics and progress lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (8): XP progress and visual charts SVGs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gamified stats bento */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Cumulative XP</span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-blue-400 block">{profile.xpPoints} XP</p>
              <p className="text-[10px] text-slate-500 font-mono">Next rewards unlocks at 5,000 XP</p>
            </div>
            
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Completed Workouts</span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-white block">{profile.workoutsCompleted} Sessions</p>
              <p className="text-[10px] text-slate-500 font-mono">Target goal: 50 sessions minimum</p>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Membership Status</span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-amber-400 block uppercase">Apex Pro</p>
              <p className="text-[10px] text-slate-500 font-mono">Expires: {profile.planExpiryDate || 'Unlimited'}</p>
            </div>
          </div>

          {/* Activity Curves (Custom Animated SVG Charts representing completed workouts progress) */}
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
              <div>
                <h3 className="font-display font-medium text-sm text-white">Workout Energy Expenditure Curve</h3>
                <p className="text-[10px] text-slate-400">Daily calorie burn logs (kcal)</p>
              </div>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>

            {/* Custom SVG line chart with real high-contrast gradient fillers */}
            <div className="h-44 flex items-center justify-center relative bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Filled Area below curve */}
                <path
                  d="M 10,100 C 60,95 110,80 160,85 C 210,95 260,40 310,50 C 360,65 410,25 460,30 L 460,110 L 10,110 Z"
                  fill="url(#curveAreaGrad)"
                />

                {/* Simulated Chart Line vectors */}
                <path
                  d="M 10,100 C 60,95 110,80 160,85 C 210,95 260,40 310,50 C 360,65 410,25 460,30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />

                {/* Glowing target nodes */}
                <circle cx="310" cy="50" r="5" fill="#3B82F6" stroke="#050506" strokeWidth="1.5" className="shadow-[0_0_8px_#3B82F6]" />
                <circle cx="460" cy="30" r="5" fill="#10B981" stroke="#050506" strokeWidth="1.5" className="shadow-[0_0_8px_#10B981]" />
              </svg>

              {/* Day Labels */}
              <div className="absolute bottom-1 inset-x-4 flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                <span>Mon (350kcal)</span>
                <span>Wed (480kcal)</span>
                <span>Fri (540kcal)</span>
                <span>Sun (620kcal)</span>
              </div>
            </div>
          </div>

          {/* Recent Workout Logs List */}
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2">
              Recent Training Session Journals
            </span>
            <div className="space-y-3" id="dashboard-recent-sessions">
              {loggedWorkouts.length === 0 ? (
                <p className="text-xs text-slate-500">No workout records logged yet. Head to AI routine builder!</p>
              ) : (
                loggedWorkouts.slice(0, 3).map((log) => (
                  <div key={log.id} className="bg-black/30 p-3.5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">{log.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Date: {log.date} | Duration: {log.durationMinutes} min | Cal: <strong className="text-blue-400">{log.caloriesBurned} kcal</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {log.exercises.slice(0, 2).map((ex, i) => (
                        <span key={i} className="text-[9px] font-mono bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded">
                          {ex.name} ({ex.sets}x{ex.reps})
                        </span>
                      ))}
                      {log.exercises.length > 2 && <span className="text-[9px] font-mono text-slate-500">+{log.exercises.length - 2} more</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column (4): Bookings scheduled & Unlocked Achievements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Scheduled Appointments logs */}
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2">
              Active Trainer Appointments
            </span>
            <div className="space-y-3.5" id="dashboard-bookings-logs">
              {bookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled').map((book) => (
                <div key={book.id} className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">Coach: {book.trainerName}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                      book.status === 'Confirmed' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>🗓 Date: {book.date}</span>
                    <span>⏱ Hours Slot: {book.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamified unlocked medals & streak stats */}
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2">
              My Profile Achievements ({profile.badges ? profile.badges.length : 0})
            </span>
            <div className="grid grid-cols-2 gap-2.5" id="user-badges-showcase">
              {profile.badges?.map((badge, i) => (
                <div key={i} className="p-3 bg-black/30 border border-white/5 rounded-2xl flex flex-col items-center text-center space-y-1">
                  <Award className="w-5 h-5 text-amber-400 fill-amber-400/10" />
                  <span className="text-[9px] font-mono leading-tight font-semibold text-slate-300">{badge}</span>
                  <span className="text-[8px] text-slate-500 font-mono">Level UP Unlock</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   2. CERTIFIED COACH / TRAINER DASHBOARD SUBCOMPONENT
   ========================================================================== */
function TrainerDashboard({
  bookings,
  trainers,
  onConfirmBooking
}: {
  bookings: Booking[];
  trainers: TrainerProfile[];
  onConfirmBooking: (bookingId: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
}) {
  return (
    <div className="text-white font-sans space-y-8 text-left pb-16">
      {/* Overview metric bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Coach Assigned Clients</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-blue-400 block">24 Active Athletes</p>
          <p className="text-[10px] text-slate-500 font-mono">Streak milestones: 3 athletes qualified</p>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Appointment Hours Logs</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-blue-400 block">18 Scheduled Slots</p>
          <p className="text-[10px] text-slate-500 font-mono">Total hours this week: ~22.5</p>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-2">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Overall Coach Ratings</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-amber-400 block flex items-center gap-1">⭐ 4.9 / 5.0</p>
          <p className="text-[10px] text-slate-500 font-mono">Verified student reviews: 34 stars</p>
        </div>
      </div>

      {/* Booking slots configuration and clients tracking schedules list */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="glass-panel p-5 border border-white/10 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h3 className="font-display font-medium text-sm text-white">Coach Class Registry & Schedules</h3>
              <p className="text-[10px] text-slate-400 font-mono">Confirm, complete, or reject personal training appointments</p>
            </div>
            <UserCheck className="w-4 h-4 text-blue-400" />
          </div>

          <div className="divide-y divide-white/5" id="trainer-bookings-list">
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 p-4">No client slot requests registered yet.</p>
            ) : (
              bookings.map((book) => (
                <div key={book.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Client: Preeti Ranjan (User)</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                        book.status === 'Confirmed' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      📆 Appointment Date: {book.date} | ⏱ Time Hour: {book.timeSlot} | Focus: Personal Training
                    </p>
                  </div>

                  {/* Actions buttons */}
                  {book.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onConfirmBooking(book.id, 'Confirmed')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase font-bold cursor-pointer"
                        id={`confirm-booking-btn-${book.id}`}
                      >
                        ✔ Confirm
                      </button>
                      <button
                        onClick={() => onConfirmBooking(book.id, 'Cancelled')}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase font-bold cursor-pointer"
                        id={`cancel-booking-btn-${book.id}`}
                      >
                        ✘ Reject
                      </button>
                    </div>
                  )}

                  {book.status === 'Confirmed' && (
                    <button
                      onClick={() => onConfirmBooking(book.id, 'Completed')}
                      className="bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 px-4 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase font-bold cursor-pointer"
                      id={`complete-booking-btn-${book.id}`}
                    >
                      Complete Session ✓
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. GYM CORPORATE OWNER DASHBOARD SUBCOMPONENT
   ========================================================================== */
function GymOwnerDashboard({
  analytics,
  gyms,
  trainers
}: {
  analytics: SaaSAnalytics;
  gyms: GymBranch[];
  trainers: TrainerProfile[];
}) {
  return (
    <div className="text-white font-sans space-y-8 text-left pb-16">
      {/* KPI summaries cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Corporate Holdings Earnings</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">${analytics.totalRevenue || 5800}</p>
          <p className="text-[9px] text-emerald-400 font-mono">↑ 14.5% vs last week</p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Franchise Branches</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">{gyms.length} Local Studios</p>
          <p className="text-[9px] text-slate-500 font-mono">S.F. Area Coverage</p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Subscribed Members</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">45 Total Athletes</p>
          <p className="text-[9px] text-blue-400 font-mono">Streak completed counts: 22</p>
        </div>
        <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 text-left space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Hired Personal Trainer payrolls</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">{trainers.length} Pro Coaches</p>
          <p className="text-[9px] text-amber-400 font-mono">Average review: ⭐ 4.9 stars</p>
        </div>
      </div>

      {/* Branch by Branch performance split columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Performance Metrics list (8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 glass-panel rounded-3xl border border-white/5 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2">
              Corporate Branch Revenue Performance
            </span>
            
            <div className="divide-y divide-white/5" id="owner-branch-revenue">
              {analytics.gymPerformance?.map((performance, i) => (
                <div key={i} className="py-3.5 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <p className="text-white font-bold text-sm">{performance.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      Subscribed Membership Tiers: <b className="text-white">{performance.membersCount} active</b>
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-blue-400 font-bold text-base">${performance.monthlyEarnings}</p>
                    <p className="text-[9px] text-slate-500">Gross Monthly Holdings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Trainers Roster listing Summary (4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 text-left">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2">
              Hired Trainers Pool
            </span>
            <div className="space-y-3.5" id="owner-trainers-list">
              {trainers.map((train) => (
                <div key={train.id} className="bg-black/30 p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={train.avatar}
                      alt={train.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-white font-semibold">{train.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{train.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-500/20">
                      ⭐ {train.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. PLATFORM ADMINISTRATOR DASHBOARD SUBCOMPONENT
   ========================================================================== */
function AdminDashboard({
  analytics,
  gyms
}: {
  analytics: SaaSAnalytics;
  gyms: GymBranch[];
}) {
  return (
    <div className="text-white font-sans space-y-8 text-left pb-16">
      {/* SaaS High Key stats parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Global Platform Capital</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-blue-400">${analytics.totalRevenue + 12000}</p>
          <p className="text-[9px] text-emerald-400 font-mono">Verified Ledger Transactions</p>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Total SaaS Gym Owners</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">4 Gym Networks</p>
          <p className="text-[9px] text-slate-550 font-mono">Pending Approvals: 0</p>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Cumulative Trainer Accounts</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">12 Coaches</p>
          <p className="text-[9px] text-slate-550 font-mono">Verified Credentials: Certified</p>
        </div>
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Cumulative Active Subscriptions</span>
          <p className="font-mono text-xl sm:text-2xl font-bold text-white">{analytics.activeSubscriptionsCount * 14} Members</p>
          <p className="text-[9px] text-slate-550 font-mono">Weekly cancel rate: 0.12%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: System Logs & Server audit trails List (8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 glass-panel rounded-3xl border border-white/5 space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-slate-400 block border-b border-white/5 pb-2.5">
              Secure Sandbox System Audit Logs (Telemetry)
            </span>
            <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-[10px] text-slate-400" id="admin-telemetry-logs">
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between">
                <span className="text-blue-400">[SYSTEM]</span>
                <span className="text-slate-300">Initialized Express dev pipeline on port 3000... success</span>
                <span className="text-slate-500">2026-05-29, 02:57:14Z</span>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between">
                <span className="text-blue-400">[SYSTEM]</span>
                <span className="text-slate-300 font-sans opacity-90">Data Serialization state generated: db-saas.json ... success</span>
                <span className="text-slate-500">2026-05-29, 02:58:20Z</span>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between">
                <span className="text-teal-400 font-bold">[GEMINI]</span>
                <span className="text-slate-300">POST /api/workouts/ai-generate model: gemini-3.5-flash ... 200 OK</span>
                <span className="text-slate-500">Today, 09:12 AM</span>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between">
                <span className="text-teal-400 font-bold">[GEMINI]</span>
                <span className="text-slate-300">POST /api/diet/ai-generate model: gemini-3.5-flash ... 200 OK</span>
                <span className="text-slate-500">Today, 08:15 AM</span>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/5 flex justify-between">
                <span className="text-rose-400 font-bold">[STRIPE]</span>
                <span className="text-slate-300">Created Payment intent token (Holdings amount $49)... complete</span>
                <span className="text-slate-500">Today, 07:12 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: SaaS pricing allocations & system configurations (4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Platform Settings</span>
              <Server className="w-4 h-4 text-blue-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between bg-black/30 p-2.5 rounded border border-white/5">
                <span className="text-slate-500">Express server bound:</span>
                <span className="font-mono text-white">0.0.0.0</span>
              </div>
              <div className="flex justify-between bg-black/30 p-2.5 rounded border border-white/5">
                <span className="text-slate-500">Active Ingress Port:</span>
                <span className="font-mono text-blue-400 font-bold">3000</span>
              </div>
              <div className="flex justify-between bg-black/30 p-2.5 rounded border border-white/5">
                <span className="text-slate-500">Sentry Tracking:</span>
                <span className="font-mono text-emerald-400 font-bold font-mono">HEALTHY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
