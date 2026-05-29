/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Search, 
  Star, 
  CheckCircle2, 
  Compass, 
  Bookmark, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { GymBranch } from '../types';

interface GymListingPageProps {
  gyms: GymBranch[];
  onAddGym?: (gymData: any) => void;
  isOwner: boolean;
}

export default function GymListingPage({
  gyms,
  onAddGym,
  isOwner
}: GymListingPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);

  // Modal State for new branch addition
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGymName, setNewGymName] = useState('');
  const [newGymPrice, setNewGymPrice] = useState('110');
  const [newGymCategory, setNewGymCategory] = useState('Strength');
  const [newGymDesc, setNewGymDesc] = useState('');
  const [newGymLocation, setNewGymLocation] = useState('');

  // Sourced location coordinates mapping inside San Francisco for map visualization
  const pins = [
    { id: 'gym-1', x: 280, y: 150, name: "Apex Elite Club" },
    { id: 'gym-2', x: 420, y: 220, name: "Iron Temple Strength Hub" },
    { id: 'gym-3', x: 190, y: 290, name: "Serene Breath Yoga" },
    { id: 'gym-4', x: 340, y: 340, name: "Pulse & Cardio Crossfit Box" }
  ];

  const handleCreateGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newGymLocation) return;
    if (onAddGym) {
      onAddGym({
        name: newGymName,
        location: newGymLocation,
        price: Number(newGymPrice) || 110,
        category: newGymCategory,
        description: newGymDesc,
        facilities: ['Olympic Weightlifting Platform', 'Organic Snack Bar', 'Steam Bath Rooms', 'Interactive AI Bio-Scanners']
      });
      setShowAddModal(false);
      // Reset form variables
      setNewGymName('');
      setNewGymLocation('');
      setNewGymDesc('');
    }
  };

  const filteredGyms = gyms.filter(gym => {
    const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          gym.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          gym.facilities.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || gym.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-7xl mx-auto">
      {/* Header Discovery section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
            Discovery Engine
          </span>
          <h1 className="font-display font-bold text-3xl text-white">
            Find Gym Branches & Clubs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Discover verified corporate structures and boutique athletic arenas mapped inside San Francisco state boundaries.
          </p>
        </div>

        {/* Gym owner branch addition */}
        {isOwner && (
          <button
            onClick={() => setShowAddModal(true)}
            id="owner-add-branch-btn"
            className="bg-lime-400 hover:bg-lime-350 text-slate-950 font-semibold text-xs font-mono tracking-wide uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-500/10 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Establish New Branch
          </button>
        )}
      </div>

      {/* Grid containing Filters and Live visual SVG Maps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Filter inputs and lists */}
        <div className="lg:col-span-7 space-y-6" id="gyms-list-container">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search inputs */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Search branches, trainers, sauna, platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            {/* Category Select Buttons */}
            <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none whitespace-nowrap">
              {['All', 'Premium', 'Strength', 'Yoga', 'Crossfit'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                    categoryFilter === cat 
                      ? 'bg-lime-400 text-slate-950 font-bold' 
                      : 'bg-white/5 text-slate-450 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List display */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredGyms.length === 0 ? (
              <div className="p-10 glass-panel rounded-2xl border border-white/5 text-center text-slate-500">
                <Compass className="w-8 h-8 text-lime-400 mx-auto mb-2.5 animate-bounce" />
                <p className="text-sm font-medium">No Gym Branches Match Current Filter Options</p>
                <p className="text-xs text-slate-600 mt-1">Try resetting keywords or listing standard categories.</p>
              </div>
            ) : (
              filteredGyms.map((gym) => {
                const isSelected = selectedGymId === gym.id;
                return (
                  <div
                    key={gym.id}
                    onClick={() => setSelectedGymId(gym.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col sm:flex-row gap-5 cursor-pointer hover:border-white/15 ${
                      isSelected 
                        ? 'bg-slate-900 border-lime-400/80 shadow-2xl shadow-lime-500/5' 
                        : 'bg-slate-900/40 border-white/5'
                    }`}
                    id={`gym-item-${gym.id}`}
                  >
                    <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden relative shrink-0">
                      <img
                        src={gym.imageUrl}
                        alt={gym.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-lime-400 font-bold">
                        {gym.category}
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className={`font-display font-bold text-base transition-colors ${isSelected ? 'text-lime-400' : 'text-white'}`}>
                            {gym.name}
                          </h3>
                          <div className="flex items-center text-xs font-mono text-amber-400 gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{gym.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-lime-500" />
                          {gym.location}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 pt-1">{gym.description}</p>
                      </div>

                      {/* Facilities list taglets */}
                      <div className="flex flex-wrap gap-1.5">
                        {gym.facilities.map((fac, i) => (
                          <span key={i} className="text-[9px] font-mono bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                            {fac}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-xs text-slate-400 font-mono">
                          Tier Starts: <strong className="text-white">${gym.price}/month</strong>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">Verified Active ✔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Virtual Interactive HUD Map Layout */}
        <div className="lg:col-span-5 sticky top-24" id="gyms-map-visualizer">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 text-left">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Interactive San Francisco Finder</h3>
                <p className="text-[10px] text-slate-400">Click coordinates/pins to toggle list details below.</p>
              </div>
              <Compass className="w-4.5 h-4.5 text-lime-400 animate-spin" />
            </div>

            {/* Map Canvas Background Vector representation */}
            <div className="bg-slate-950 aspect-[5/4] rounded-2xl relative overflow-hidden border border-white/5 flex items-center justify-center">
              {/* Fake Street Grids lines */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="w-full h-full bg-grid" style={{ backgroundImage: 'radial-gradient(ellipse, #ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                {/* Diagonal virtual freeway vectors */}
                <svg className="w-full h-full">
                  <line x1="0" y1="100" x2="500" y2="400" stroke="white" strokeWidth="2" />
                  <line x1="100" y1="0" x2="400" y2="500" stroke="white" strokeWidth="1" />
                  <circle cx="250" cy="250" r="140" stroke="white" strokeWidth="1" strokeDasharray="5,5" fill="none" />
                </svg>
              </div>

              {/* Bay Water and Peninsula Shore Representation */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-lime-500/5 blur-3xl rounded-full" />
              <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-600 bg-slate-900 border border-white/5 rounded px-2">Pacific Ocean (SF West)</div>

              {/* Pins Mapping */}
              {pins.map((pin) => {
                const isSelected = selectedGymId === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedGymId(pin.id)}
                    className="absolute group transition-transform duration-300"
                    style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
                  >
                    {/* Glowing Pin Vector */}
                    <div className="relative -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className={`p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg ${
                        isSelected 
                          ? 'bg-lime-400 text-slate-950 scale-125 glow-active' 
                          : 'bg-slate-900 border border-white/20 text-lime-400 hover:scale-110'
                      }`}>
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Dropdown label matching pointer hover */}
                      <span className={`absolute top-8 bg-slate-900 border border-white/10 text-[9px] font-mono rounded-lg px-2 py-0.5 text-slate-300 truncate max-w-[120px] shadow-2xl transition-opacity pointer-events-none ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        {pin.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add new Gym Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-md text-left space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Establish Gym SaaS Branch</h3>
            <p className="text-xs text-slate-400">Incorporate a new physical hub location into your enterprise SaaS operations network directory.</p>
            
            <form onSubmit={handleCreateGym} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Branch Identity Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Bay Front Gold"
                  value={newGymName}
                  onChange={(e) => setNewGymName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">SaaS Price ($/mo)</label>
                  <input
                    type="number"
                    value={newGymPrice}
                    onChange={(e) => setNewGymPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Workout Focus Category</label>
                  <select
                    value={newGymCategory}
                    onChange={(e) => setNewGymCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Strength">Strength</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Crossfit">Crossfit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Location Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 544 Marina Boulevard, SF"
                  value={newGymLocation}
                  onChange={(e) => setNewGymLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Brief Philosophy Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your gym's layout, target crowds, machines..."
                  value={newGymDesc}
                  onChange={(e) => setNewGymDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-lime-400 hover:bg-lime-350 text-slate-950 rounded-xl py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Submit Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
