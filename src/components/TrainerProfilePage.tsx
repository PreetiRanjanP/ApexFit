/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { TrainerProfile } from '../types';

interface TrainerProfilePageProps {
  trainers: TrainerProfile[];
  onBookSession: (bookingData: { trainerId: string; trainerName: string; date: string; timeSlot: string }) => void;
  setActiveTab: (tab: string) => void;
}

export default function TrainerProfilePage({
  trainers,
  onBookSession,
  setActiveTab
}: TrainerProfilePageProps) {
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-06-01');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [successBookingMsg, setSuccessBookingMsg] = useState('');

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer || !selectedSlot) return;
    
    onBookSession({
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      date: bookingDate,
      timeSlot: selectedSlot
    });

    setSuccessBookingMsg(`Successfully booked! Session scheduled with ${selectedTrainer.name} on ${bookingDate} at ${selectedSlot}. Confirmations logged.`);
    setSelectedSlot('');
    
    // clear notice after 5 seconds
    setTimeout(() => {
      setSuccessBookingMsg('');
    }, 5000);
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          Coaching Portal
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Certified Experts & Personal Trainers
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Connect with professional bodybuilding and yoga master specialists. Schedule customized target-oriented slots.
        </p>
      </div>

      {successBookingMsg && (
        <div id="booking-success-indicator" className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successBookingMsg}</span>
        </div>
      )}

      {/* Main Trainers Selection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Trainers List */}
        <div className="lg:col-span-7 space-y-4" id="trainers-cards-grid">
          {trainers.map((trainer) => {
            const isTarget = selectedTrainer?.id === trainer.id;
            return (
              <div
                key={trainer.id}
                onClick={() => { setSelectedTrainer(trainer); setSelectedSlot(''); }}
                className={`p-5 rounded-2xl border text-left flex gap-5 cursor-pointer transition-all duration-300 ${
                  isTarget 
                    ? 'bg-slate-900 border-lime-400/80 shadow-2xl' 
                    : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                }`}
                id={`trainer-card-${trainer.id}`}
              >
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 border border-white/15"
                />
                
                <div className="flex-1 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-semibold text-base text-white">{trainer.name}</h3>
                      <p className="text-xs text-lime-400 font-mono">{trainer.specialization}</p>
                    </div>
                    <div className="flex items-center text-xs text-amber-400 font-mono gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{trainer.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-normal line-clamp-2">{trainer.bio}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-white/5 pt-2">
                    <span>Active clients: <b className="text-white">{trainer.clientsCount || 10}+</b></span>
                    <button className="text-lime-400 hover:text-white flex items-center gap-0.5">
                      Configure Schedule <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Booking Calendar Interface */}
        <div className="lg:col-span-5 sticky top-24" id="trainer-booking-panel">
          {selectedTrainer ? (
            <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-5 text-left">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <img
                  src={selectedTrainer.avatar}
                  alt={selectedTrainer.name}
                  className="w-10 h-10 rounded-lg object-cover border border-lime-400/20"
                />
                <div>
                  <h3 className="font-display font-bold text-xs text-white">{selectedTrainer.name} SCHEDULE</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Personal Coach | {selectedTrainer.specialization}</p>
                </div>
              </div>

              {/* Transformation Image Highlight if exists */}
              {selectedTrainer.transformationUrls && selectedTrainer.transformationUrls.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Transformations Story Accent</span>
                  <div className="h-32 rounded-xl overflow-hidden relative">
                    <img
                      src={selectedTrainer.transformationUrls[0]}
                      alt="Transformation Before"
                      className="w-full h-full object-cover brightness-95 filter"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2.5 bg-lime-400 text-slate-950 font-black text-[8px] px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                      12-Weeks Dynamic Results
                    </span>
                  </div>
                </div>
              )}

              {/* Booking slot Form selection */}
              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">1. Select Appointment Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono text-center"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">2. Select Hour Slot</label>
                  <div className="grid grid-cols-2 gap-2" id="available-slots-grid">
                    {selectedTrainer.availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 rounded-xl text-xs font-mono border transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-lime-400 text-slate-950 border-lime-400 font-bold' 
                              : 'bg-slate-950 border-white/5 text-slate-300 hover:border-white/10'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlot}
                  id="book-session-submit-btn"
                  className={`w-full py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedSlot 
                      ? 'bg-lime-400 text-slate-950 hover:bg-lime-350 glow-lime' 
                      : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  Confirm Reservation Slots
                </button>
              </form>

              {/* Client Review comments */}
              <div className="border-t border-white/5 pt-3.5 space-y-2">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Reviews Snippets</span>
                <div className="bg-slate-950/40 p-3 rounded-xl border border-white/5 italic text-[11px] text-slate-300 leading-normal flex items-start gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                  <p>"{selectedTrainer.reviews[0] || "Fully professional guidelines!"}"</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center text-slate-500" id="trainer-prompt-no-selection">
              <User className="w-8 h-8 text-lime-400/80 mx-auto mb-2.5 animate-pulse" />
              <p className="text-sm font-medium">No Coach Highlighted</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">Click on any trainer profile on the left column to configure appointment slots and review records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
