import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, TrendingUp, Truck, Scale, ShieldCheck, ArrowRight } from 'lucide-react';
import { CROPS, MANDIS } from '../../lib/mandiData';
import { optimizeHarvestDecision } from '../../lib/offlineEngine';

export const MandiCompare: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [quantityKg, setQuantityKg] = useState<number>(2000);

  const decision = optimizeHarvestDecision({
    cropId: selectedCrop,
    quantityKg,
    localMandiId: 'kolar',
  });

  const cropsList = Object.values(CROPS);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            ● 5-Mandi Real-Time Corridor
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
            {t('compare.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kolar Agro-Hub baseline vs surrounding APMCs with shrinkage and diesel factored in.
          </p>
        </div>

        {/* Crop Selector Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-emerald-100 rounded-full shadow-xs">
          {cropsList.map((c) => {
            const isSelected = selectedCrop === c.id;
            const cropNameLocalized =
              i18n.language === 'kn' ? c.nameKn : i18n.language === 'hi' ? c.nameHi : c.name;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {cropNameLocalized}
              </button>
            );
          })}
        </div>
      </div>

      {/* Harvest Load Filter */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500">Harvest Weight:</span>
          <div className="flex items-center gap-1.5">
            {[1000, 2000, 5000].map((kg) => (
              <button
                key={kg}
                onClick={() => setQuantityKg(kg)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  quantityKg === kg
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {kg / 1000} Tonne{kg > 1000 ? 's' : ''} ({kg} kg)
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span>Diesel: ₹92/L</span>
          <span>·</span>
          <span>Freight: ₹14/km</span>
          <span>·</span>
          <span className="text-emerald-600 font-medium">100% Code Verified</span>
        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="space-y-3">
        {decision.allMandisComparison.map((row) => {
          const mandi = MANDIS[row.mandiId];
          const isBest = row.isBest;
          const isLocal = row.isLocal;

          return (
            <div
              key={row.mandiId}
              className={`p-5 rounded-3xl bg-white border transition-all ${
                isBest
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                  : 'border-emerald-100 shadow-xs hover:border-emerald-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      isBest
                        ? 'bg-emerald-600 text-white'
                        : isLocal
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-forest text-base sm:text-lg">
                        {i18n.language === 'kn' ? row.mandiNameKn : i18n.language === 'hi' ? row.mandiNameHi : row.mandiName}
                      </h3>
                      {isBest && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          HIGHEST NET
                        </span>
                      )}
                      {isLocal && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                          LOCAL BASELINE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{row.distanceKm === 0 ? '0 km (Farm gate)' : `${row.distanceKm} km`}</span>
                      {row.travelTimeHours > 0 && <span>· ~{row.travelTimeHours}h transit</span>}
                      <span>· {mandi.district}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase block">
                      Net In-Hand / Qtl
                    </span>
                    <span className="text-2xl font-bold font-display text-forest">
                      ₹{row.netPerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {!isLocal && (
                    <div className="text-xs font-semibold">
                      {row.netGainVsLocalPerQuintal > 0 ? (
                        <span className="text-emerald-600 font-bold">
                          +₹{row.netGainVsLocalPerQuintal}/qtl vs Kolar
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold">
                          -₹{Math.abs(row.netGainVsLocalPerQuintal)}/qtl vs Kolar
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-medium">Mandi Price:</span>
                  <span className="font-bold text-gray-800 font-mono">₹{row.ratePerQuintal}/qtl</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-medium">Transport Freight:</span>
                  <span className="font-bold text-gray-800 font-mono">₹{row.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-gray-400 block font-medium">Transit Shrinkage:</span>
                  <span className="font-bold text-red-600 font-mono">-₹{row.shrinkageLossRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-emerald-50/70 p-2.5 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-medium">Total Net Profit:</span>
                  <span className="font-extrabold text-emerald-800 font-mono">₹{row.netProfitFullLoad.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
