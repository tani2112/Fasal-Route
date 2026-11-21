import React from 'react';
import { Leaf, Building2, Shield, Target, TrendingUp, CheckCircle2 } from 'lucide-react';

export const ImpactAboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          ● Sustainable Development Goals · Team ex-ONYX
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-forest">
          Stopping Post-Harvest Waste, One Spoken Decision at a Time
        </h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Indian farmers lose over ₹92,000 Crore annually to post-harvest distress selling. FasalRoute combines open-weight AI with mathematical optimization to put real rupees back into farmers' pockets.
        </p>
      </div>

      {/* 3 SDGs Highlighted (SDG 1, SDG 2, SDG 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm mb-3">
            01
          </div>
          <h3 className="font-display font-bold text-base text-forest mb-1">
            SDG 1: No Poverty
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Unlocking +₹4,200 on every 2 tonnes of tomatoes by optimizing sales between local and metropolitan mandis, turning distress sales into household income.
          </p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm mb-3">
            02
          </div>
          <h3 className="font-display font-bold text-base text-forest mb-1">
            SDG 2: Zero Hunger
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Eliminating blind rotting. Perishable crops like tomatoes and greens are routed with precise shelf-life stress calculations, minimizing field-to-fork spoilage.
          </p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
            12
          </div>
          <h3 className="font-display font-bold text-base text-forest mb-1">
            SDG 12: Responsible Consumption
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Neighbour truck pooling reduces empty-truck deadheading, saving up to 75% on freight and lowering rural agricultural carbon footprints.
          </p>
        </div>
      </div>

      {/* Sustainable Business Model */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <h2 className="font-display font-bold text-xl text-forest">
            Business Model: Free for Farmers Forever
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Smallholder farmers never pay a single rupee. Our monetization aligns with agricultural ecosystem efficiency:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-bold block mb-1">Stream A</span>
            <span className="font-bold text-forest text-sm block mb-1">FPO Enterprise SaaS</span>
            <span className="text-gray-500 text-[11px] block">
              Farmer Producer Organizations pay an annual dashboard subscription for member harvest aggregation and scheduled pooling dispatch.
            </span>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-bold block mb-1">Stream B</span>
            <span className="font-bold text-forest text-sm block mb-1">Logistics & Cold Storage</span>
            <span className="text-gray-500 text-[11px] block">
              Verified logistics providers and warehouse operators pay a transaction fee for pre-booked, aggregated return-trip freight loads.
            </span>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-bold block mb-1">Stream C</span>
            <span className="font-bold text-forest text-sm block mb-1">Agri-Input Partnerships</span>
            <span className="text-gray-500 text-[11px] block">
              Targeted, seasonal recommendations for high-grade seeds, crates, and biological crop-preservation inputs from verified suppliers.
            </span>
          </div>
        </div>
      </div>

      {/* Team ex-ONYX */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 text-center text-xs">
        <div className="font-display font-bold text-base text-white mb-1">
          Crafted with care by Team ex-ONYX
        </div>
        <p className="text-emerald-200 text-[11px] max-w-md mx-auto">
          Built for Indian smallholders across Karnataka, Maharashtra, Tamil Nadu, and North India using Sarvam AI Indic language intelligence.
        </p>
      </div>
    </div>
  );
};
