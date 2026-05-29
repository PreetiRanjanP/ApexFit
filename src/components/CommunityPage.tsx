/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  MessageSquare, 
  ThumbsUp, 
  Sparkles, 
  Image, 
  Award,
  CirclePlay,
  Share2,
  Trash2
} from 'lucide-react';
import { CommunityPost, LeaderboardEntry } from '../types';

interface CommunityPageProps {
  posts: CommunityPost[];
  onCreatePost: (postData: { content: string; type: 'general' | 'transformation' | 'workout' }) => void;
  onLikePost: (postId: string) => void;
  currentUserId: string;
}

export default function CommunityPage({
  posts,
  onCreatePost,
  onLikePost,
  currentUserId
}: CommunityPageProps) {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'general' | 'transformation' | 'workout'>('general');

  // Hardcoded gamified leaderboard roster for premium SaaS competition feel
  const leaderboard: LeaderboardEntry[] = [
    { userId: 'u-admin', rank: 1, name: "Marcus J (Coach)", xpPoints: 12000, workoutsCompleted: 154 },
    { userId: 'u-trainer', rank: 2, name: "Trainer Elena Grace", xpPoints: 5600, workoutsCompleted: 98 },
    { userId: 'u-other-1', rank: 3, name: "Karan Singh", xpPoints: 4890, workoutsCompleted: 56 },
    { userId: 'u-member', rank: 4, name: "Preeti Ranjan (You)", xpPoints: 3450, workoutsCompleted: 42 },
    { userId: 'u-other-2', rank: 5, name: "Emma Watson", xpPoints: 2100, workoutsCompleted: 24 }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onCreatePost({
      content: newPostContent,
      type: newPostType
    });
    setNewPostContent('');
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          Gamified Community
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Standings Leaderboard & Feed
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Discuss exercises with gym buddies, like nutrition achievements, review transformation layouts, and compete on the global XP registry!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Feed and posting form */}
        <div className="lg:col-span-8 space-y-6" id="community-feed-column">
          {/* Post creator form */}
          <div className="glass-panel rounded-3xl p-5 border border-white/10 text-left space-y-4">
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Write a Community Broadcast</span>
            
            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              <textarea
                rows={3}
                placeholder="Log a gym checkin, share muscle milestones, or document diet goals..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 shrink-0 resize-none"
                required
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Category selectors */}
                <div className="flex gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setNewPostType('general')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors uppercase cursor-pointer ${
                      newPostType === 'general' ? 'bg-white/10 text-white font-bold' : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    💬 General Post
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType('workout')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors uppercase cursor-pointer ${
                      newPostType === 'workout' ? 'bg-lime-500/20 text-lime-400 font-bold border border-lime-500/20' : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    🏋️ Workouts
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPostType('transformation')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors uppercase cursor-pointer ${
                      newPostType === 'transformation' ? 'bg-amber-500/20 text-text-amber-400 font-bold border border-amber-500/20' : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    ✨ Transformation
                  </button>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    id="submit-feed-post-btn"
                    className="flex-1 sm:flex-initial bg-lime-400 hover:bg-lime-350 text-slate-950 px-5 rounded-xl py-2 text-xs font-semibold cursor-pointer text-center"
                  >
                    Post Broadcast
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Feed listing */}
          <div className="space-y-4" id="community-posts-feed">
            {posts.map((post) => (
              <div
                key={post.id}
                className="glass-panel rounded-3xl p-5 border border-white/5 space-y-4 text-left hover:border-white/10 transition-all"
                id={`feed-post-${post.id}`}
              >
                {/* Author row */}
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-white">{post.authorName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">Role: {post.authorRole}</p>
                    </div>
                  </div>
                  {/* Category badge Tag */}
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
                    post.type === 'workout' 
                      ? 'bg-lime-500/10 text-lime-400 border-lime-500/20' 
                      : post.type === 'transformation' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : 'bg-white/5 text-slate-400 border-white/5'
                  }`}>
                    {post.type}
                  </span>
                </div>

                {/* Content body */}
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Optional transformed illustration image */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden max-h-80 border border-white/5 relative">
                    <img
                      src={post.imageUrl}
                      alt="Story Upload Attachment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  </div>
                )}

                {/* Interaction Row */}
                <div className="flex items-center gap-6 border-t border-white/5 pt-3.5 text-xs text-slate-400">
                  <button
                    onClick={() => onLikePost(post.id)}
                    id={`like-post-btn-${post.id}`}
                    className={`flex items-center gap-1.5 hover:text-lime-400 cursor-pointer transition-colors ${
                      post.isLiked ? 'text-lime-400 font-bold' : ''
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-lime-400' : ''}`} />
                    <span>{post.likesCount} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span>{post.commentsCount} Comments</span>
                  </div>

                  <span className="ml-auto text-[9px] font-mono text-slate-500">
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Tab columns: Gamified Leaderboard */}
        <div className="lg:col-span-4 sticky top-24" id="community-standings-ranks">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3 text-left">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Global Standings</h3>
                <p className="text-[10px] text-slate-400">XP point allocations and finished logs</p>
              </div>
              <Trophy className="w-4.5 h-4.5 text-amber-500 fill-amber-500 animate-pulse" />
            </div>

            {/* List entries */}
            <div className="space-y-2.5">
              {leaderboard.map((user) => {
                const isYou = user.userId === 'u-member';
                return (
                  <div
                    key={user.userId}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      isYou 
                        ? 'bg-lime-500/10 border-lime-500/30' 
                        : 'bg-slate-950/40 border-white/5'
                    }`}
                    id={`leaderboard-item-rank-${user.rank}`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {/* Rank Indicator Badge */}
                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border ${
                        user.rank === 1 
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                          : user.rank === 2 
                            ? 'bg-slate-300/20 border-slate-300/30 text-slate-300' 
                            : user.rank === 3 
                              ? 'bg-amber-700/20 border-amber-700/30 text-amber-600'
                              : 'bg-white/5 border-white/5 text-slate-400'
                      }`}>
                        #{user.rank}
                      </span>
                      <div>
                        <span className={`text-xs font-semibold block ${isYou ? 'text-lime-400' : 'text-slate-200'}`}>
                          {user.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Completed: {user.workoutsCompleted} sessions</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-white block">
                        {user.xpPoints} XP
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">⚡ Active Leader</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
