/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API successfully initialized server-side.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client SDK:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found (or holds placeholder value). Running server-side AI endpoints in safe simulator mode.");
}

// Ensure database serialization folder exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pre-seeded local data store
const DB_FILE = path.join(DATA_DIR, "db-saas.json");

// Define basic seed structures
const initialSeed = {
  users: [
    {
      id: "u-member",
      name: "Preeti Ranjan",
      email: "preetiranjanpradhan48@gmail.com",
      role: "User",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      height: 178,
      weight: 74,
      fitnessGoals: ["Build Muscle", "Increase Stamina", "HIIT Endurance"],
      activePlanId: "pro-monthly",
      planExpiryDate: "2026-06-29",
      dailyStreak: 5,
      xpPoints: 3450,
      badges: ["Early Bird", "Streak Master", "Iron Lifter"],
      workoutsCompleted: 42
    },
    {
      id: "u-trainer",
      name: "Trainer Elena Grace",
      email: "elena.grace@apexfit.com",
      role: "Trainer",
      avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150",
      dailyStreak: 8,
      xpPoints: 5600,
      badges: ["Pro Coach", "Nutrition Certified"],
      workoutsCompleted: 154
    },
    {
      id: "u-owner",
      name: "Marcus Aurelius (Gym Owner)",
      email: "marcus.owner@apexfit.com",
      role: "Gym Owner",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      dailyStreak: 0,
      xpPoints: 950,
      badges: ["SaaS Pioneer"],
      workoutsCompleted: 0
    },
    {
      id: "u-admin",
      name: "System Admin",
      email: "admin@apexfit.com",
      role: "Admin",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
      dailyStreak: 0,
      xpPoints: 12000,
      badges: ["Supreme Administrator"],
      workoutsCompleted: 0
    }
  ],
  currentUserId: "u-member",
  gyms: [
    {
      id: "gym-1",
      name: "Apex Elite Club",
      location: "Metro Downtown Center",
      city: "San Francisco",
      rating: 4.9,
      price: 299,
      category: "Premium",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      facilities: ["Premium Locker Rooms", "Olympic Barbells", "Sauna & Steam", "Personal Training", "Organic Juice Bar"],
      description: "Apex Elite Club is our premium multi-tenant luxury hub featuring top-of-the-line Eleiko bars, high-end hammer strength resistance machines, and scenic downtown glass aesthetics.",
      reviewsCount: 148,
      trainers: ["Elena Grace", "Rohan Saxena"]
    },
    {
      id: "gym-2",
      name: "Iron Temple Strength Hub",
      location: "Industrial District Road",
      city: "Oakland",
      rating: 4.8,
      price: 99,
      category: "Strength",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",
      facilities: ["Power Racks", "Chalk Allowed", "Heavy Dumbbells (up to 75kg)", "Outdoor Strongman Space"],
      description: "No frills, high effort. Built for powerlifters, strongman competitors, and bodybuilders who want absolute silence and focused focus.",
      reviewsCount: 92,
      trainers: ["Victor Steel", "Marcus J"]
    },
    {
      id: "gym-3",
      name: "Serene Breath & Yoga Studio",
      location: "Bayside Boardwalk Blvd",
      city: "San Francisco",
      rating: 4.7,
      price: 149,
      category: "Yoga",
      imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800",
      facilities: ["Heated Yoga Floor", "Meditation Cushions", "Sound Healing Gongs", "Therapeutic Showers"],
      description: "A sanctuary devoted to alignment, physical mastery, dynamic core vinyasa, and deep meditative pranayama sessions by the ocean breeze.",
      reviewsCount: 54,
      trainers: ["Sarah Jenkins"]
    },
    {
      id: "gym-4",
      name: "Pulse & Cardio Crossfit Box",
      location: "Mission Street 24th",
      city: "San Francisco",
      rating: 4.6,
      price: 180,
      category: "Crossfit",
      imageUrl: "https://images.unsplash.com/photo-1534258266114-37302f23cf30?w=800",
      facilities: ["Rowers & Air Bikes", "Climbing Ropes", "Bumper Plates", "Community Social Area"],
      description: "Fast-paced group workouts, high-intensity functional training, and supportive athletic community challenges to test physical thresholds.",
      reviewsCount: 76,
      trainers: ["Victor Steel", "Rohan Saxena"]
    }
  ],
  trainers: [
    {
      id: "t-1",
      name: "Elena Grace",
      specialization: "Bodybuilding",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150",
      bio: "Pro Card Bodybuilder & Registered Clinical Nutritionist with 8+ years coaching champions.",
      availableSlots: ["09:00 AM", "11:00 AM", "04:00 PM", "06:00 PM"],
      reviews: ["Elena completely changed my dynamic posture and leg press strategy!", "Fantastic diet layouts."],
      clientsCount: 24,
      transformationUrls: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=450",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=450"
      ]
    },
    {
      id: "t-2",
      name: "Victor Steel",
      specialization: "Strength Training",
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150",
      bio: "National Powerlifting champion focused on flawless biomechanical squats, bench, and deadlifts.",
      availableSlots: ["08:00 AM", "10:00 AM", "03:00 PM", "05:00 PM"],
      reviews: ["Victor's cueing helped me unlock my 200kg deadlift target safe and clean.", "A master of form."],
      clientsCount: 18,
      transformationUrls: []
    },
    {
      id: "t-3",
      name: "Sarah Jenkins",
      specialization: "Yoga",
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150",
      bio: "Vinyasa Flow Certified with 200hr RYT and specialized posture rehab background.",
      availableSlots: ["07:00 AM", "09:30 AM", "02:00 PM", "05:00 PM"],
      reviews: ["The bayside sound therapy with Sarah is purely therapeutic.", "Highly restorative classes."],
      clientsCount: 15,
      transformationUrls: []
    }
  ],
  bookings: [
    {
      id: "book-1",
      trainerId: "t-1",
      trainerName: "Elena Grace",
      date: "2026-06-01",
      timeSlot: "11:00 AM",
      status: "Confirmed",
      type: "Personal Training"
    },
    {
      id: "book-2",
      trainerId: "t-2",
      trainerName: "Victor Steel",
      date: "2026-06-03",
      timeSlot: "03:00 PM",
      status: "Pending",
      type: "Personal Training"
    }
  ],
  loggedWorkouts: [
    {
      id: "w-log-1",
      userId: "u-member",
      name: "Heavy Upper Body Power Day",
      date: "2026-05-28",
      durationMinutes: 65,
      caloriesBurned: 480,
      exercises: [
        { name: "Barbell Bench Press", sets: 4, reps: 6, weight: 85 },
        { name: "Weighted Pull Up", sets: 3, reps: 8, weight: 10 },
        { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 32 },
        { name: "Cable Seated Row", sets: 3, reps: 12, weight: 65 }
      ],
      notes: "Smashed the last set of 85kg bench with flawless overhead bar lock!"
    },
    {
      id: "w-log-2",
      userId: "u-member",
      name: "HIIT Cardio Endurance Loop",
      date: "2026-05-26",
      durationMinutes: 40,
      caloriesBurned: 520,
      exercises: [
        { name: "Kettlebell Swing", sets: 4, reps: 20, weight: 24 },
        { name: "Burpees", sets: 4, reps: 15, weight: 0 },
        { name: "Rowing Machine Sprints", sets: 1, reps: 1, weight: 0 }
      ],
      notes: "High heart rate focused. Kept active intervals around 170-175 bpm."
    }
  ],
  loggedMeals: [
    {
      id: "m-log-1",
      userId: "u-member",
      name: "Post-Workout Fuel Oatmeal & Egg Whites",
      calories: 550,
      protein: 42,
      carbs: 65,
      fats: 10,
      mealType: "Breakfast",
      date: "2026-05-28"
    },
    {
      id: "m-log-2",
      userId: "u-member",
      name: "Grilled Chicken Salad & Avocado Rice Bowl",
      calories: 720,
      protein: 55,
      carbs: 70,
      fats: 22,
      mealType: "Lunch",
      date: "2026-05-28"
    }
  ],
  waterLogs: [
    { id: "water-1", userId: "u-member", amountMl: 750, date: "2026-05-28" },
    { id: "water-2", userId: "u-member", amountMl: 500, date: "2026-05-28" },
    { id: "water-3", userId: "u-member", amountMl: 1000, date: "2026-05-29" }
  ],
  communityPosts: [
    {
      id: "post-1",
      authorId: "u-member",
      authorName: "Preeti Ranjan",
      authorRole: "User",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      content: "Just logged my personal best and hit 85kg 4x6 on bench press press! Stoked to pursue that 100kg milestone with trainer Elena's solid dynamic posture cueing! 💪🏋️‍♀️ #GainStreak #EliteAthletes",
      likesCount: 14,
      commentsCount: 3,
      isLiked: true,
      type: "workout",
      createdAt: "2026-05-28T18:30:00Z"
    },
    {
      id: "post-2",
      authorId: "t-1",
      authorName: "Elena Grace",
      authorRole: "Trainer",
      authorAvatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150",
      content: "CLIENT TRANSFORMATION: Super delighted to share Preeti's progress! Focused intently on macro ratios, daily sleep consistency, and heavy progression layouts. 12 weeks of real effort. Absolute champion!",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600",
      likesCount: 52,
      commentsCount: 9,
      isLiked: false,
      type: "transformation",
      createdAt: "2026-05-27T10:15:00Z"
    }
  ],
  challenges: [
    {
      id: "chal-1",
      title: "10,000 Steps Daily Grind",
      description: "Hit 10k steps daily for 7 days in a row. Unlock the 'Wind Walker' visual badge and rewards.",
      rewardXp: 500,
      joinedCount: 143,
      daysDuration: 7,
      completed: false
    },
    {
      id: "chal-2",
      title: "Heavy Squat Progression Quest",
      description: "Log at least 3 heavy barbell leg workouts on Apex platform this week to boost neuromuscular recruits.",
      rewardXp: 800,
      joinedCount: 84,
      daysDuration: 5,
      completed: true
    },
    {
      id: "chal-3",
      title: "Pranayama Breathing Calm Master",
      description: "Perform 10 minutes of box breathing daily for 5 continuous days. Promotes central nervous recovery.",
      rewardXp: 400,
      joinedCount: 55,
      daysDuration: 5,
      completed: false
    }
  ],
  chatMessages: [
    {
      id: "chat-1",
      senderId: "t-1",
      senderName: "Elena Grace",
      receiverId: "u-member",
      content: "Hey Preeti! Fantastic job with the heavy bench session yesterday. Let's make sure we hit our 150g protein block today to lock down proper muscle recovery.",
      timestamp: "2026-05-29T08:00:00Z"
    },
    {
      id: "chat-2",
      senderId: "u-member",
      senderName: "Preeti Ranjan",
      receiverId: "t-1",
      content: "Thanks coach! Fully locked in. Muscle recovery is feeling on point. Oatmeal logged with 42g protein breakfast setup already!",
      timestamp: "2026-05-29T08:15:00Z"
    }
  ],
  billingLogs: [
    {
      id: "inv-2001",
      planName: "Apex Pro SaaS Standard",
      amount: 49,
      date: "2026-05-15",
      status: "Paid",
      paymentMethod: "Visa ending in 4242"
    },
    {
      id: "inv-1002",
      planName: "Apex Pro Monthly Pass",
      amount: 49,
      date: "2026-04-15",
      status: "Paid",
      paymentMethod: "Visa ending in 4242"
    }
  ]
};

// Simple load state helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Failed reading database JSON file, reverting to seed.", err);
  }
  // If not exists, save seed
  saveDB(initialSeed);
  return initialSeed;
}

function saveDB(state: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed persisting database state JSON.", err);
  }
}

// REST Endpoints
app.get("/api/state", (req, res) => {
  const db = loadDB();
  res.json(db);
});

// SaaS-Data initial fetch integration point for React Front-End
app.get("/api/saas-data", (req, res) => {
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId) || db.users[0];
  
  // Calculate today's water amount from waterLogs for high-fidelity sync
  const today = new Date().toISOString().split("T")[0];
  const waterAmount = db.waterLogs
    .filter((w: any) => w.userId === db.currentUserId && w.date === today)
    .reduce((sum: number, w: any) => sum + w.amountMl, 0);

  // Calculate analytics
  const totalRevenue = db.billingLogs.reduce((acc: number, log: any) => acc + log.amount, 0);
  const activeSubs = db.users.filter((u: any) => u.activePlanId && u.role === "User").length;
  
  const usersCount = db.users.filter((u: any) => u.role === "User").length;
  const trainersCount = db.users.filter((u: any) => u.role === "Trainer").length;
  const ownersCount = db.users.filter((u: any) => u.role === "Gym Owner").length;

  const calculatedAnalytics = {
    totalRevenue,
    activeSubscriptionsCount: activeSubs,
    revenueByMonth: [
      { month: "Jan", value: 3200 },
      { month: "Feb", value: 4100 },
      { month: "Mar", value: 4900 },
      { month: "Apr", value: 5800 },
      { month: "May", value: totalRevenue }
    ],
    userGrowth: [
      { month: "Jan", members: 12, trainers: 2, owners: 1 },
      { month: "Feb", members: 24, trainers: 2, owners: 1 },
      { month: "Mar", members: 38, trainers: 3, owners: 1 },
      { month: "Apr", members: 55, trainers: 3, owners: 1 },
      { month: "May", members: usersCount * 12, trainers: trainersCount * 3, owners: ownersCount }
    ],
    gymPerformance: db.gyms.map((g: any, i: number) => ({
      name: g.name,
      membersCount: (i + 1) * 35,
      monthlyEarnings: (i + 1) * 450 + g.price * 3
    }))
  };

  res.json({
    userProfile: currentUser,
    gyms: db.gyms,
    trainers: db.trainers,
    bookings: db.bookings,
    loggedWorkouts: db.loggedWorkouts,
    loggedMeals: db.loggedMeals,
    waterAmount: waterAmount,
    posts: db.communityPosts,
    chatMessages: db.chatMessages,
    analytics: calculatedAnalytics,
    challenges: db.challenges || []
  });
});

// Auth endpoints
app.get("/api/auth/current", (req, res) => {
  const db = loadDB();
  const current = db.users.find((u: any) => u.id === db.currentUserId) || db.users[0];
  res.json(current);
});

app.post("/api/auth/switch-role", (req, res) => {
  const { role } = req.body;
  const db = loadDB();
  
  let targetUser = db.users.find((u: any) => u.role === role);
  if (!targetUser) {
    // Fail-safe default user
    targetUser = db.users[0];
  }
  
  db.currentUserId = targetUser.id;
  saveDB(db);
  res.json(targetUser);
});

app.post("/api/auth/profile-update", (req, res) => {
  const { height, weight, goals } = req.body;
  const db = loadDB();
  const current = db.users.find((u: any) => u.id === db.currentUserId);
  if (current) {
    if (height) current.height = Number(height);
    if (weight) current.weight = Number(weight);
    if (goals) current.fitnessGoals = goals;
    saveDB(db);
    return res.json({ success: true, profile: current });
  }
  res.status(404).json({ error: "User not found" });
});

// Gym listings
app.post("/api/gyms", (req, res) => {
  const { name, location, price, category, imageUrl, facilities, description } = req.body;
  const db = loadDB();
  const newGym = {
    id: `gym-${Date.now()}`,
    name: name || "Elite Studio Plus",
    location: location || "Grand Marina Plaza",
    city: "San Francisco",
    rating: 4.5,
    price: Number(price) || 120,
    category: category || "Premium",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    facilities: facilities || ["Locker Room", "Cardio Deck", "Dumbbells"],
    description: description || "No description provided.",
    reviewsCount: 1,
    trainers: ["Elena Grace"]
  };
  db.gyms.unshift(newGym);
  saveDB(db);
  res.json(db.gyms);
});

// Bookings
app.post("/api/bookings", (req, res) => {
  const { trainerId, trainerName, date, timeSlot, type } = req.body;
  const db = loadDB();
  const newBooking = {
    id: `book-${Date.now()}`,
    trainerId: trainerId || "t-1",
    trainerName: trainerName || "Elena Grace",
    date: date || "2026-06-01",
    timeSlot: timeSlot || "10:00 AM",
    status: "Pending" as const,
    type: type || "Personal Training"
  };
  db.bookings.unshift(newBooking);
  saveDB(db);
  res.json(db.bookings);
});

app.post("/api/bookings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'Confirmed' or 'Cancelled' or 'Completed'
  const db = loadDB();
  const booking = db.bookings.find((b: any) => b.id === id);
  if (booking) {
    booking.status = status;
    saveDB(db);
    res.json(db.bookings);
  } else {
    res.status(404).json({ error: "Booking session not found" });
  }
});

app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., 'Confirmed' or 'Cancelled' or 'Completed'
  const db = loadDB();
  const booking = db.bookings.find((b: any) => b.id === id);
  if (booking) {
    booking.status = status;
    saveDB(db);
    res.json({ success: true, booking });
  } else {
    res.status(404).json({ error: "Booking session not found" });
  }
});

// Logged Workouts
app.post("/api/workouts/log", (req, res) => {
  const { name, durationMinutes, caloriesBurned, exercises, notes } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  
  const newLog = {
    id: `w-log-${Date.now()}`,
    userId: db.currentUserId,
    name: name || "Dynamic Training Routine",
    date: new Date().toISOString().split("T")[0],
    durationMinutes: Number(durationMinutes) || 45,
    caloriesBurned: Number(caloriesBurned) || 350,
    exercises: exercises || [],
    notes: notes || ""
  };
  
  db.loggedWorkouts.unshift(newLog);
  
  if (currentUser) {
    currentUser.workoutsCompleted = (currentUser.workoutsCompleted || 0) + 1;
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 120; // 120 XP for logging workout!
    if (currentUser.dailyStreak === 0) {
      currentUser.dailyStreak = 1;
    } else if (Math.random() > 0.3) {
      currentUser.dailyStreak += 1; // simulation of daily streaks matching engagement
    }
    
    // Badge unlocking logic
    if (currentUser.workoutsCompleted >= 10 && !currentUser.badges.includes("Elite Veteran")) {
      currentUser.badges.push("Elite Veteran");
    }
  }

  // Create automatic community workout share
  const communityWorkoutShare = {
    id: `post-${Date.now()}`,
    authorId: currentUser?.id || "u-member",
    authorName: currentUser?.name || "Preeti Ranjan",
    authorRole: currentUser?.role || "User",
    authorAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    content: `Completed my workout: "${newLog.name}" in ${newLog.durationMinutes} minutes burning ~${newLog.caloriesBurned}kcal! Logged exercises include: ${newLog.exercises.map((e: any) => `${e.name} (${e.sets}x${e.reps})`).join(", ")}. Hard work pays off! 🚀💪`,
    likesCount: 5,
    commentsCount: 0,
    isLiked: false,
    type: "workout" as const,
    createdAt: new Date().toISOString()
  };
  db.communityPosts.unshift(communityWorkoutShare);
  
  saveDB(db);
  res.json({
    loggedWorkouts: db.loggedWorkouts,
    userProfile: currentUser
  });
});

// Log Meals
app.post("/api/meals/log", (req, res) => {
  const { name, calories, protein, carbs, fats, mealType } = req.body;
  const db = loadDB();
  const newMeal = {
    id: `m-log-${Date.now()}`,
    userId: db.currentUserId,
    name: name || "Nutrition Snack",
    calories: Number(calories) || 300,
    protein: Number(protein) || 20,
    carbs: Number(carbs) || 30,
    fats: Number(fats) || 10,
    mealType: mealType || "Snack",
    date: new Date().toISOString().split("T")[0]
  };
  db.loggedMeals.unshift(newMeal);

  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 40; // 40 xp for log meal
  }

  saveDB(db);
  res.json({ loggedMeals: db.loggedMeals });
});

// Old route mapping
app.post("/api/diet/log-meal", (req, res) => {
  const { name, calories, protein, carbs, fats, mealType } = req.body;
  const db = loadDB();
  const newMeal = {
    id: `m-log-${Date.now()}`,
    userId: db.currentUserId,
    name: name || "Nutrition Snack",
    calories: Number(calories) || 300,
    protein: Number(protein) || 20,
    carbs: Number(carbs) || 30,
    fats: Number(fats) || 10,
    mealType: mealType || "Snack",
    date: new Date().toISOString().split("T")[0]
  };
  db.loggedMeals.unshift(newMeal);

  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 40; // 40 xp for log meal
  }

  saveDB(db);
  res.json({ success: true, meal: newMeal, user: currentUser });
});

app.post("/api/water/log", (req, res) => {
  const { amountMl } = req.body;
  const db = loadDB();
  const today = new Date().toISOString().split("T")[0];
  const newWater = {
    id: `water-${Date.now()}`,
    userId: db.currentUserId,
    amountMl: Number(amountMl) || 250,
    date: today
  };
  db.waterLogs.unshift(newWater);

  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 15; // 15 xp for drinking water
  }

  saveDB(db);

  const waterAmount = db.waterLogs
    .filter((w: any) => w.userId === db.currentUserId && w.date === today)
    .reduce((sum: number, w: any) => sum + w.amountMl, 0);

  res.json({ waterAmount });
});

app.post("/api/diet/log-water", (req, res) => {
  const { amountMl } = req.body;
  const db = loadDB();
  const newWater = {
    id: `water-${Date.now()}`,
    userId: db.currentUserId,
    amountMl: Number(amountMl) || 250,
    date: new Date().toISOString().split("T")[0]
  };
  db.waterLogs.unshift(newWater);

  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 15; // 15 xp for drinking water
  }

  saveDB(db);
  res.json({ success: true, water: newWater, user: currentUser });
});

// Community posts & likes
app.post("/api/posts", (req, res) => {
  const { content, imageUrl, type } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  
  const newPost = {
    id: `post-${Date.now()}`,
    authorId: db.currentUserId,
    authorName: currentUser?.name || "Member",
    authorRole: currentUser?.role || "User",
    authorAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    content: content || "Sweating it out at the gym today! Consistency over everything. 💥",
    imageUrl: imageUrl || undefined,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    type: type || "general",
    createdAt: new Date().toISOString()
  };
  
  db.communityPosts.unshift(newPost);

  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 50; // posting in community awards 50 XP
  }

  saveDB(db);
  res.json({ posts: db.communityPosts });
});

app.post("/api/posts/:id/like", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const post = db.communityPosts.find((p: any) => p.id === id);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
    saveDB(db);
    res.json({ posts: db.communityPosts });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

app.post("/api/community/post", (req, res) => {
  const { content, imageUrl, type } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  
  const newPost = {
    id: `post-${Date.now()}`,
    authorId: db.currentUserId,
    authorName: currentUser?.name || "Member",
    authorRole: currentUser?.role || "User",
    authorAvatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    content: content || "Sweating it out at the gym today! Consistency over everything. 💥",
    imageUrl: imageUrl || undefined,
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    type: type || "general",
    createdAt: new Date().toISOString()
  };
  
  db.communityPosts.unshift(newPost);

  if (currentUser) {
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 50; // posting in community awards 50 XP
  }

  saveDB(db);
  res.json({ success: true, post: newPost, user: currentUser });
});

app.post("/api/community/like", (req, res) => {
  const { postId } = req.body;
  const db = loadDB();
  const post = db.communityPosts.find((p: any) => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);
    saveDB(db);
    res.json({ success: true, post });
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Challenges join/complete
app.post("/api/challenges/join", (req, res) => {
  const { id } = req.body;
  const db = loadDB();
  const challenge = db.challenges.find((c: any) => c.id === id);
  if (challenge) {
    challenge.joinedCount += 1;
    // Complete automatically after random progression or keep active state
    challenge.completed = !challenge.completed; // Toggle state for simulation
    
    const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
    if (currentUser) {
      if (challenge.completed) {
        currentUser.xpPoints = (currentUser.xpPoints || 0) + challenge.rewardXp;
        if (!currentUser.badges.includes("Challenger Elite")) {
          currentUser.badges.push("Challenger Elite");
        }
      } else {
        currentUser.xpPoints = (currentUser.xpPoints || 0) + 50; // just joining gives 50 xp points
      }
    }
    
    saveDB(db);
    res.json({
      challenges: db.challenges,
      userProfile: currentUser
    });
  } else {
    res.status(404).json({ error: "Challenge not found" });
  }
});

// Chat system messaging
app.post("/api/chat/send", async (req, res) => {
  const { content, receiverId } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);

  const newUserMsg = {
    id: `chat-${Date.now()}`,
    senderId: db.currentUserId,
    senderName: currentUser?.name || "Member",
    receiverId: receiverId || "t-1",
    content: content || "",
    timestamp: new Date().toISOString()
  };

  db.chatMessages.push(newUserMsg);
  saveDB(db);

  // If receiving entity is a trainer or AI system, generate a simulated response from Elena or Gemini!
  if (receiverId === "t-1" || receiverId === "ai-assistant") {
    // Call Gemini for smart feedback if API key exists, otherwise fallback to high quality simulation response
    let responseText = `Hi there! I'm Elena, your custom ApexFit Coach. Your message was received! Let's schedule an appointment or log a heavy session today to smash our goals. Keep crushing the proteins!`;
    
    if (ai) {
      try {
        console.log("Calling Gemini 3.5-flash for real-time coach trainer chat interaction...");
        const sysMsg = receiverId === "ai-assistant" 
          ? "You are Aura, the warm and highly analytical ApexFit SaaS core AI coach. Write a highly motivating, professional, scientifically sound fitness/nutrition response in 2-3 sentences max."
          : `You are Elena Grace, an expert bodybuilding trainer and medical nutritionist with a friendly, positive, and direct tone. The user says: "${content}". Write a personalized coach reply in 2-3 sentences maximum.`;

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: content,
          config: {
            systemInstruction: sysMsg,
            temperature: 0.8
          }
        });
        
        if (geminiResponse.text) {
          responseText = geminiResponse.text.trim();
        }
      } catch (err) {
        console.error("Gemini coach reply error, standard coaching template utilized as fallback:", err);
      }
    } else {
      // Key is simulated, generate randomized interesting coaching response
      const coachFallbacks = [
        "Brilliant workout thoughts, Preeti! Ensure you do dynamic mobility movements (like deep 90/90 hips) before lifting heavier scales today to build joint resilience.",
        "Remember that micro-nutrition matches raw volume outputs! Ensure you drink plenty of water and grab minerals like magnesium and potassium after high-impact sweat.",
        "Consistency always beats absolute perfection intensity. Keep that 5-day streak running and hit the scheduled 11:00 AM personal session when ready!",
        "Excellent query! Make sure you prioritize progressive tension fatigue during the final eccentric phase of your bicep curls/pull-ups to unlock high recovery peaks."
      ];
      responseText = coachFallbacks[Math.floor(Math.random() * coachFallbacks.length)];
    }

    const newTrainerMsg = {
      id: `chat-${Date.now() + 1}`,
      senderId: receiverId,
      senderName: receiverId === "ai-assistant" ? "Aura AI Coach" : "Elena Grace",
      receiverId: db.currentUserId,
      content: responseText,
      timestamp: new Date().toISOString(),
      isAi: receiverId === "ai-assistant"
    };

    db.chatMessages.push(newTrainerMsg);
    saveDB(db);
  }

  res.json({ success: true, chatMessages: db.chatMessages });
});

// SaaS checkout payment
app.post("/api/payments/checkout", (req, res) => {
  const { planId, planName, price, couponCode } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  
  let finalPrice = Number(price) || 49;
  if (couponCode === "FIT50" || couponCode === "FITNESS50") {
    finalPrice = finalPrice * 0.5;
  }
  
  const newInvoice = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    planName: planName || "Premium SaaS Tier",
    amount: finalPrice,
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
    paymentMethod: "Mock Stripe Card Master (visa ...4242)"
  };

  db.billingLogs.unshift(newInvoice);
  
  if (currentUser) {
    currentUser.activePlanId = planId || "pro-monthly";
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    currentUser.planExpiryDate = expiryDate.toISOString().split("T")[0];
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 1000; // 1000 bonus XP for signing up/buying a subscription!
    if (!currentUser.badges.includes("Elite Pro")) {
      currentUser.badges.push("Elite Pro");
    }
  }

  saveDB(db);
  res.json({ success: true, invoice: newInvoice, profile: currentUser });
});

app.post("/api/subscriptions/purchase", (req, res) => {
  const { planId, planName, price, couponCode } = req.body;
  const db = loadDB();
  const currentUser = db.users.find((u: any) => u.id === db.currentUserId);
  
  let finalPrice = Number(price) || 49;
  if (couponCode === "FIT50" || couponCode === "FITNESS50") {
    finalPrice = finalPrice * 0.5;
  }
  
  const newInvoice = {
    id: `inv-${Date.now().toString().slice(-4)}`,
    planName: planName || "Premium SaaS Tier",
    amount: finalPrice,
    date: new Date().toISOString().split("T")[0],
    status: "Paid",
    paymentMethod: "Mock Stripe Card Master (visa ...4242)"
  };

  db.billingLogs.unshift(newInvoice);
  
  if (currentUser) {
    currentUser.activePlanId = planId || "pro-monthly";
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    currentUser.planExpiryDate = expiryDate.toISOString().split("T")[0];
    currentUser.xpPoints = (currentUser.xpPoints || 0) + 1000; // 1000 bonus XP for signing up/buying a subscription!
    if (!currentUser.badges.includes("Elite Pro")) {
      currentUser.badges.push("Elite Pro");
    }
  }

  saveDB(db);

  // calculate updated analytics
  const totalRevenue = db.billingLogs.reduce((acc: number, log: any) => acc + log.amount, 0);
  const activeSubs = db.users.filter((u: any) => u.activePlanId && u.role === "User").length;
  
  const usersCount = db.users.filter((u: any) => u.role === "User").length;
  const trainersCount = db.users.filter((u: any) => u.role === "Trainer").length;
  const ownersCount = db.users.filter((u: any) => u.role === "Gym Owner").length;

  const calculatedAnalytics = {
    totalRevenue,
    activeSubscriptionsCount: activeSubs,
    revenueByMonth: [
      { month: "Jan", value: 3200 },
      { month: "Feb", value: 4100 },
      { month: "Mar", value: 4900 },
      { month: "Apr", value: 5800 },
      { month: "May", value: totalRevenue }
    ],
    userGrowth: [
      { month: "Jan", members: 12, trainers: 2, owners: 1 },
      { month: "Feb", members: 24, trainers: 2, owners: 1 },
      { month: "Mar", members: 38, trainers: 3, owners: 1 },
      { month: "Apr", members: 55, trainers: 3, owners: 1 },
      { month: "May", members: usersCount * 12, trainers: trainersCount * 3, owners: ownersCount }
    ],
    gymPerformance: db.gyms.map((g: any, i: number) => ({
      name: g.name,
      membersCount: (i + 1) * 35,
      monthlyEarnings: (i + 1) * 450 + g.price * 3
    }))
  };

  res.json({
    userProfile: currentUser,
    analytics: calculatedAnalytics
  });
});

// AI Workouts Generation Route
app.post("/api/workouts/ai-generate", async (req, res) => {
  const { gender, age, experience, focus, height, weight } = req.body;
  
  let generatedPlanObj = null;

  if (ai) {
    try {
      console.log("Calling Gemini 3.5-flash to generate an AI gym workout plan...");
      const prompt = `Create a fully tailored modern gym workout routine for a ${age} year old ${gender} who is at a ${experience} level, looking to focus on: "${focus}". Height: ${height}cm, Weight: ${weight}kg.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routineName: { type: Type.STRING, description: "Name of the workout routine" },
              description: { type: Type.STRING, description: "Short motivational training philosophy" },
              warmup: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of exactly 3 warm-up steps"
              },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Exercise name" },
                    sets: { type: Type.INTEGER, description: "Number of sets" },
                    reps: { type: Type.INTEGER, description: "Number of repetitions" },
                    weightDesc: { type: Type.STRING, description: "Weight descriptions/recommendations" },
                    biomechanicalFocus: { type: Type.STRING, description: "Brief technique cue" }
                  },
                  required: ["name", "sets", "reps", "weightDesc", "biomechanicalFocus"]
                },
                description: "List of core training exercises"
              },
              cooldown: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of exactly 2 cooldown stretching steps"
              }
            },
            required: ["routineName", "description", "warmup", "exercises", "cooldown"]
          }
        }
      });

      if (response.text) {
        generatedPlanObj = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Failed to generate workout custom JSON via Gemini, running backup simulation...", err);
    }
  }

  if (!generatedPlanObj) {
    // High-fidelity fallback simulated plans built by elite trainers
    generatedPlanObj = {
      routineName: `${focus || "Full Body Mastery"} Elite Workout`,
      description: `A highly technical, target-oriented athletic progression plan focused on neurological muscle density and strength building. Optimized for ${experience || "intermediate"} experience levels.`,
      warmup: [
        "5 Minutes steady metabolic jog or row active interval",
        "15 Reps World's Greatest stretch loop (hips, spine, hamstrings)",
        "2 Sets of 10 dynamic overhead banded pull-aparts"
      ],
      exercises: [
        { name: "Barbell Back Squats (Form Progression)", sets: 4, reps: 8, weightDesc: "60-70% 1RM (~60kg - 80kg)", biomechanicalFocus: "Brace deep core, push knees out, keep straight neutral neck spine" },
        { name: "Incline Barbell Bench Chest Press", sets: 3, reps: 10, weightDesc: "Moderate dumbbell weights (~25kg each)", biomechanicalFocus: "Inhale eccentric pinch, press on vertical line" },
        { name: "Neutral Grip Overhand Pullups", sets: 3, reps: 8, weightDesc: "Bodyweight or weighted (+5kg)", biomechanicalFocus: "Squeeze lower lats, drive elbows hard in pockets" },
        { name: "Dumbbell Lateral Shoulder Raises", sets: 3, reps: 15, weightDesc: "Light weight (~10kg each)", biomechanicalFocus: "Lead raise with elbows, avoid trap shrugging" }
      ],
      cooldown: [
        "2 minutes lying hamstring self stretch per leg",
        "2 minutes deep cobra breathing stretch to expand abs and lower back"
      ]
    };
  }

  res.json(generatedPlanObj);
});

// AI Diet Recommendation Route
app.post("/api/diet/ai-generate", async (req, res) => {
  const { goal, allergen, dietPreference, calories } = req.body;
  let dietPlanObj = null;

  if (ai) {
    try {
      console.log("Calling Gemini 3.5-flash to generate an AI personalized diet nutrition plan...");
      const prompt = `Create a custom, high-nutrition single-day meal blueprint matching a target of ${calories || 2200} calories for general fitness goal: "${goal || "lean muscle building"}". Dietary Preference: ${dietPreference || "high-protein content"}, Allergens/Restrictions: ${allergen || "none"}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              planName: { type: Type.STRING, description: "Diet Plan Title" },
              dailySummary: { type: Type.STRING, description: "Motivational nutrition philosophy focusing on calorie totals, macros, and hydration" },
              macros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.STRING, description: "grams e.g. 150g" },
                  carbs: { type: Type.STRING, description: "grams e.g. 210g" },
                  fats: { type: Type.STRING, description: "grams e.g. 70g" }
                },
                required: ["protein", "carbs", "fats"]
              },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING, description: "Meal phase e.g. Breakfast, Lunch, Dinner, Snack" },
                    name: { type: Type.STRING, description: "Meal Name" },
                    calories: { type: Type.INTEGER, description: "Calorie size" },
                    protein: { type: Type.STRING, description: "Protein content" },
                    carbs: { type: Type.STRING, description: "Carbs content" },
                    fats: { type: Type.STRING, description: "Fats content" },
                    ingredients: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of preparation items/ingredients"
                    }
                  },
                  required: ["time", "name", "calories", "protein", "carbs", "fats", "ingredients"]
                }
              },
              hydrationGoal: { type: Type.STRING, description: "Liquids recommendation e.g. 3.5 Liters of water" }
            },
            required: ["planName", "dailySummary", "macros", "meals", "hydrationGoal"]
          }
        }
      });

      if (response.text) {
        dietPlanObj = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Diet generation failed with Gemini, running elite back-up diet database plan...", err);
    }
  }

  if (!dietPlanObj) {
    dietPlanObj = {
      planName: `${goal || "Lean Hypertrophy"} Power Recovery Blueprint`,
      dailySummary: `High nitrogen protein retention layout precisely tuned to ${calories || 2300} calories. Formulated to increase dry muscle building, stabilize insulin response, and satisfy vital micronutrients.`,
      macros: { protein: "165g", carbs: "220g", fats: "75g" },
      meals: [
        {
          time: "Breakfast",
          name: "High-Protein Omega Berry Oatmeal Bowl",
          calories: 550,
          protein: "45g",
          carbs: "60g",
          fats: "12g",
          ingredients: ["50g rolled gluten-free oats", "1.5 scoops organic whey isolate protein", "100g fresh wild blueberries", "15g raw chia seeds"]
        },
        {
          time: "Lunch",
          name: "Grilled Citrus Salmon & Cilantro Quinoa Rice Bowl",
          calories: 680,
          protein: "50g",
          carbs: "55g",
          fats: "24g",
          ingredients: ["150g wild caught salmon fillet cooked", "1 cup steamed organic white quinoa", "150g roasted fresh asparagus", "1 tablespoon cold pressed extra virgin olive oil"]
        },
        {
          time: "Snack/Post-Workout",
          name: "Quick recovery Greek Yogurt Berry Bowl",
          calories: 320,
          protein: "28g",
          carbs: "35g",
          fats: "5g",
          ingredients: ["200g fat-free Greek yogurt plain", "1 sliced fresh organic banana", "1 squeeze organic royal jelly honey"]
        },
        {
          time: "Dinner",
          name: "Lean Dry-Spiced Turkey Breast with Sweet Potatoes",
          calories: 650,
          protein: "42g",
          carbs: "70g",
          fats: "14g",
          ingredients: ["180g roasted lean turkey breast chunks", "200g baked gold sweet potatoes", "Unlimited steamed green broccoli florets", "half avocado sliced"]
        }
      ],
      hydrationGoal: "3.5L Pure Mineral Water with added pink Himalayan salt trace minerals"
    };
  }

  res.json(dietPlanObj);
});

// Analytics Route (Dynamic calculation based on data states)
app.get("/api/analytics", (req, res) => {
  const db = loadDB();
  
  const totalRevenue = db.billingLogs.reduce((acc: number, log: any) => acc + log.amount, 0);
  const activeSubs = db.users.filter((u: any) => u.activePlanId && u.role === "User").length;
  
  const usersCount = db.users.filter((u: any) => u.role === "User").length;
  const trainersCount = db.users.filter((u: any) => u.role === "Trainer").length;
  const ownersCount = db.users.filter((u: any) => u.role === "Gym Owner").length;

  const response = {
    totalRevenue,
    activeSubscriptionsCount: activeSubs,
    revenueByMonth: [
      { month: "Jan", value: 3200 },
      { month: "Feb", value: 4100 },
      { month: "Mar", value: 4900 },
      { month: "Apr", value: 5800 },
      { month: "May", value: totalRevenue }
    ],
    userGrowth: [
      { month: "Jan", members: 12, trainers: 2, owners: 1 },
      { month: "Feb", members: 24, trainers: 2, owners: 1 },
      { month: "Mar", members: 38, trainers: 3, owners: 1 },
      { month: "Apr", members: 55, trainers: 3, owners: 1 },
      { month: "May", members: usersCount * 12, trainers: trainersCount * 3, owners: ownersCount }
    ],
    gymPerformance: db.gyms.map((g: any, i: number) => {
      // simulate performance data matching listings
      return {
        name: g.name,
        membersCount: (i + 1) * 35,
        monthlyEarnings: (i + 1) * 450 + g.price * 3
      };
    })
  };

  res.json(response);
});

// Start server block
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Full-Stack Server running and bound on http://0.0.0.0:${PORT}`);
    console.log(`Developer preview environment is online!`);
  });
}

startServer();
