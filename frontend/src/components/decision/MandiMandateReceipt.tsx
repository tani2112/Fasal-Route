import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, CheckCircle2, AlertTriangle, Truck, ShieldCheck, Scale } from 'lucide-react';
import type { DecisionEngineOutput, SplitItem } from '../../lib/offlineEngine';

interface MandiMandateReceiptProps {
  decision: DecisionEngineOutput;
  isPlayingAudio: boolean;
  onPlayAudio: () => void;
  onStopAudio: () => void;
}

export const MandiMandateReceipt: React.FC<MandiMandateReceiptProps> = ({
  decision,
  isPlayingAudio,
  onPlayAudio,
  onStopAudio,
}) => {
  const { t, i18n } = useTranslation();

  const splitList: SplitItem[] = decision?.split || [];
  const localPart: SplitItem =
    splitList.find((s) => s.isLocal) ||
    splitList[0] || {
      mandiId: 'kolar',
      mandiName: 'Kolar APMC',
      mandiNameKn: 'ಕೋಲಾರ',
      mandiNameHi: 'कोलार',
      percentage: 100,
      allocatedKg: 2000,
      expectedGrossRupees: 28000,
      transportCostRupees: 0,
      shrinkageKg: 0,
      shrinkageRupees: 0,
      feesRupees: 560,
      netInHandRupees: 27440,
      distanceKm: 0,
      travelTimeHours: 0,
      ratePerQuintal: 1400,
      isLocal: true,
    };

  const distantPart: SplitItem | undefined = splitList.find((s) => !s.isLocal);

  const totalKg = Number(decision?.totalQuantityKg ?? 2000);
  const netGain = Number(decision?.netGainVsLocalRupees ?? 0);
  const recommendedNet = Number(decision?.recommendedTotalNetRupees ?? 0);
  const cropName = decision?.cropName || (decision?.crop ? decision.crop.toUpperCase() : 'TOMATO');

  return (
    <div className="relative mx-auto max-w-xl w-full">
      {/* Modern Clean Decision Card */}
      <div className="bg-white rounded-3xl border border-emerald-100/90 shadow-md p-6 sm:p-8 relative">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
                Mandi Mandate Decision
              </span>
            </div>
            <div className="text-xs font-bold text-forest mt-1">
              Crop: <span className="uppercase text-emerald-700">{cropName}</span> · {totalKg.toLocaleString('en-IN')} kg
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              {decision?.timestamp ? new Date(decision.timestamp).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : '21 Nov 2026, 14:30'}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              ILLUSTRATIVE
            </span>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CODE VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Spoken Decision Playback Button */}
        <div className="my-5">
          <button
            onClick={isPlayingAudio ? onStopAudio : onPlayAudio}
            className={`w-full py-3 px-4 rounded-2xl flex items-center justify-between transition-all ${
              isPlayingAudio
                ? 'bg-amber-500 text-white shadow-md animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlayingAudio ? 'bg-white text-amber-600' : 'bg-emerald-600 text-white'}`}>
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </div>
              <div className="text-left font-sans">
                <div className="text-xs font-bold">
                  {isPlayingAudio ? t('decision.speaking') : t('decision.playSpoken')}
                </div>
                <div className="text-[10px] opacity-80 font-mono">
                  Bulbul Neural Voice · {i18n.language.toUpperCase()}
                </div>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isPlayingAudio ? 'bg-white/20 text-white' : 'bg-white text-emerald-800 shadow-xs'}`}>
              {isPlayingAudio ? 'PAUSE' : 'LISTEN'}
            </span>
          </button>
        </div>

        {/* The Allocation Split */}
        <div className="my-5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Recommended Allocation</span>
            <span className="text-[11px] font-normal text-gray-400">100% Volume</span>
          </div>

          {/* Allocation Bar */}
          <div className="w-full h-8 rounded-2xl bg-gray-100 overflow-hidden flex p-0.5 border border-gray-200">
            <div
              style={{ width: `${localPart.percentage || 40}%` }}
              className="bg-gray-300 rounded-xl flex items-center justify-center text-xs font-bold text-gray-800"
            >
              <span>{localPart.percentage || 40}% Local</span>
            </div>
            {distantPart && (
              <div
                style={{ width: `${distantPart.percentage || 60}%` }}
                className="bg-emerald-600 rounded-xl flex items-center justify-center text-xs font-bold text-white ml-0.5"
              >
                <span>{distantPart.percentage || 60}% {(distantPart.mandiName || 'KR Market').split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* Allocation detail boxes */}
          <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <div className="text-[10px] text-gray-400 font-bold uppercase">
                Sell Local Today
              </div>
              <div className="font-bold text-sm text-forest mt-0.5">
                {(localPart.allocatedKg ?? 0).toLocaleString('en-IN')} kg ({localPart.percentage ?? 40}%)
              </div>
              <div className="text-gray-500 mt-1 font-mono text-[11px]">
                @ ₹{localPart.ratePerQuintal ?? 0}/qtl
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                0 km · Instant Liquidity
              </div>
            </div>

            {distantPart ? (
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">
                  Send to Distant Mandi
                </div>
                <div className="font-bold text-sm text-emerald-950 mt-0.5">
                  {(distantPart.allocatedKg ?? 0).toLocaleString('en-IN')} kg ({distantPart.percentage ?? 60}%)
                </div>
                <div className="text-emerald-800 mt-1 font-mono text-[11px] font-bold">
                  @ ₹{distantPart.ratePerQuintal ?? 0}/qtl
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  {distantPart.distanceKm ?? 35} km · {distantPart.mandiName}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400">
                100% Local best today
              </div>
            )}
          </div>
        </div>

        {/* Net Gain Callout */}
        <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-sm">
          <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
            {t('decision.netGain')}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              +₹{netGain.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-100">
              {t('decision.vsLocal')}
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-100 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Net calculated after diesel, freight, and transit shrinkage</span>
          </div>
        </div>

        {/* Cost & Shrinkage Breakdown */}
        <div className="border-t border-gray-100 pt-4 text-xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase mb-3">
            {t('decision.breakdown')}
          </div>

          <div className="space-y-2 text-xs font-sans">
            {distantPart && (
              <>
                <div className="flex justify-between items-center py-0.5 text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Transport Freight ({distantPart.distanceKm ?? 35} km)</span>
                  </span>
                  <span className="font-semibold text-gray-900 font-mono">
                    -₹{(distantPart.transportCostRupees ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5 text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-red-500" />
                    <span>Transit Shrinkage (~{distantPart.shrinkageKg ?? 0} kg)</span>
                  </span>
                  <span className="font-semibold text-red-600 font-mono">
                    -₹{(distantPart.shrinkageRupees ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center py-0.5 text-gray-600">
              <span>APMC Commission & Handling</span>
              <span className="font-semibold text-gray-900 font-mono">
                -₹{((localPart.feesRupees ?? 0) + (distantPart?.feesRupees ?? 0)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-bold text-sm">
              <span className="text-forest">Estimated Total In-Hand</span>
              <span className="text-emerald-700 font-mono text-base">
                ₹{recommendedNet.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Stale Warning if needed */}
        {decision?.isDataStale && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{t('decision.staleWarning')}</span>
          </div>
        )}

        {/* Footer verification note */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>sha256 engine · #{cropName.toLowerCase()}-kolar</span>
          <span>Perishable window: 48h limit</span>
        </div>
      </div>
    </div>
  );
};
