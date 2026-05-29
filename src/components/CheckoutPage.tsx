/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Printer, 
  Dumbbell,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CheckoutPageProps {
  selectedPlan: { id: string; name: string; price: number } | null;
  onConfirmPurchase: (checkoutParams: { planId: string; planName: string; price: number }) => void;
  userEmail: string;
}

export default function CheckoutPage({
  selectedPlan,
  onConfirmPurchase,
  userEmail
}: CheckoutPageProps) {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCVC, setCardCVC] = useState('242');
  const [cardHolder, setCardHolder] = useState('Preeti Ranjan');
  
  const [couponCode, setCouponCode] = useState('FIT50');
  const [discountApplied, setDiscountApplied] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [invoiceResult, setInvoiceResult] = useState<any | null>(null);

  const finalPlan = selectedPlan || {
    id: 'pro-monthly',
    name: 'Apex Pro Club Plan',
    price: 49
  };

  const finalPrice = discountApplied ? Math.round(finalPlan.price * 0.5) : finalPlan.price;

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      onConfirmPurchase({
         planId: finalPlan.id,
         planName: finalPlan.name,
         price: finalPrice
      });

      setInvoiceResult({
        invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        planName: finalPlan.name,
        chargedAmount: finalPrice,
        gateway: "Stripe secure gateway (Card Ending 4242)",
        email: userEmail
      });

      setProcessing(false);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="text-white min-h-screen font-sans bg-slate-950 px-4 md:px-8 py-12 pb-20 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-left space-y-2 mb-8">
        <span className="text-[10px] uppercase font-mono tracking-widest text-lime-400 bg-lime-500/10 px-3 py-1 rounded-full">
          SaaS Billing Gateway
        </span>
        <h1 className="font-display font-bold text-3xl text-white">
          Secure Stripe Checkout
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Complete your subscription transaction. All credit cards processed securely using high-grade sandbox tokenizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Credit inputs */}
        <div className="md:col-span-7 space-y-6" id="checkout-form-column">
          {!invoiceResult ? (
            <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-5 text-left bg-gradient-to-tr from-slate-950 to-slate-900">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-semibold text-white uppercase font-mono tracking-wider">SECURE SANDBOX TRANSACTION</span>
                </div>
                <ShieldCheck className="w-5 h-5 text-lime-400" />
              </div>

              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Card Number (Mock Input)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
                      required
                    />
                    <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Expiration Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono text-center"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400">CVV / CVC Code</label>
                    <input
                      type="password"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-lime-400 font-mono text-center"
                      maxLength={3}
                      required
                    />
                  </div>
                </div>

                {/* Secure information details */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-[10px] text-slate-500 leading-normal font-mono">
                  🔑 ApexFit standardizes AES-256 endpoint integrations. Ingesting test parameters (Visa 4242) acts as instant verification to activate premium dashboard streams.
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  id="stripe-checkout-process-btn"
                  className={`w-full py-4 bg-lime-400 hover:bg-lime-350 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-lime-500/10 ${
                    processing ? 'brightness-50 cursor-wait' : ''
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Securing Encrypted Handshake...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      Authorize & Pay ${finalPrice} Securely
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* PRINTABLE INVOICE COMPONENT */
            <div id="checkout-invoice-view" className="bg-white text-slate-950 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl text-left border border-slate-200">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="bg-slate-950 text-white p-1.5 rounded-lg">
                      <Dumbbell className="w-5 h-5 font-bold" />
                    </div>
                    <span className="font-display font-extrabold text-base tracking-tight">APEXFIT SaaS</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Platform ID: SF-MAIN-94103</p>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-800 border border-emerald-500/30 font-mono font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                    ✓ Paid & Completed
                  </span>
                  <p className="text-slate-500 text-[10px] font-mono mt-1.5">Invoice: {invoiceResult.invoiceId}</p>
                </div>
              </div>

              {/* Invoice details body */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[9px] font-mono">Billed To</p>
                  <p className="font-bold text-slate-900 mt-0.5">{cardHolder}</p>
                  <p className="text-slate-500 text-[10px] truncate">{invoiceResult.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 font-semibold uppercase text-[9px] font-mono">Billing Date</p>
                  <p className="font-mono text-slate-900 mt-0.5">{invoiceResult.date}</p>
                  <p className="text-slate-500 text-[10px]">Auto-renewal monthly</p>
                </div>
              </div>

              {/* Receipt Table */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-mono text-slate-400">
                      <th className="text-left pb-2">Description</th>
                      <th className="text-right pb-2">Duration</th>
                      <th className="text-right pb-2">Promo Code</th>
                      <th className="text-right pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 font-bold text-slate-900">
                      <td className="py-2.5">{invoiceResult.planName}</td>
                      <td className="text-right font-mono py-2.5">30 Days</td>
                      <td className="text-right font-mono text-emerald-600 py-2.5">{discountApplied ? 'FIT50 (-50%)' : 'None'}</td>
                      <td className="text-right font-mono py-2.5">${invoiceResult.chargedAmount}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <span className="font-bold text-slate-700">Charged Total (Charged Billed)</span>
                <span className="font-mono font-black text-slate-950 text-sm">${invoiceResult.chargedAmount}.00 USD</span>
              </div>

              {/* Action for invoice */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print/Save Invoice
                </button>
                <button
                  onClick={() => setInvoiceResult(null)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Confirm & Lock Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order summary overview */}
        <div className="md:col-span-5" id="checkout-summary-column">
          <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-5 text-left">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Order Summary</span>
            
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <p className="text-sm font-semibold">{finalPlan.name}</p>
                <span className="text-xs font-mono text-slate-400">${finalPlan.price}/mo</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between items-center text-xs text-lime-400 font-mono">
                  <span>FIT50 Coupon discount</span>
                  <span>- ${Math.round(finalPlan.price * 0.5)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-semibold text-white">Charged Billed:</span>
                <strong className="text-lime-400 font-mono text-base">${finalPrice}.50*</strong>
              </div>
            </div>

            {/* High XP notifications incentives */}
            <div className="p-3 bg-lime-500/10 border border-lime-500/15 rounded-xl text-xs leading-normal text-lime-300 flex items-start gap-1.5">
              <Sparkles className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[10px] uppercase font-mono block">Premium XP rewards</span>
                <p className="text-[11px] text-slate-300 leading-normal">Purchasing this membership awards 1,000 global XP Points to your account standings standings instantly!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
