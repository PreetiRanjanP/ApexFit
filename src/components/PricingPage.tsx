/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Flame, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (plan: { id: string; name: string; price: number }) => void;
  currentPlanId?: string;
  setActiveTab: (tab: string) => void;
}

export default function PricingPage({
  onSelectPlan,
  currentPlanId,
  setActiveTab
}: PricingPageProps) {
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free Starter Pass',
      price: 0,
      period: 'lifetime',
      description: 'Ideal for fitness enthusiasts exploring the platform.',
      features: [
        'Access to basic gym listings',
        'Manual workout tracker log',
        'Daily step leaderboard',
        'Standard notification alerts'
      ],
      cta: 'Get Started Free',
      isPopular: false
    },
    {
      id: 'pro-monthly',
      name: 'Apex Pro Club',
      price: 49,
      period: 'month',
      description: 'The definitive tier for serious athletes and routine logs.',
      features: [
        'Everything in Free Starter Pass',
        'Unlimited AI Workout Generators (Gemini)',
        'Unlimited AI Diet Plan Recommendations',
        'Real-time Chat with Coach Elena Grace',
        'Book Personal Training slots & Group classes',
        'Exclusive Streak awards (+1000 XP points)'
      ],
      cta: 'Upgrade to Pro Pass',
      isPopular: true
    },
    {
      id: 'enterprise-annual',
      name: 'Unlimited Elite VIP',
      price: 199,
      period: 'month',
      description: 'All-inclusive multi-branch coverage and VIP coaching.',
      features: [
        'Everything in Apex Pro Club',
        'All-branch network validation access',
        'Locker, Sauna & organic juice bar lounge included',
        '24/7 dedicated medical nutritionist chat',
        '1-on-1 weekly posture audit checkups',
        'VIP access to custom local challenges'
      ],
      cta: 'Go VIP Elite',
      isPopular: false
    }
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'FIT50') {
      setDiscountApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try entering "FIT50" for 50% mock discount!');
      setDiscountApplied(false);
    }
  };

  return (
    <div className="text-white min-h-screen font-sans bg-transparent px-4 md:px-8 py-12 pb-20 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3 mb-12 text-left md:text-center max-w-2xl mx-auto">
        <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
          Flexible Subscriptions
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">
          SaaS Tiers & Membership Plans
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Unlock state-of-the-art training facilities, AI engines, and coaching portals. Choose a plan tailored to your athletic objectives.
        </p>
      </div>

      {/* Coupon Applied Highlight Grid */}
      <div className="max-w-md mx-auto mb-10 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl p-4 text-center">
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            placeholder="PROMO CODE (e.g. FIT50)"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 uppercase font-mono text-center text-white"
          />
          <button
            type="submit"
            className="bg-white/10 hover:bg-white/15 px-4 rounded-xl text-xs font-mono font-medium text-white transition-colors cursor-pointer"
          >
            Apply Code
          </button>
        </form>
        {discountApplied && (
          <p className="text-emerald-400 text-[11px] font-mono mt-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Promotion validated: FIT50 (50% Off Mock Checkout Selected)
          </p>
        )}
        {couponError && (
          <p className="text-rose-400 text-[11px] font-mono mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {couponError}
          </p>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
        {plans.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          const originalPrice = plan.price;
          const currentPrice = discountApplied ? Math.round(originalPrice * 0.5) : originalPrice;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-white/[0.03] border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.01]'
                  : 'bg-white/[0.02] border border-white/5'
              }`}
              id={`pricing-card-${plan.id}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-display font-semibold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Most Popular Pass
                </div>
              )}

              <div className="space-y-4">
                <div className="text-left space-y-1">
                  <h3 className="font-display font-extrabold text-lg text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 text-left py-2 border-y border-white/5">
                  <span className="text-3xl font-display font-extrabold text-white">
                    ${currentPrice}
                  </span>
                  {plan.price > 0 && discountApplied && (
                    <span className="text-sm line-through text-slate-500 font-mono ml-1.5">${originalPrice}</span>
                  )}
                  <span className="text-slate-400 text-xs font-mono ml-1">
                    / {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 pt-2 text-left" id={`features-list-${plan.id}`}>
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                      <div className="bg-blue-500/15 p-0.5 rounded text-blue-400 mt-0.5"><Check className="w-3 h-3" /></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    onSelectPlan({
                      id: plan.id,
                      name: plan.name,
                      price: currentPrice
                    });
                    setActiveTab('checkout');
                  }}
                  id={`pricing-select-${plan.id}`}
                  className={`w-full text-center py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                      : plan.isPopular
                        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  {isCurrent ? '✓ Currently Active' : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center max-w-md mx-auto text-[11px] text-slate-500 border-t border-white/5 pt-6 font-mono leading-normal">
        <p>Looking for a specialized multi-user branch enterprise plan for gym management networks? Contact partners@apexfit.com for custom multi-tenant setups.</p>
      </div>
    </div>
  );
}
