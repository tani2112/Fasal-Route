import React from 'react';
import { Leaf, HeartHandshake, Shield, Target, TrendingUp, Sparkles, Building2, Truck, CheckCircle2 } from 'lucide-react';

export const ImpactAboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="neo-pill bg-leaf/10 text-forest border-forest mx-auto">
          ● SUSTAINABLE DEVELOPMENT GOALS · EX-ONYX
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-soil">
          Stopping Post-Harvest Waste, One Spoken Decision at a Time
        </h1>
        <p className="text-sm sm:text-base text-soil-muted max-w-2xl mx-auto leading-relaxed">
          Indian farmers lose over ₹92,000 Crore annually to post-harvest distress selling and spoilage. FasalRoute combines open-weight AI with mathematical optimization to put real rupees back into farmers' pockets.
        </p>
      </div>

      {/* 3 SDGs Highlighted (SDG 1, SDG 2, SDG 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SDG 1 */}
        <div className="bg-white border-3 border-soil rounded-2xl p-5 shadow-neo hover:shadow-neo-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-tomato text-white flex items-center justify-center font-black font-mono text-sm border-2 border-soil mb-3">
            01
          </div>
          <h3 className="font-display font-extrabold text-base text-soil mb-1">
            SDG 1: No Poverty
          </h3>
          <p className="text-xs text-soil-muted leading-relaxed">
            Unlocking +₹4,200 on every 2 tonnes of tomatoes by optimizing sales between local and metropolitan mandis, turning marginal losses into household income.
          </p>
        </div>

        {/* SDG 2 */}
        <div className="bg-white border-3 border-soil rounded-2xl p-5 shadow-neo hover:shadow-neo-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber text-soil flex items-center justify-center font-black font-mono text-sm border-2 border-soil mb-3">
            02
          </div>
          <h3 className="font-display font-extrabold text-base text-soil mb-1">
            SDG 2: Zero Hunger
          </h3>
          <p className="text-xs text-soil-muted leading-relaxed">
            Eliminating blind rotting. Perishable crops like tomatoes and greens are routed with precise shelf-life stress calculations, minimizing field-to-fork spoilage.
          </p>
        </div>

        {/* SDG 12 */}
        <div className="bg-white border-3 border-soil rounded-2xl p-5 shadow-neo hover:shadow-neo-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-leaf text-white flex items-center justify-center font-black font-mono text-sm border-2 border-soil mb-3">
            12
          </div>
          <h3 className="font-display font-extrabold text-base text-soil mb-1">
            SDG 12: Responsible Consumption
          </h3>
          <p className="text-xs text-soil-muted leading-relaxed">
            Neighbour truck pooling reduces empty-truck deadheading, saving up to 75% on freight and significantly lowering rural agricultural carbon footprints.
          </p>
        </div>
      </div>

      {/* Sustainable Business Model */}
      <div className="bg-white border-3 border-soil rounded-2xl p-6 sm:p-8 shadow-neo-lg">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-soil/15 pb-3">
          <Building2 className="w-5 h-5 text-forest" />
          <h2 className="font-display font-extrabold text-xl text-soil">
            Business Model: Free for Farmers Forever
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-soil-muted mb-6 leading-relaxed">
          Smallholder farmers never pay a single rupee. Our monetization aligns with agricultural ecosystem efficiency:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-canvas p-4 rounded-xl border-2 border-soil">
            <span className="text-[10px] text-soil-muted uppercase font-bold block mb-1">Stream A</span>
            <span className="font-bold text-soil text-sm block mb-1">FPO Enterprise SaaS</span>
            <span className="text-soil-muted text-[11px] block">
              Farmer Producer Organizations pay an annual dashboard subscription for member harvest aggregation and scheduled pooling dispatch.
            </span>
          </div>

          <div className="bg-canvas p-4 rounded-xl border-2 border-soil">
            <span className="text-[10px] text-soil-muted uppercase font-bold block mb-1">Stream B</span>
            <span className="font-bold text-soil text-sm block mb-1">Logistics & Cold Storage</span>
            <span className="text-soil-muted text-[11px] block">
              Verified logistics providers and warehouse operators pay a transaction fee for pre-booked, aggregated return-trip freight loads.
            </span>
          </div>

          <div className="bg-canvas p-4 rounded-xl border-2 border-soil">
            <span className="text-[10px] text-soil-muted uppercase font-bold block mb-1">Stream C</span>
            <span className="font-bold text-soil text-sm block mb-1">Agri-Input Partnerships</span>
            <span className="text-soil-muted text-[11px] block">
              Targeted, seasonal recommendations for high-grade seeds, crates, and biological crop-preservation inputs from verified suppliers.
            </span>
          </div>
        </div>
      </div>

      {/* Team ex-ONYX */}
      <div className="bg-canvas-dark border-2 border-soil rounded-2xl p-6 text-center font-mono text-xs text-soil">
        <div className="font-display font-bold text-base text-forest mb-1">
          Crafted with care by Team ex-ONYX
        </div>
        <p className="text-soil-muted text-[11px] max-w-md mx-auto">
          Built for Indian smallholders across Karnataka, Maharashtra, Tamil Nadu, and North India using Sarvam AI Indic language intelligence.
        </p>
      </div>
    </div>
  );
};
