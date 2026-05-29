/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  UserCircle, 
  AlertCircle,
  HelpCircle,
  Bot,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatComponentProps {
  chatMessages: ChatMessage[];
  onSendMessage: (receiverId: string, content: string) => void;
  currentUserId: string;
}

export default function ChatComponent({
  chatMessages,
  onSendMessage,
  currentUserId
}: ChatComponentProps) {
  // Tabs: 'coach' (with Coach Elena, t-1), 'ai' (with AI chatbot, ai-assistant)
  const [activeTab, setActiveTab] = useState<'coach' | 'ai'>('coach');
  const [inputText, setInputText] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  const getTargetReceiverId = () => {
    return activeTab === 'coach' ? 't-1' : 'ai-assistant';
  };

  const filteredMessages = chatMessages.filter(msg => {
    if (activeTab === 'coach') {
      return (msg.senderId === 't-1' && msg.receiverId === currentUserId) || 
             (msg.senderId === currentUserId && msg.receiverId === 't-1');
    } else {
      return (msg.senderId === 'ai-assistant' && msg.receiverId === currentUserId) || 
             (msg.senderId === currentUserId && msg.receiverId === 'ai-assistant');
    }
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const receiver = getTargetReceiverId();
    const userText = inputText;
    setInputText('');

    if (receiver === 'ai-assistant') {
      setLoadingReply(true);
    } else {
      // Small simulated coach delay feel
      setTimeout(() => {
        // Coach replies
      }, 500);
    }

    onSendMessage(receiver, userText);

    if (receiver === 'ai-assistant') {
      // Wait for Gemini API response completion on backend
      setTimeout(() => {
        setLoadingReply(false);
      }, 1500);
    }
  };

  const getPartnerLabel = () => {
    return activeTab === 'coach' ? 'Coach Elena Grace' : 'Aura Core AI Architect';
  };

  const getPartnerBio = () => {
    return activeTab === 'coach' 
      ? 'Muscle recovery bodybuilding specialist & clinical nutritionist. Ask form postures!'
      : 'Gemini-3.5-flash client optimizer. Ask compound movements formulas or dietary macros.';
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-10 pb-20 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          Support Ecosystem
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Real-Time Coach & AI Chat
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Discuss sets and schedules directly with personal trainers, or query our smart LLM concierge for metabolic calculations.
        </p>
      </div>

      {/* Duel Conversational switcher tabs buttons */}
      <div className="flex gap-2.5 mb-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('coach')}
          id="chat-switch-to-coach"
          className={`flex-1 py-3 border rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            activeTab === 'coach' 
              ? 'bg-slate-900 border-lime-500/30 text-lime-400 glow-lime font-bold' 
              : 'bg-slate-900/35 border-white/5 text-slate-400 hover:border-white/10'
          }`}
        >
          <UserCircle className="w-4.5 h-4.5" />
          Talk to Coach Elena
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          id="chat-switch-to-ai"
          className={`flex-1 py-3 border rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
            activeTab === 'ai' 
              ? 'bg-slate-900 border-lime-500/30 text-lime-400 glow-lime font-bold' 
              : 'bg-slate-900/35 border-white/5 text-slate-400 hover:border-white/10'
          }`}
        >
          <Bot className="w-4.5 h-4.5 animate-bounce" />
          Aura AI Assistant (Gemini)
        </button>
      </div>

      {/* Main chat window box */}
      <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
        {/* Chat head */}
        <div className="bg-slate-900/60 p-4 border-b border-white/5 flex items-center justify-between text-left shrink-0">
          <div className="space-y-0.5">
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">{getPartnerLabel()}</h3>
            <p className="text-[10px] text-slate-450 truncate max-w-[280px] md:max-w-md">{getPartnerBio()}</p>
          </div>
          <span className="flex items-center text-[9px] font-mono text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/20">
            {activeTab === 'ai' ? 'ACTIVE GEMINI AI' : 'ACTIVE PT COACH'}
          </span>
        </div>

        {/* Messaging Logs container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/45 flex flex-col" id="chat-messages-container">
          {filteredMessages.length === 0 ? (
            <div className="my-auto text-center space-y-2 text-slate-500">
              <MessageCircle className="w-7 h-7 text-lime-400/80 mx-auto mb-1 animate-pulse" />
              <p className="text-xs font-semibold">No Conversation History Logged Here</p>
              <p className="text-[10px] text-slate-600 max-w-sm mx-auto">Write your first query lower block. Sourced neural prompts generate professional feedback within seconds.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isSelf = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1.5 text-left border relative ${
                    isSelf 
                      ? 'bg-lime-500/10 border-lime-500/30 ml-auto rounded-tr-none' 
                      : 'bg-slate-900 border-white/5 mr-auto rounded-tl-none'
                  }`}
                  id={`chat-msg-${msg.id}`}
                >
                  <p className="text-[9px] font-mono font-bold text-slate-500">
                    {isSelf ? 'You (Preeti)' : msg.senderName}
                  </p>
                  <p className="text-white leading-relaxed">{msg.content}</p>
                  
                  {/* Footer date */}
                  <span className="text-[8px] font-mono text-slate-600 text-right block pt-1 flex items-center justify-end gap-1.5">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}

          {/* Loading loader */}
          {loadingReply && (
            <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl mr-auto rounded-tl-none max-w-[50%] text-left space-y-1">
              <p className="text-[9px] font-mono font-bold text-lime-400 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" />
                AURA AI (Thinking Model API)...
              </p>
              <div className="flex gap-1 py-1.5 items-center justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping delay-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Form Sender inputs */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900/60 border-t border-white/5 flex gap-2.5 shrink-0 select-none">
          <input
            type="text"
            placeholder={activeTab === 'ai' ? 'Ask Aura: "What is an eccentric bench press?"' : 'Message Coach Elena Grace...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
            required
          />
          <button
            type="submit"
            id="chat-send-submit-btn"
            className="bg-lime-400 hover:bg-lime-350 text-slate-950 px-4.5 rounded-xl text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-950" />
          </button>
        </form>
      </div>
    </div>
  );
}
