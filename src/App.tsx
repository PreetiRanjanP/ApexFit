/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import GymListingPage from './components/GymListingPage';
import TrainerProfilePage from './components/TrainerProfilePage';
import WorkoutTrackingPage from './components/WorkoutTrackingPage';
import MealPlannerPage from './components/MealPlannerPage';
import CheckoutPage from './components/CheckoutPage';
import CommunityPage from './components/CommunityPage';
import ChatComponent from './components/ChatComponent';
import Dashboards from './components/Dashboards';
import SettingsPage from './components/SettingsPage';

import { 
  UserProfile, 
  GymBranch, 
  TrainerProfile, 
  Booking, 
  LoggedWorkout, 
  LoggedMeal, 
  CommunityPost, 
  ChatMessage, 
  SaaSAnalytics 
} from './types';

export default function App() {
  // Navigation active state - starts on awesome landing page!
  const [activeTab, setActiveTab] = useState('landing');
  const [currentRole, setCurrentRole] = useState<'Member' | 'Trainer' | 'Gym Owner' | 'Admin'>('Member');

  // React state holders matching backend state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gyms, setGyms] = useState<GymBranch[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loggedWorkouts, setLoggedWorkouts] = useState<LoggedWorkout[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [waterAmount, setWaterAmount] = useState<number>(0);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [analytics, setAnalytics] = useState<SaaSAnalytics | null>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  
  // Custom billing selected plan mapping pass
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);

  // Sync state with server on mount
  useEffect(() => {
    fetchSaaSData();
  }, []);

  const fetchSaaSData = async () => {
    try {
      const response = await fetch('/api/saas-data');
      if (!response.ok) throw new Error("Faulty response");
      const db = await response.json();
      
      setUserProfile(db.userProfile);
      setGyms(db.gyms);
      setTrainers(db.trainers);
      setBookings(db.bookings);
      setLoggedWorkouts(db.loggedWorkouts);
      setLoggedMeals(db.loggedMeals);
      setWaterAmount(db.waterAmount);
      setPosts(db.posts);
      setChatMessages(db.chatMessages);
      setAnalytics(db.analytics);
      setChallenges(db.challenges || []);
    } catch (err) {
      console.error("Failed fetching database schema, compiling fallback assets", err);
    }
  };

  // 1. Add Gym Branch Handler
  const handleJoinChallenge = async (id: string) => {
    try {
      const res = await fetch('/api/challenges/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const db = await res.json();
      setChallenges(db.challenges || []);
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          xpPoints: db.userProfile.xpPoints,
          badges: db.userProfile.badges
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGym = async (gymData: any) => {
    try {
      const res = await fetch('/api/gyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gymData)
      });
      const updatedGyms = await res.json();
      setGyms(updatedGyms);
      // Refresh analytics to capture new branch performance metric curves!
      fetchSaaSData();
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Book pt slot handler
  const handleBookSession = async (bookingData: any) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const updatedBookings = await res.json();
      setBookings(updatedBookings);
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Confirm/Complete/Reject Booking handler (Trainer actions)
  const handleConfirmBooking = async (bookingId: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updatedBookings = await res.json();
      setBookings(updatedBookings);
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Log workout handler
  const handleLogWorkout = async (workoutObj: any) => {
    try {
      const res = await fetch('/api/workouts/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutObj)
      });
      const db = await res.json();
      setLoggedWorkouts(db.loggedWorkouts);
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          xpPoints: db.userProfile.xpPoints,
          workoutsCompleted: db.userProfile.workoutsCompleted,
          dailyStreak: db.userProfile.dailyStreak
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Log Water Intake
  const handleLogWater = async (amountMl: number) => {
    try {
      const res = await fetch('/api/water/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountMl })
      });
      const db = await res.json();
      setWaterAmount(db.waterAmount);
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Log meal
  const handleLogMeal = async (mealObj: any) => {
    try {
      const res = await fetch('/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mealObj)
      });
      const db = await res.json();
      setLoggedMeals(db.loggedMeals);
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Subscribe tier payments
  const handleConfirmPurchase = async (checkoutParams: any) => {
    try {
      const res = await fetch('/api/subscriptions/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutParams)
      });
      const db = await res.json();
      setUserProfile(db.userProfile);
      setAnalytics(db.analytics);
    } catch (err) {
      console.error(err);
    }
  };

  // 8. Create Community Feed Post
  const handleCreatePost = async (postData: any) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      const db = await res.json();
      setPosts(db.posts);
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Like Community Feed Post
  const handleLikePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST'
      });
      const db = await res.json();
      setPosts(db.posts);
    } catch (err) {
      console.error(err);
    }
  };

  // 10. Send Chat messaging
  const handleSendMessage = async (receiverId: string, content: string) => {
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, content })
      });
      const db = await res.json();
      setChatMessages(db.chatMessages);
    } catch (err) {
      console.error(err);
    }
  };

  // 11. Profile changes settings saves
  const handleUpdateProfile = (updatedData: any) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        name: updatedData.name
      });
    }
  };

  if (!userProfile || !analytics) {
    return (
      <div className="min-h-screen bg-[#050506] flex flex-col items-center justify-center text-[#E0E0E6] space-y-4 font-sans relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-black font-black text-xl italic">A</span>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs font-mono text-slate-400 uppercase tracking-[0.25em] animate-pulse">APEXFIT SYSTEM BOOTING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050506] text-[#E0E0E6] flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Dynamic Header Navbar Menu */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onRoleSwitch={(role: any) => setCurrentRole(role)}
        userName={userProfile.name}
        userAvatar={userProfile.avatar}
      />

      {/* Main viewport transitions */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage 
            setActiveTab={setActiveTab} 
            gyms={gyms}
            challenges={challenges}
            onJoinChallenge={handleJoinChallenge}
            userXp={userProfile.xpPoints}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingPage
            onSelectPlan={(plan) => setSelectedPlan(plan)}
            currentPlanId={userProfile.activePlanId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'gyms' && (
          <GymListingPage
            gyms={gyms}
            onAddGym={handleAddGym}
            isOwner={currentRole === 'Gym Owner'}
          />
        )}

        {activeTab === 'trainers' && (
          <TrainerProfilePage
            trainers={trainers}
            onBookSession={handleBookSession}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'workout' && (
          <WorkoutTrackingPage
            loggedHistory={loggedWorkouts}
            onLogWorkout={handleLogWorkout}
            userStreak={userProfile.dailyStreak}
          />
        )}

        {activeTab === 'diet' && (
          <MealPlannerPage
            loggedMeals={loggedMeals}
            waterAmount={waterAmount}
            onLogMeal={handleLogMeal}
            onLogWater={handleLogWater}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutPage
            selectedPlan={selectedPlan}
            onConfirmPurchase={handleConfirmPurchase}
            userEmail="preeti@saasfit.com"
          />
        )}

        {activeTab === 'community' && (
          <CommunityPage
            posts={posts}
            onCreatePost={handleCreatePost}
            onLikePost={handleLikePost}
            currentUserId={userProfile.id}
          />
        )}

        {activeTab === 'chat' && (
          <ChatComponent
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            currentUserId={userProfile.id}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboards
            currentRole={currentRole}
            activeProfile={userProfile}
            gyms={gyms}
            trainers={trainers}
            bookings={bookings}
            loggedWorkouts={loggedWorkouts}
            onConfirmBooking={handleConfirmBooking}
            analytics={analytics}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            profile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Small design accent footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/5 py-6 text-center select-none shrink-0 text-[10px] uppercase font-mono tracking-[0.2em] text-slate-500 relative z-10">
        © {new Date().getFullYear()} APEXFIT Platform • Immersive Intelligent SaaS Node • All networks online ✔
      </footer>
    </div>
  );
}
