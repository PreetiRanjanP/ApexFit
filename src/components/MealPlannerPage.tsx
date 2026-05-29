/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beef, 
  Sparkles, 
  Apple, 
  Droplet, 
  Flame, 
  TrendingUp, 
  Award,
  CircleCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { LoggedMeal } from '../types';

interface MealPlannerPageProps {
  loggedMeals: LoggedMeal[];
  waterAmount: number;
  onLogMeal: (mealObj: any) => void;
  onLogWater: (amountMl: number) => void;
}

export default function MealPlannerPage({
  loggedMeals,
  waterAmount,
  onLogMeal,
  onLogWater
}: MealPlannerPageProps) {
  // Diet Gemini input states
  const [goal, setGoal] = useState('Build Lean Muscle Density');
  const [allergen, setAllergen] = useState('Shellfish & Gluten Allergy');
  const [dietPreference, setDietPreference] = useState('High Protein Low Carb');
  const [calories, setCalories] = useState('2200');

  // Load Statuses
  const [loadingDiet, setLoadingDiet] = useState(false);
  const [aiDiet, setAiDiet] = useState<any | null>(null);

  // Meal Custom logger form
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('450');
  const [mealProtein, setMealProtein] = useState('35');
  const [mealCarbs, setMealCarbs] = useState('40');
  const [mealFats, setMealFats] = useState('10');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [successMsg, setSuccessMsg] = useState('');

  const triggerGenerateDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDiet(true);
    setAiDiet(null);

    try {
      const response = await fetch('/api/diet/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          goal,
          allergen,
          dietPreference,
          calories: Number(calories) || 2200
        })
      });

      const data = await response.json();
      setAiDiet(data);
    } catch (err) {
      console.error('Failed generating diet blueprint', err);
    } finally {
      setLoadingDiet(false);
    }
  };

  const handleLogCustomMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName) return;

    onLogMeal({
      name: mealName,
      calories: Number(mealCalories) || 300,
      protein: Number(mealProtein) || 20,
      carbs: Number(mealCarbs) || 30,
      fats: Number(mealFats) || 10,
      mealType: mealType
    });

    setSuccessMsg(`Log Success! Entered "${mealName}" into database stats. Check Standings and Feed updates.`);
    setMealName('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  // Water calculations
  const waterTargetMl = 2500;
  const currentWaterPercent = Math.min(100, (waterAmount / waterTargetMl) * 100);

  // Calculate real-time totals from logged meals
  const totalCalToday = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinToday = loggedMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbsToday = loggedMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFatsToday = loggedMeals.reduce((acc, m) => acc + m.fats, 0);

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          AI Nutrition Engine
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Calorie Counter & Diet Blueprints
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Precision nutritional balancing. Track water targets and macros, or invoke Gemini to synthesize daily diet plans matching food allergies.
        </p>
      </div>

      {successMsg && (
        <div id="meal-logged-success-indicator" className="mb-6 p-4 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-mono flex items-center gap-2">
          <CircleCheck className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Real-time Macro Progress Tracker Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-left" id="macro-dashboard-panels">
        {/* Calories Card */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-mono tracking-wider">
            <span>Energy Input</span>
            <Flame className="w-4 h-4 text-[orange]" />
          </div>
          <div>
            <p className="font-mono font-bold text-2xl text-white">{totalCalToday} kcal</p>
            <p className="text-[10px] text-slate-500 mt-1">Goal: ~{calories} kcal (Aura Model Setup)</p>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1 rounded-full" style={{ width: `${Math.min(100, (totalCalToday / Number(calories)) * 100)}%` }} />
          </div>
        </div>

        {/* Protein Card */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-mono tracking-wider">
            <span>Proteins Input</span>
            <Beef className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="font-mono font-bold text-2xl text-white">{totalProteinToday} g</p>
            <p className="text-[10px] text-slate-500 mt-1">Goal: ~150 g (Ideal Amino retention)</p>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1">
            <div className="bg-red-400 h-1 rounded-full" style={{ width: `${Math.min(100, (totalProteinToday / 150) * 100)}%` }} />
          </div>
        </div>

        {/* Carbs Card */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-mono tracking-wider">
            <span>Carbohydrates</span>
            <Apple className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="font-mono font-bold text-2xl text-white">{totalCarbsToday} g</p>
            <p className="text-[10px] text-slate-500 mt-1">Goal: ~210 g (Muscle glycogen energy)</p>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1">
            <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${Math.min(100, (totalCarbsToday / 210) * 100)}%` }} />
          </div>
        </div>

        {/* Fats Card */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-xs text-slate-400 uppercase font-mono tracking-wider">
            <span>Saturated Fats</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="font-mono font-bold text-2xl text-white">{totalFatsToday} g</p>
            <p className="text-[10px] text-slate-500 mt-1">Goal: ~70 g (Hormonal balance target)</p>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1">
            <div className="bg-blue-400 h-1 rounded-full" style={{ width: `${Math.min(100, (totalFatsToday / 70) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Columns splitter layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Gemini AI Diet Builder */}
        <div className="lg:col-span-6 space-y-6" id="ai-dietitian-panel-column">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 text-left">
              <div className="bg-lime-500/25 p-2 rounded-xl text-lime-400"><Sparkles className="w-4.5 h-4.5 animate-spin" /></div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white">Gemini Customized Diet Optimizer</h3>
                <p className="text-[10px] text-slate-400 font-mono">Server-Side Multi-Aspect Ingredient Filters</p>
              </div>
            </div>

            <form onSubmit={triggerGenerateDiet} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Target Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Dietary Preferences</label>
                  <select
                    value={dietPreference}
                    onChange={(e) => setDietPreference(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                  >
                    <option value="High Protein Low Carb">High Protein Low Carb</option>
                    <option value="Standard Weight Gain">Standard Weight Gain</option>
                    <option value="Plant Based Vegan">Plant-Based Core Vegan</option>
                    <option value="Keto High Fat">Keto High Fat</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Allergies & Restrictions</label>
                <input
                  type="text"
                  placeholder="e.g. Tree nuts allergy, gluten-free, dairy intolerant"
                  value={allergen}
                  onChange={(e) => setAllergen(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Fitness Strategy Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Build dynamic biceps density, cut fat percentage fast"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingDiet}
                id="generate-diet-gemini-btn"
                className={`w-full py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                  loadingDiet 
                    ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 cursor-wait' 
                    : 'bg-lime-400 text-slate-950 hover:bg-lime-350 glow-lime'
                }`}
              >
                {loadingDiet ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Balancing Amino Acids & Calories...
                  </>
                ) : (
                  <>
                    <Apple className="w-4 h-4" />
                    Trigger System Gemini Diet Plan
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Block */}
          <AnimatePresence mode="wait">
            {aiDiet && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="ai-diet-blueprint-display"
                className="glass-panel rounded-3xl p-5 border border-lime-500/20 text-left space-y-4 shadow-xl"
              >
                <div>
                  <span className="text-[9px] uppercase font-mono bg-lime-400/10 text-lime-400 px-2.5 py-0.5 rounded border border-lime-400/20">Aura AI Custom Dietitians</span>
                  <h4 className="font-display font-bold text-base text-white mt-1.5">{aiDiet.planName}</h4>
                </div>

                <p className="text-xs text-slate-400 leading-normal border-b border-white/5 pb-3">"{aiDiet.dailySummary}"</p>

                {/* Macromappings details */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/45 p-3 rounded-xl border border-white/5 text-center text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block">Protein</span>
                    <span className="text-red-400 font-bold">{aiDiet.macros.protein}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Carbohydrates</span>
                    <span className="text-emerald-400 font-bold">{aiDiet.macros.carbs}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">Saturated Fat</span>
                    <span className="text-blue-400 font-bold">{aiDiet.macros.fats}</span>
                  </div>
                </div>

                {/* Meals arrays list */}
                <div className="space-y-3 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Synthesized Daily Plates</span>
                  <div className="space-y-3">
                    {aiDiet.meals.map((meal: any, i: number) => (
                      <div key={i} className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-start text-xs border-b border-white/5 pb-1.5">
                          <div>
                            <span className="bg-white/5 text-slate-400 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold mr-1.5">{meal.time}</span>
                            <span className="text-white font-medium">{meal.name}</span>
                          </div>
                          <span className="text-lime-400 font-mono font-semibold">{meal.calories} kcal</span>
                        </div>
                        {/* Ingredients */}
                        <div className="flex flex-wrap gap-1">
                          {meal.ingredients.map((ing: string, idx: number) => (
                            <span key={idx} className="text-[9px] font-mono bg-white/5 text-slate-400 px-2 py-0.5 rounded">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hydration suggestions */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/15 rounded-xl text-xs leading-normal flex items-start gap-2 text-blue-300">
                  <Droplet className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[10px] uppercase font-mono tracking-wider">Hydration Targets</span>
                    <p className="text-[11px] text-slate-350">{aiDiet.hydrationGoal}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Quick macros logger and Water animated cup tracker */}
        <div className="lg:col-span-6 space-y-6" id="meal-logging-tracker-column">
          {/* Animated Water Cup HUD Card */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left flex flex-col md:flex-row gap-6 items-center">
            {/* SVG Glass */}
            <div className="relative w-32 h-36 shrink-0 bg-slate-950/60 rounded-b-3xl border-x-4 border-b-4 border-white/10 overflow-hidden flex items-end">
              {/* Animated fill waves block */}
              <div 
                className="w-full bg-gradient-to-t from-blue-700 to-blue-400 transition-all duration-500 relative"
                style={{ height: `${currentWaterPercent}%` }}
              >
                {/* Micro Bubbles loops */}
                <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                <div className="absolute top-3 right-4 w-1 h-1 bg-white/30 rounded-full animate-pulse" />
              </div>
              <div className="absolute inset-x-0 bottom-4 text-center font-mono text-white text-xs font-bold drop-shadow-md">
                {currentWaterPercent.toFixed(0)}%
              </div>
            </div>

            {/* Quick quick logger options */}
            <div className="space-y-4 flex-1">
              <div>
                <span className="bg-blue-500/20 text-blue-400 font-mono uppercase text-[9px] tracking-wider px-2 py-0.5 rounded font-bold">
                  Hydration tracker
                </span>
                <h3 className="font-display font-bold text-base text-white mt-1.5">Maintain Daily Minerals</h3>
                <p className="text-xs text-slate-400">Keep muscle cells volumized and clean biological toxic traits.</p>
              </div>

              <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                <span className="text-slate-300 text-xs font-mono">My Water: <strong className="text-white text-sm font-bold">{waterAmount} ml</strong></span>
                <span className="text-[10px] text-slate-500 font-mono">Goal: 2,500 ml</span>
              </div>

              <div className="grid grid-cols-2 gap-2" id="water-add-actions">
                <button
                  onClick={() => onLogWater(250)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold text-xs py-2 rounded-xl cursor-pointer transition-colors"
                >
                  💧 +250 ml Glass
                </button>
                <button
                  onClick={() => onLogWater(500)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-mono font-bold text-xs py-2 rounded-xl cursor-pointer transition-colors"
                >
                  💎 +500 ml Bottle
                </button>
              </div>
            </div>
          </div>

          {/* Quick micro food meal logger */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 text-left">
            <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
              <Beef className="w-4 h-4 text-lime-400" />
              <h3 className="font-display font-semibold text-sm text-white">Log Custom Plate Macronutrients</h3>
            </div>

            <form onSubmit={handleLogCustomMeal} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Meal Plate Title name</label>
                  <input
                    type="text"
                    placeholder="e.g. Scrambled eggs & peanut bagel"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Meal Category</label>
                  <select
                    value={mealType}
                    onChange={(e: any) => setMealType(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 font-mono">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-slate-500 tracking-widest text-center block">Calories</label>
                  <input
                    type="number"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white text-center"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-slate-500 tracking-widest text-center block">Protein (g)</label>
                  <input
                    type="number"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white text-center"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-slate-500 tracking-widest text-center block">Carbs (g)</label>
                  <input
                    type="number"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white text-center"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase text-slate-500 tracking-widest text-center block">Fats (g)</label>
                  <input
                    type="number"
                    value={mealFats}
                    onChange={(e) => setMealFats(e.target.value)}
                    className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white text-center"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="log-custom-meal-submit-btn"
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono uppercase text-lime-400 rounded-xl transition-colors cursor-pointer"
              >
                Log Plate Macros
              </button>
            </form>
          </div>

          {/* Log History */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block border-b border-white/5 pb-2.5">
              Logged food stats (Today)
            </span>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1" id="meals-logged-history">
              {loggedMeals.map((meal) => (
                <div key={meal.id} className="bg-slate-950/40 p-3.5 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="bg-white/5 text-slate-400 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded mr-1.5">{meal.mealType}</span>
                    <span className="text-white font-medium">{meal.name}</span>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-400">
                    <span className="text-lime-400 font-bold block">{meal.calories} kcal</span>
                    <span>P:{meal.protein}g | C:{meal.carbs}g | F:{meal.fats}g</span>
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
