/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Zap, 
  Search, 
  Trophy, 
  MapPin, 
  Calendar, 
  Dumbbell, 
  Sparkles, 
  Users, 
  Heart,
  TrendingUp,
  LineChart
} from 'lucide-react';
import { GymBranch, Challenge } from '../types';

interface LandingPageProps {
  gyms: GymBranch[];
  challenges: Challenge[];
  onJoinChallenge: (id: string) => void;
  setActiveTab: (tab: string) => void;
  userXp: number;
}

export default function LandingPage({
  gyms,
  challenges,
  onJoinChallenge,
  setActiveTab,
  userXp
}: LandingPageProps) {
  return (
    <div className="text-white min-h-screen font-sans bg-transparent pb-20 relative">
      {/* Hero Visual Section */}
      <section className="relative pt-12 md:pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto" id="hero-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-mono tracking-wide font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Next-Generation Intelligent Fitness Ecosystem</span>
            </div>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-white">
              The Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
                SaaS Gym Platform
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Experience the future of personal fitness engineering. Aura AI models synthesize bespoke hyper-personalized workout schedules, advanced caloric diet plans, and real-time class booking schedules.
            </p>

            {/* Core Statistics Cards */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-5 max-w-md">
              <div>
                <p className="font-mono font-bold text-2xl text-blue-400">12,400+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Active Athletes</p>
              </div>
              <div>
                <p className="font-mono font-bold text-2xl text-blue-400">140+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Premium Clubs</p>
              </div>
              <div>
                <p className="font-mono font-bold text-2xl text-blue-400">98.6%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Success Posture</p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setActiveTab('gyms')}
                id="hero-explore-gyms-btn"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-white" />
                Find Gyms Near You
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                id="hero-membership-btn"
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 px-7 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm active:scale-95 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                Get Premium Membership
              </button>
            </div>
          </div>

          {/* Right Column Interactive Applet Render */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur-[20px] opacity-20 group-hover:opacity-30 transition duration-1000" />
            
            <div className="relative glass-panel rounded-3xl p-6 border border-white/10 shadow-y shadow-black/40 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3B82F6]" />
                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">Apex System Sandbox Hub</span>
                </div>
                <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">LIVE ACTIVE API</span>
              </div>

              {/* Floating Widget Live Stats */}
              <div className="space-y-4">
                <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5 flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-xl text-blue-400"><TrendingUp className="w-4 h-4" /></div>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400">Current XP Rewards</p>
                      <p className="text-sm font-semibold text-white font-mono">{userXp} Points</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-900 px-2.5 py-1 rounded text-slate-400">Rank #4</span>
                </div>

                <div className="bg-slate-950/50 p-3 rounded-2xl border border-white/5 space-y-2 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Daily Water Target (2L)</span>
                    <span className="text-blue-400 font-mono font-semibold">1,250 ml</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '62.5%' }} />
                  </div>
                </div>

                {/* AI Interactive Prompt Prompting Preview */}
                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 text-left space-y-1">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span className="text-xs font-semibold">Gemini Training Prompt</span>
                  </div>
                  <p className="text-xs italic text-slate-300 leading-normal">
                    "Synthesize a hypertrophy barbell lower plan omitting hamstring stress due to a minor joint restriction... Include optimal warmups."
                  </p>
                  <p className="text-[10px] text-slate-500 text-right mt-1.5 font-mono">— Ready on AI page</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms Sections Preview */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto" id="branches-landing-section">
        <div className="flex items-end justify-between mb-8">
          <div className="text-left">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
              SaaS Multi-Tenant Premium Hubs
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Connect seamlessly with smart QR entry points and cross-branch synchronization levels.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('gyms')}
            id="view-all-gyms-btn"
            className="text-xs font-mono font-medium text-blue-400 hover:text-white transition-colors"
          >
            Browse All Branches (4) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gyms.slice(0, 4).map((gym) => (
            <div
              key={gym.id}
              onClick={() => setActiveTab('gyms')}
              className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 hover:scale-[1.01] transition-all duration-300 cursor-pointer text-left flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={gym.imageUrl}
                  alt={gym.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono font-semibold tracking-wider text-blue-400 uppercase">
                  {gym.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-white">
                  ${gym.price}/mo
                </span>
              </div>
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">{gym.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    {gym.location}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  <span>Rating: <strong className="text-white">⭐ {gym.rating}</strong></span>
                  <span>{gym.reviewsCount} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fitness Streaks Active Challenges */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto" id="challenges-section">
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-tr from-black/40 to-white/[0.02]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Texts */}
            <div className="lg:col-span-4 space-y-3 text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg font-bold">
                Gamified Streaks
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Active Weekly <br />Platform Challenges
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Join live challenges alongside other members, log daily sweat, earn high XP levels and display badges on the global standings standings panel!
              </p>
            </div>

            {/* Right Challenge Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-3 text-left flex flex-col justify-between"
                  id={`challenge-card-${challenge.id}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold">
                        +{challenge.rewardXp} XP
                      </span>
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-xs text-white leading-snug line-clamp-1">{challenge.title}</h3>
                    <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{challenge.description}</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onJoinChallenge(challenge.id)}
                      id={`join-challenge-btn-${challenge.id}`}
                      className={`w-full text-center py-2 rounded-xl text-[10px] font-mono tracking-wider uppercase transition-all font-bold ${
                        challenge.completed
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-600/20'
                      }`}
                    >
                      {challenge.completed ? '✓ Completed Reward' : '⚡ Join Quest'}
                    </button>
                    <p className="text-[9px] text-slate-500 mt-1 text-center font-mono">
                      {challenge.joinedCount} users tracking
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Slogan Values Showcase */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="slogan-features-section">
        <div className="p-5 glass-panel rounded-2xl border border-white/5 space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400 w-10 h-10 flex items-center justify-center"><Heart className="w-5 h-5" /></div>
          <h3 className="font-display font-semibold text-base text-white">Full-Stack Autonomy</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Members can log exercises, keep water milestones, book personal training slots, and pay within seconds online.
          </p>
        </div>
        <div className="p-5 glass-panel rounded-2xl border border-white/5 space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400 w-10 h-10 flex items-center justify-center"><Users className="w-5 h-5" /></div>
          <h3 className="font-display font-semibold text-base text-white">Coach-Led Direct Connections</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Trainers can create workout plans, keep checkouts, analyze body stats progress, and chat with clients in real-time.
          </p>
        </div>
        <div className="p-5 glass-panel rounded-2xl border border-white/5 space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400 w-10 h-10 flex items-center justify-center"><LineChart className="w-5 h-5" /></div>
          <h3 className="font-display font-semibold text-base text-white">Tenant SaaS Dashboard</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Gym owners can monitor active subscribers, branch performance, schedule bookings, add trainers and scale operations.
          </p>
        </div>
      </section>
    </div>
  );
}
