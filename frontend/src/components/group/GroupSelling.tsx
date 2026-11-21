import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Truck, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Scale } from 'lucide-react';

export const GroupSelling: React.FC = () => {
  const { t } = useTranslation();
  const [hasJoined, setHasJoined] = useState(false);
  const [farmerLoadKg, setFarmerLoadKg] = useState(800);

  const baseCapacityKg = 3000;
  const initialPooledKg = 2200;
  const currentPooledKg = hasJoined ? initialPooledKg + farmerLoadKg : initialPooledKg;
  const currentFarmersCount = hasJoined ? 4 : 3;

  const totalTruckCost = 2400;
  const soloTruckCost = 2400;
  const splitCostPerFarmer = Math.round(totalTruckCost / currentFarmersCount);
  const userSavings = soloTruckCost - splitCostPerFarmer;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            ● FPO-Coordinated Logistics
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
            {t('groups.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t('groups.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kolar Farmers Producer Org (FPO)</span>
        </div>
      </div>

      {/* Main Pool Card */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-forest">
                {t('groups.poolCardTitle')}
              </h3>
              <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Kolar Gate → KR Market (65 km)
                </span>
                <span>·</span>
                <span>Departure: Tonight 09:30 PM</span>
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
            DISPATCH CONFIRMED
          </span>
        </div>

        {/* Capacity Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Vehicle Capacity: {currentPooledKg.toLocaleString('en-IN')} / {baseCapacityKg.toLocaleString('en-IN')} kg</span>
            </span>
            <span className="font-bold text-emerald-700">
              {Math.round((currentPooledKg / baseCapacityKg) * 100)}% filled
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (currentPooledKg / baseCapacityKg) * 100)}%` }}
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-400">
            <span>Minimum threshold: 2,000 kg (Met)</span>
            <span>Space left: {baseCapacityKg - currentPooledKg} kg</span>
          </div>
        </div>

        {/* Freight Split Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <span className="text-[10px] text-gray-400 uppercase font-semibold block">
              Total Freight
            </span>
            <span className="text-xl font-bold font-display text-forest">
              ₹{totalTruckCost.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-gray-400 block mt-0.5">Fixed mini-truck rate</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">
              Cost Per Farmer
            </span>
            <span className="text-2xl font-bold font-display text-emerald-700">
              ₹{splitCostPerFarmer} each
            </span>
            <span className="text-[11px] text-emerald-800 block mt-0.5 font-medium">Shared by {currentFarmersCount} farmers</span>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <span className="text-[10px] text-amber-800 uppercase font-bold block">
              Your Net Saving
            </span>
            <span className="text-xl font-bold font-display text-amber-800">
              Save ₹{userSavings.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-700 block mt-0.5">vs ₹2,400 solo hire</span>
          </div>
        </div>

        {/* Participating Farmers */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase">
            Neighbours in this Pool ({currentFarmersCount})
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-forest">Ramesh Gowda (You)</span>
                <span className="text-[11px] text-gray-400 block">Kolar East · 800 kg Tomatoes</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${hasJoined ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
                {hasJoined ? 'JOINED' : 'OFFER'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-forest">Suresh Patel</span>
                <span className="text-[11px] text-gray-400 block">Vokkaliga Cross · 700 kg Tomatoes</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Target KR Market Price: <span className="font-bold text-emerald-700">₹2,350/qtl</span>
          </div>

          <button
            onClick={() => setHasJoined(!hasJoined)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-semibold text-xs transition-all ${
              hasJoined
                ? 'bg-emerald-100 text-emerald-800'
                : 'agro-btn-primary'
            }`}
          >
            {hasJoined ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Joined with 800 kg!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                Join Pool (Offer 800 kg)
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
