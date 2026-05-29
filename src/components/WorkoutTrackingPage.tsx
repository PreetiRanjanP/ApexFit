/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Sparkles, 
  Timer, 
  Activity, 
  Flame, 
  Layers, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { LoggedWorkout } from '../types';

interface WorkoutTrackingPageProps {
  loggedHistory: LoggedWorkout[];
  onLogWorkout: (workoutObj: any) => void;
  userStreak: number;
}

export default function WorkoutTrackingPage({
  loggedHistory,
  onLogWorkout,
  userStreak
}: WorkoutTrackingPageProps) {
  // AI Form builder states
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('28');
  const [experience, setExperience] = useState('Intermediate');
  const [focus, setFocus] = useState('Heavy Bench Squats Power');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('74');

  // Load Statuses
  const [laodingAiRoutine, setLoadingAiRoutine] = useState(false);
  const [aiRoutine, setAiRoutine] = useState<any | null>(null);

  // Custom log creator states
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const [customDuration, setCustomDuration] = useState('45');
  const [customCalories, setCustomCalories] = useState('350');
  const [loggedIndicator, setLoggedIndicator] = useState('');

  // Sourced active Exercises rows for custom layout log
  const [exercisesList, setExercisesList] = useState<any[]>([
    { name: 'Barbell Bench Press', sets: 4, reps: 6, weight: 85 }
  ]);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState(8);
  const [newExWeight, setNewExWeight] = useState(40);

  const triggerGenerateRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAiRoutine(true);
    setAiRoutine(null);

    try {
      const response = await fetch('/api/workouts/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gender,
          age,
          experience,
          focus,
          height,
          weight
        })
      });

      const data = await response.json();
      setAiRoutine(data);
    } catch (err) {
      console.error('Failed generating routine', err);
    } finally {
      setLoadingAiRoutine(false);
    }
  };

  const handleAddExerciseRow = () => {
    if (!newExName) return;
    setExercisesList([
      ...exercisesList,
      { name: newExName, sets: Number(newExSets), reps: Number(newExReps), weight: Number(newExWeight) }
    ]);
    setNewExName('');
  };

  const handleDeleteExerciseRow = (index: number) => {
    setExercisesList(exercisesList.filter((_, i) => i !== index));
  };

  const handleSumbitLog = (e: React.FormEvent) => {
    e.preventDefault();
    const title = customWorkoutName || aiRoutine?.routineName || "Dynamic Routine Setup";
    
    onLogWorkout({
      name: title,
      durationMinutes: Number(customDuration) || 45,
      caloriesBurned: Number(customCalories) || 350,
      exercises: exercisesList,
      notes: "Logged successfully via ApexFit custom trackers."
    });

    setLoggedIndicator(`Success! Workout "${title}" has been registered! You awarded +120 XP Points and secured health consistency! Check the Standings & Feed.`);
    setCustomWorkoutName('');
    
    setTimeout(() => {
      setLoggedIndicator('');
    }, 6000);
  };

  const handleApplyAiRoutineToLogs = () => {
    if (!aiRoutine) return;
    setCustomWorkoutName(aiRoutine.routineName);
    const convertedEx = aiRoutine.exercises.map((e: any) => ({
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: Number(e.weightDesc.replace(/\D/g, '')) || 40
    }));
    setExercisesList(convertedEx);
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          AI Fitness Engine
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Workout Builder & Tracking Logging
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Aura AI utilizes Gemini to compile pristine scientific gym workouts customized to posture, health targets, and active joint status.
        </p>
      </div>

      {loggedIndicator && (
        <div id="workout-logged-success-indicator" className="mb-6 p-4 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{loggedIndicator}</span>
        </div>
      )}

      {/* Grid split: Left is AI, Right is custom tracker log config */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Gemini AI Planner */}
        <div className="lg:col-span-6 space-y-6" id="ai-planner-column">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 text-left">
              <div className="bg-lime-500/25 p-2 rounded-xl text-lime-400"><Sparkles className="w-4.5 h-4.5 animate-spin" /></div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white">Gemini Customized Workout Synthesizer</h3>
                <p className="text-[10px] text-slate-400 font-mono">Server-Side Multi-Aspect LLM Calculations</p>
              </div>
            </div>

            <form onSubmit={triggerGenerateRoutine} className="space-y-4 text-left">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Biological Target</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="Male">Athletic Male</option>
                    <option value="Female">Athletic Female</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Age Structure</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-lime-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Weekly Experience</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced Power">Advanced Elite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-lime-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-400">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-lime-400 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Dynamic Workout Focus Goals</label>
                <input
                  type="text"
                  placeholder="e.g. Lower Body Squats with no Quad stress, Kettlebell cardiovascular intervals"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={laodingAiRoutine}
                id="generate-workout-gemini-btn"
                className={`w-full py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                  laodingAiRoutine 
                    ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 cursor-wait' 
                    : 'bg-lime-400 text-slate-950 hover:bg-lime-350 glow-lime'
                }`}
              >
                {laodingAiRoutine ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Flawless Biomechanical Routine...
                  </>
                ) : (
                  <>
                    <Dumbbell className="w-4 h-4" />
                    Trigger System Gemini Generation
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Resulting display */}
          <AnimatePresence mode="wait">
            {aiRoutine && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="ai-workout-results"
                className="glass-panel rounded-3xl p-5 border border-lime-500/20 text-left space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-mono bg-lime-400/10 text-lime-400 px-2.5 py-0.5 rounded border border-lime-400/20">Aura AI Custom Results</span>
                    <h4 className="font-display font-bold text-base text-white mt-1.5">{aiRoutine.routineName}</h4>
                  </div>
                  <button
                    onClick={handleApplyAiRoutineToLogs}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase text-lime-400 transition-colors cursor-pointer"
                    id="apply-ai-to-logs-shortcut"
                  >
                    Apply to Logs
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-normal border-b border-white/5 pb-3">"{aiRoutine.description}"</p>

                {/* Warmup routines */}
                <div className="space-y-1 rounded-xl bg-slate-950/45 p-3 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block mb-1">1. Active Metabolic Warmup</span>
                  {aiRoutine.warmup.map((step: string, i: number) => (
                    <p key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
                      <span className="text-lime-400 font-bold font-mono">#{i+1}</span> {step}
                    </p>
                  ))}
                </div>

                {/* Exercises array routine */}
                <div className="space-y-2.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">2. Primary Neuromuscular Lifts</span>
                  <div className="divide-y divide-white/5">
                    {aiRoutine.exercises.map((ex: any, i: number) => (
                      <div key={i} className="py-2 flex justify-between items-start text-xs">
                        <div className="space-y-0.5 max-w-[70%]">
                          <p className="text-white font-medium">{ex.name}</p>
                          <p className="text-[10px] text-slate-500 italic leading-snug">Focus: {ex.biomechanicalFocus}</p>
                        </div>
                        <div className="text-right text-[11px]">
                          <p className="text-lime-400 font-bold font-mono">{ex.sets} Sets x {ex.reps} Reps</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-0.5">{ex.weightDesc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooldown routine */}
                <div className="space-y-1 rounded-xl bg-slate-950/45 p-3 border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block mb-1">3. Cooldown Core Recovery</span>
                  {aiRoutine.cooldown.map((step: string, i: number) => (
                    <p key={i} className="text-[11px] text-slate-300 flex items-start gap-1">
                      <span className="text-slate-500 font-bold font-mono">✓</span> {step}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Logging interactive trackers */}
        <div className="lg:col-span-6 space-y-6" id="workout-logging-form-column">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 text-left">
              <div className="bg-lime-500/20 p-2 rounded-xl text-lime-400"><Activity className="w-4.5 h-4.5" /></div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white">Log Active Workout Progress</h3>
                <p className="text-[10px] text-slate-400 font-mono">Acquire XP, Streaks and Community Status shares</p>
              </div>
            </div>

            <form onSubmit={handleSumbitLog} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Workout Name</label>
                <input
                  type="text"
                  placeholder="e.g. Upper chest target log"
                  value={customWorkoutName}
                  onChange={(e) => setCustomWorkoutName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Calories Burned (kcal)</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Add exercise subform column */}
              <div className="border border-white/5 rounded-xl p-4 bg-slate-950/45 space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block pb-1 border-b border-white/5">Add Lifttable Exercise Row</span>
                
                <div className="space-y-1.5">
                  <input
                    type="text"
                    placeholder="Exercise name (e.g. Barbell Squats)"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-mono tracking-widest text-slate-500">Sets Count</label>
                    <input
                      type="number"
                      value={newExSets}
                      onChange={(e) => setNewExSets(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white font-mono text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-mono tracking-widest text-slate-500">Reps Count</label>
                    <input
                      type="number"
                      value={newExReps}
                      onChange={(e) => setNewExReps(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white font-mono text-center"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-mono tracking-widest text-slate-500">Weight (kg)</label>
                    <input
                      type="number"
                      value={newExWeight}
                      onChange={(e) => setNewExWeight(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-white/5 rounded-lg p-1.5 text-xs text-white font-mono text-center"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddExerciseRow}
                  id="add-exercise-inline-row-btn"
                  className="w-full py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono uppercase rounded-lg text-lime-400 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Lifttable Row
                </button>
              </div>

              {/* Added exercises table list */}
              {exercisesList.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Logged Rows ({exercisesList.length})</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-950 rounded-xl p-3 border border-white/5">
                    {exercisesList.map((ex, index) => (
                      <div key={index} className="flex justify-between items-center text-xs pb-1.5 border-b border-white/5 last:border-0 last:pb-0">
                        <div>
                          <p className="text-white font-medium">{ex.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {ex.sets} Sets x {ex.reps} Reps | {ex.weight} kg
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteExerciseRow(index)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                id="submit-workout-log-btn"
                className="w-full py-3.5 bg-lime-400 hover:bg-lime-350 text-slate-950 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-lime-500/10 cursor-pointer"
              >
                Log Active Session Plan
              </button>
            </form>
          </div>

          {/* Historical view logged list preview */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider block border-b border-white/5 pb-2.5">
              Historical Log Tracker (Last 3 Weeks)
            </span>
            <div className="space-y-3.5" id="workout-history-list">
              {loggedHistory.map((log) => (
                <div key={log.id} className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white leading-snug">{log.name}</p>
                    <div className="flex items-center gap-2.5 text-[10px] text-slate-500 font-mono">
                      <span>📆 {log.date}</span>
                      <span>⏱ {log.durationMinutes} min</span>
                      <span className="text-rose-400">🔥 ~{log.caloriesBurned} cal</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
