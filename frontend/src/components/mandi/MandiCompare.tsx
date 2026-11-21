import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, TrendingUp, Truck, Scale, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { CROPS, MANDIS, SEEDED_RATES } from '../../lib/mandiData';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-soil/20 pb-4">
        <div>
          <div className="neo-pill bg-leaf/10 text-leaf border-leaf/60 mb-2">
            ● 5-MANDI REAL-TIME CORRIDOR
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-soil">
            {t('compare.title')}
          </h2>
          <p className="text-sm text-soil-muted mt-1">
            Kolar Agro-Hub baseline vs surrounding APMCs with shrinkage and diesel factored in.
          </p>
        </div>

        {/* Crop Selector Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-soil rounded-xl shadow-neo-sm">
          {cropsList.map((c) => {
            const isSelected = selectedCrop === c.id;
            const cropNameLocalized =
              i18n.language === 'kn' ? c.nameKn : i18n.language === 'hi' ? c.nameHi : c.name;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber text-soil border border-soil shadow-neo-sm'
                    : 'text-soil-muted hover:bg-canvas'
                }`}
              >
                {cropNameLocalized}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Baseline Pill Strip */}
      <div className="bg-canvas-light border-2 border-soil rounded-2xl p-4 shadow-neo-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-soil uppercase">Harvest Load:</span>
          <div className="flex items-center gap-1.5">
            {[1000, 2000, 5000].map((kg) => (
              <button
                key={kg}
                onClick={() => setQuantityKg(kg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  quantityKg === kg
                    ? 'bg-forest text-white border-soil'
                    : 'bg-white border-soil/30 text-soil hover:bg-canvas'
                }`}
              >
                {kg / 1000} Tonne{kg > 1000 ? 's' : ''} ({kg} kg)
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-soil-muted flex items-center gap-2">
          <span>Diesel: ₹92/L</span>
          <span>·</span>
          <span>Freight: ₹18/km</span>
          <span>·</span>
          <span className="text-leaf font-bold">Code Verified</span>
        </div>
      </div>

      {/* Comparison Cards Grid (Mobile) & Table (Desktop) */}
      <div className="space-y-3">
        {decision.allMandisComparison.map((row) => {
          const mandi = MANDIS[row.mandiId];
          const isBest = row.isBest;
          const isLocal = row.isLocal;

          return (
            <div
              key={row.mandiId}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                isBest
                  ? 'bg-white border-leaf shadow-neo-lg ring-2 ring-leaf/20'
                  : isLocal
                  ? 'bg-canvas-light border-soil shadow-neo'
                  : 'bg-white border-soil shadow-neo-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Mandi Title & Distance */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 border-soil flex items-center justify-center font-bold text-base ${
                      isBest
                        ? 'bg-leaf text-white'
                        : isLocal
                        ? 'bg-forest text-white'
                        : 'bg-canvas-dark text-soil'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-soil text-base sm:text-lg">
                        {i18n.language === 'kn' ? row.mandiNameKn : i18n.language === 'hi' ? row.mandiNameHi : row.mandiName}
                      </h3>
                      {isBest && (
                        <span className="px-2 py-0.5 rounded-full bg-leaf text-white text-[10px] font-mono font-bold uppercase">
                          HIGHEST NET PROFIT
                        </span>
                      )}
                      {isLocal && (
                        <span className="px-2 py-0.5 rounded-full bg-forest text-white text-[10px] font-mono font-bold uppercase">
                          LOCAL BASELINE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-soil-muted font-mono mt-0.5 flex items-center gap-2">
                      <span>{row.distanceKm === 0 ? '0 km (Farm gate)' : `${row.distanceKm} km`}</span>
                      {row.travelTimeHours > 0 && <span>· ~{row.travelTimeHours} hrs transit</span>}
                      <span>· {mandi.district}</span>
                    </div>
                  </div>
                </div>

                {/* Net In-Hand Rupee Tag */}
                <div className="flex sm:flex-col sm:items-end justify-between items-center border-t sm:border-t-0 border-soil/20 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-soil-muted uppercase font-bold block">
                      Net In-Hand / Qtl
                    </span>
                    <span className="text-xl sm:text-2xl font-black font-display text-soil">
                      ₹{row.netPerQuintal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {!isLocal && (
                    <div className="text-xs font-mono font-bold">
                      {row.netGainVsLocalPerQuintal > 0 ? (
                        <span className="text-leaf">
                          +₹{row.netGainVsLocalPerQuintal}/qtl vs Kolar
                        </span>
                      ) : (
                        <span className="text-tomato">
                          -₹{Math.abs(row.netGainVsLocalPerQuintal)}/qtl vs Kolar
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown Row */}
              <div className="mt-3.5 pt-3 border-t border-soil/15 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="bg-canvas p-2 rounded-lg border border-soil/20">
                  <span className="text-[10px] text-soil-muted block">APMC Price:</span>
                  <span className="font-bold text-soil">₹{row.ratePerQuintal}/qtl</span>
                </div>
                <div className="bg-canvas p-2 rounded-lg border border-soil/20">
                  <span className="text-[10px] text-soil-muted block">Transport Freight:</span>
                  <span className="font-bold text-soil">₹{row.transportCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-canvas p-2 rounded-lg border border-soil/20">
                  <span className="text-[10px] text-soil-muted block">Transit Shrinkage:</span>
                  <span className="font-bold text-tomato">-₹{row.shrinkageLossRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-canvas p-2 rounded-lg border border-soil/20">
                  <span className="text-[10px] text-soil-muted block">Total Load Profit:</span>
                  <span className="font-black text-forest">₹{row.netProfitFullLoad.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corridor Map/Route Visual Explainer */}
      <div className="bg-white border-2 border-soil rounded-2xl p-5 shadow-neo">
        <h4 className="font-bold text-sm text-soil uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3">
          <Navigation className="w-4 h-4 text-leaf" />
          <span>Kolar — Bengaluru Agro Route Corridor</span>
        </h4>
        <div className="relative p-4 rounded-xl bg-canvas border border-soil/30 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border-2 border-soil w-full sm:w-auto">
              <div className="font-bold text-forest">Kolar Farm Gate</div>
              <div className="text-[10px] text-soil-muted">0 km · Local Market</div>
              <div className="text-xs font-black text-amber mt-1">₹1,850/qtl</div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-soil-muted">NH-75 Express Highway · 65 km</span>
              <div className="w-24 sm:w-48 h-1 bg-soil my-1 relative">
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber border border-soil"></span>
              </div>
              <span className="text-[10px] text-tomato font-bold">2.2% Shrinkage</span>
            </div>

            <div className="bg-amber/20 p-3 rounded-xl border-2 border-soil w-full sm:w-auto">
              <div className="font-bold text-forest">KR Market Bengaluru</div>
              <div className="text-[10px] text-soil-muted">65 km · Urban Mega Hub</div>
              <div className="text-xs font-black text-forest mt-1">₹2,350/qtl (+₹500)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
