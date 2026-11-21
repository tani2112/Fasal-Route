import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Truck, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Sparkles, Scale } from 'lucide-react';

export const GroupSelling: React.FC = () => {
  const { t } = useTranslation();
  const [hasJoined, setHasJoined] = useState(false);
  const [farmerLoadKg, setFarmerLoadKg] = useState(800);

  // Initial pool state: 3 farmers pooling 2,200 kg in a 3,000 kg mini-truck
  const baseCapacityKg = 3000;
  const initialPooledKg = 2200;
  const currentPooledKg = hasJoined ? initialPooledKg + farmerLoadKg : initialPooledKg;
  const currentFarmersCount = hasJoined ? 4 : 3;

  const totalTruckCost = 2400; // ₹2,400 Kolar -> KR Market Bengaluru mini-truck
  const soloTruckCost = 2400; // If one farmer went alone
  const splitCostPerFarmer = Math.round(totalTruckCost / currentFarmersCount);
  const userSavings = soloTruckCost - splitCostPerFarmer;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-soil/20 pb-4">
        <div>
          <div className="neo-pill bg-leaf/15 text-forest border-soil mb-2">
            ● FPO-COORDINATED LOGISTICS
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-soil">
            {t('groups.title')}
          </h2>
          <p className="text-sm text-soil-muted mt-1">
            {t('groups.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-soil shadow-neo-sm text-xs font-mono font-bold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-leaf" />
          <span>Kolar Farmers Producer Org (FPO)</span>
        </div>
      </div>

      {/* Main Pool Card */}
      <div className="bg-white border-3 border-soil rounded-2xl p-5 sm:p-7 shadow-neo-lg relative overflow-hidden">
        {/* Pool Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-soil/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber border-2 border-soil flex items-center justify-center font-bold">
              <Truck className="w-6 h-6 text-soil" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-soil">
                {t('groups.poolCardTitle')}
              </h3>
              <div className="text-xs font-mono text-soil-muted flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-leaf" />
                  Kolar Gate → KR Market (65 km)
                </span>
                <span>·</span>
                <span>Departure: Tonight 09:30 PM</span>
              </div>
            </div>
          </div>

          <span className="neo-badge bg-leaf text-white border-soil self-start sm:self-auto">
            DISPATCH CONFIRMED
          </span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="my-5">
          <div className="flex justify-between items-center text-xs font-mono mb-2">
            <span className="font-bold text-soil flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-forest" />
              <span>{t('groups.capacity')}: {currentPooledKg.toLocaleString('en-IN')} / {baseCapacityKg.toLocaleString('en-IN')} kg</span>
            </span>
            <span className="font-bold text-leaf">
              {Math.round((currentPooledKg / baseCapacityKg) * 100)}% {t('groups.pooled')}
            </span>
          </div>

          <div className="w-full h-5 rounded-full bg-canvas-dark border-2 border-soil p-0.5 overflow-hidden shadow-neo-sm">
            <div
              style={{ width: `${Math.min(100, (currentPooledKg / baseCapacityKg) * 100)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-leaf to-amber transition-all duration-300 border-r border-soil"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-soil-muted mt-1.5">
            <span>Minimum dispatch threshold: 2,000 kg (Met)</span>
            <span>Space remaining: {baseCapacityKg - currentPooledKg} kg</span>
          </div>
        </div>

        {/* Freight Cost Split Callout (from user spec) */}
        <div className="my-5 p-4 rounded-xl bg-canvas border-2 border-soil grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-soil/30 shadow-neo-sm">
            <span className="text-[10px] font-mono text-soil-muted block uppercase">
              Total Mini-Truck Freight
            </span>
            <span className="text-xl font-display font-black text-soil">
              ₹{totalTruckCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-mono text-soil-muted block mt-0.5">
              Fixed driver & diesel rate
            </span>
          </div>

          <div className="bg-amber/20 p-3 rounded-xl border-2 border-soil shadow-neo-sm">
            <span className="text-[10px] font-mono text-forest font-bold block uppercase">
              Cost Per Farmer
            </span>
            <span className="text-2xl font-display font-black text-forest">
              ₹{splitCostPerFarmer} each
            </span>
            <span className="text-[10px] font-mono text-forest block mt-0.5 font-bold">
              Shared by {currentFarmersCount} farmers
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-soil/30 shadow-neo-sm">
            <span className="text-[10px] font-mono text-leaf font-bold block uppercase">
              Your Net Freight Saving
            </span>
            <span className="text-xl font-display font-black text-leaf">
              Save ₹{userSavings.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-mono text-soil-muted block mt-0.5">
              vs ₹2,400 solo hire
            </span>
          </div>
        </div>

        {/* Participating Farmers Roster */}
        <div className="my-4 border-t border-soil/20 pt-4">
          <div className="text-xs font-mono font-bold text-soil-muted uppercase mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-forest" />
              <span>Neighbours in this Pool ({currentFarmersCount})</span>
            </span>
            <span className="text-[10px]">Verified FPO Members</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-canvas-light border border-soil/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-soil">Ramesh Gowda (You)</span>
                <span className="text-[10px] text-soil-muted block">Kolar East · 800 kg Tomatoes</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${hasJoined ? 'bg-leaf text-white' : 'bg-canvas-dark text-soil'}`}>
                {hasJoined ? 'JOINED' : 'OFFER'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas-light border border-soil/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-soil">Suresh Patel</span>
                <span className="text-[10px] text-soil-muted block">Vokkaliga Cross · 700 kg Tomatoes</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-leaf text-white font-bold">CONFIRMED</span>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas-light border border-soil/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-soil">Manjunath K.</span>
                <span className="text-[10px] text-soil-muted block">Tamaka Village · 500 kg Tomatoes</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-leaf text-white font-bold">CONFIRMED</span>
            </div>

            <div className="p-2.5 rounded-xl bg-canvas-light border border-soil/30 flex items-center justify-between">
              <div>
                <span className="font-bold text-soil">Anand Kumar</span>
                <span className="text-[10px] text-soil-muted block">Bethamangala · 200 kg Grade-A</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-leaf text-white font-bold">CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* Join CTA Action */}
        <div className="mt-5 pt-4 border-t-2 border-soil/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-soil-muted font-sans text-center sm:text-left">
            Target KR Market Price: <span className="font-bold text-forest">₹2,350/qtl</span> · Arrives before 04:00 AM auction.
          </div>

          <button
            onClick={() => setHasJoined(!hasJoined)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-soil font-bold text-sm shadow-neo transition-all ${
              hasJoined
                ? 'bg-leaf text-white hover:bg-leaf-light'
                : 'bg-amber text-soil hover:bg-amber-hover hover:-translate-y-0.5'
            }`}
          >
            {hasJoined ? (
              <span className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {t('groups.joined')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <Truck className="w-4 h-4" />
                {t('groups.joinBtn')}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
