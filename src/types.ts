/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Gym Owner' | 'Trainer' | 'User';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  height?: number; // cm
  weight?: number; // kg
  fitnessGoals?: string[];
  activePlanId?: string;
  planExpiryDate?: string;
  dailyStreak: number;
  xpPoints: number;
  badges: string[];
  workoutsCompleted: number;
}

export interface GymBranch {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  price: number; // monthly base
  category: string; // 'Strength' | 'Crossfit' | 'Yoga' | 'Premium' | 'Cardio'
  imageUrl: string;
  facilities: string[];
  description: string;
  reviewsCount: number;
  trainers: string[]; // names or IDs
}

export interface TrainerProfile {
  id: string;
  name: string;
  specialization: string; // 'Strength Training' | 'Yoga' | 'HIIT' | 'Bodybuilding' | 'Crossfit'
  rating: number;
  avatar: string;
  bio: string;
  availableSlots: string[]; // e.g., ["09:00 AM", "11:00 AM", "04:00 PM"]
  reviews: string[];
  clientsCount: number;
  transformationUrls: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  tier: 'Free' | 'Pro' | 'Enterprise';
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  type: 'Personal Training' | 'Group Class';
}

export interface ExerciseLog {
  name: string;
  sets: number;
  reps: number;
  weight: number; // kg
}

export interface LoggedWorkout {
  id: string;
  userId: string;
  name: string;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: ExerciseLog[];
  notes?: string;
}

export interface LoggedMeal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number; // g
  carbs: number; // g
  fats: number; // g
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  date: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  type: 'general' | 'transformation' | 'workout';
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  joinedCount: number;
  daysDuration: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  name: string;
  xpPoints: number;
  workoutsCompleted: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isAi?: boolean;
}

export interface SaaSAnalytics {
  totalRevenue: number;
  revenueByMonth: { month: string; value: number }[];
  activeSubscriptionsCount: number;
  userGrowth: { month: string; members: number; trainers: number; owners: number }[];
  gymPerformance: { name: string; membersCount: number; monthlyEarnings: number }[];
}
