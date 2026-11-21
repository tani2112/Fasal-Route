import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, CheckCircle2, AlertTriangle, ArrowRight, Truck, Clock, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import type { DecisionEngineOutput } from '../../lib/offlineEngine';

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

  const isDistantSplit = decision.split.length > 1;
  const localPart = decision.split.find((s) => s.isLocal) || decision.split[0];
  const distantPart = decision.split.find((s) => !s.isLocal);

  return (
    <div className="relative mx-auto max-w-lg w-full">
      {/* Background shadow accent card for tactile neo-brutalist paper stack feel */}
      <div className="absolute inset-0 bg-soil rounded-2xl translate-x-2 translate-y-2.5 -z-10" />

      {/* Main Physical Receipt Container */}
      <div className="bg-white border-3 border-soil rounded-2xl p-5 sm:p-7 relative font-mono overflow-hidden">
        {/* Top Perforated Receipt Teeth Indicator */}
        <div className="absolute -top-1 left-0 right-0 flex justify-between px-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-3 h-2 bg-canvas rounded-b-md border-b border-soil/40" />
          ))}
        </div>

        {/* Top Header & Stamp */}
        <div className="flex items-start justify-between border-b-2 border-dashed border-soil/30 pb-4 pt-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-forest uppercase">
              <span className="w-2 h-2 rounded-full bg-leaf"></span>
              <span>FASALROUTE MANDATE</span>
            </div>
            <div className="text-[10px] text-soil-muted mt-0.5">
              {decision.timestamp ? new Date(decision.timestamp).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : '21 Nov 2026, 14:30'}
            </div>
            <div className="text-xs font-bold text-soil mt-1">
              Crop: <span className="uppercase text-forest font-black">{decision.cropName}</span> · {decision.totalQuantityKg.toLocaleString('en-IN')} kg
            </div>
          </div>

          {/* Red/Green Stamp Motif from reference image */}
          <div className="flex flex-col items-end gap-1">
            <div className="stamp-box">
              ILLUSTRATIVE
            </div>
            <div className="text-[9px] font-mono text-leaf flex items-center gap-0.5 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>CODE VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Spoken Decision Playback Button */}
        <div className="my-4">
          <button
            onClick={isPlayingAudio ? onStopAudio : onPlayAudio}
            className={`w-full py-3 px-4 rounded-xl border-2 border-soil flex items-center justify-between transition-all ${
              isPlayingAudio
                ? 'bg-amber text-soil font-bold shadow-neo-sm animate-pulse'
                : 'bg-canvas-light hover:bg-amber/30 text-soil shadow-neo-sm font-bold'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-soil text-white flex items-center justify-center">
                {isPlayingAudio ? (
                  <VolumeX className="w-4 h-4 text-amber" />
                ) : (
                  <Volume2 className="w-4 h-4 text-amber" />
                )}
              </div>
              <div className="text-left font-sans">
                <div className="text-xs font-bold">
                  {isPlayingAudio ? t('decision.speaking') : t('decision.playSpoken')}
                </div>
                <div className="text-[10px] text-soil-muted font-mono">
                  Bulbul Neural Voice · {i18n.language.toUpperCase()}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-soil">
              {isPlayingAudio ? 'PAUSE' : 'LISTEN'}
            </span>
          </button>
        </div>

        {/* The Allocation Split Visualization */}
        <div className="my-4">
          <div className="text-[11px] font-bold text-soil-muted uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>{t('decision.splitTitle')}</span>
            <span className="text-[10px] font-normal text-soil-muted">100% Volume</span>
          </div>

          {/* Two-tone Split Bar */}
          <div className="w-full h-8 rounded-xl border-2 border-soil overflow-hidden flex shadow-neo-sm">
            <div
              style={{ width: `${localPart.percentage}%` }}
              className="bg-canvas-dark flex items-center justify-center text-xs font-bold text-soil border-r-2 border-soil px-1 text-center"
              title={`${localPart.percentage}% Local`}
            >
              <span>{localPart.percentage}% Local</span>
            </div>
            {distantPart && (
              <div
                style={{ width: `${distantPart.percentage}%` }}
                className="bg-amber flex items-center justify-center text-xs font-bold text-soil px-1 text-center"
                title={`${distantPart.percentage}% Distant Mandi`}
              >
                <span>{distantPart.percentage}% {distantPart.mandiName.split(' ')[0]}</span>
              </div>
            )}
          </div>

          {/* Allocation details cards */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {/* Local segment */}
            <div className="bg-canvas-light p-2.5 rounded-xl border border-soil/40">
              <div className="text-[10px] text-soil-muted font-bold uppercase">
                {t('decision.sellLocal')}
              </div>
              <div className="font-bold text-sm text-soil mt-0.5">
                {localPart.allocatedKg.toLocaleString('en-IN')} kg ({localPart.percentage}%)
              </div>
              <div className="text-[11px] text-soil-muted mt-1 font-mono">
                @ ₹{localPart.ratePerQuintal}/qtl
              </div>
              <div className="text-[10px] text-leaf font-bold mt-0.5">
                0 km · Instant Cash
              </div>
            </div>

            {/* Distant segment */}
            {distantPart ? (
              <div className="bg-amber/15 p-2.5 rounded-xl border-2 border-soil">
                <div className="text-[10px] text-soil font-bold uppercase flex items-center gap-1">
                  <span>{t('decision.sendDistant')}</span>
                </div>
                <div className="font-bold text-sm text-forest mt-0.5">
                  {distantPart.allocatedKg.toLocaleString('en-IN')} kg ({distantPart.percentage}%)
                </div>
                <div className="text-[11px] text-soil mt-1 font-mono font-bold">
                  @ ₹{distantPart.ratePerQuintal}/qtl
                </div>
                <div className="text-[10px] text-forest font-bold mt-0.5">
                  {distantPart.distanceKm} km · {distantPart.mandiName}
                </div>
              </div>
            ) : (
              <div className="bg-canvas-light p-2.5 rounded-xl border border-soil/40 flex items-center justify-center text-[11px] text-soil-muted">
                100% Local best today
              </div>
            )}
          </div>
        </div>

        {/* Net Gain Callout with Yellow Marker Highlight Motif */}
        <div className="my-5 p-3.5 rounded-xl bg-forest text-white border-2 border-soil relative">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber font-bold">
            {t('decision.netGain')}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              +₹{decision.netGainVsLocalRupees.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-white/80 font-sans">
              {t('decision.vsLocal')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-amber/90 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber" />
            <span>Net after diesel, truck freight & transit loss</span>
          </div>
        </div>

        {/* Cost & Shrinkage Breakdown Table */}
        <div className="border-t-2 border-dashed border-soil/30 pt-3 text-xs">
          <div className="text-[11px] font-bold text-soil-muted uppercase mb-2">
            {t('decision.breakdown')}
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {distantPart && (
              <>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-soil-muted flex items-center gap-1">
                    <Truck className="w-3 h-3 text-soil" />
                    <span>{t('decision.transportCost')} ({distantPart.distanceKm} km)</span>
                  </span>
                  <span className="font-bold text-soil">
                    -₹{distantPart.transportCostRupees.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-soil-muted flex items-center gap-1">
                    <Scale className="w-3 h-3 text-tomato" />
                    <span>{t('decision.shrinkageLoss')} (~{distantPart.shrinkageKg} kg)</span>
                  </span>
                  <span className="font-bold text-tomato">
                    -₹{distantPart.shrinkageRupees.toLocaleString('en-IN')}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center py-0.5">
              <span className="text-soil-muted">APMC Commission & Handling</span>
              <span className="font-bold text-soil">
                -₹{(localPart.feesRupees + (distantPart ? distantPart.feesRupees : 0)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-soil/20 font-bold text-xs">
              <span className="text-forest uppercase">Estimated Total In-Hand</span>
              <span className="text-base text-forest">
                ₹{decision.recommendedTotalNetRupees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Shelf Life & Perishable Window */}
        <div className="mt-4 pt-3 border-t border-soil/20 flex items-center justify-between text-[11px] text-soil-muted">
          <span className="flex items-center gap-1 text-tomato font-bold">
            <Clock className="w-3 h-3" />
            <span>Perishable: 48h limit</span>
          </span>
          <span className="font-mono text-[10px]">
            Updated {decision.dataFreshnessMinutesAgo}m ago
          </span>
        </div>

        {/* Stale Data Warning if needed */}
        {decision.isDataStale && (
          <div className="mt-3 p-2 rounded-lg bg-amber/20 border border-amber text-soil text-[10px] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-dark flex-shrink-0" />
            <span>{t('decision.staleWarning')}</span>
          </div>
        )}

        {/* Bottom Barcode / Verification Stamp (from reference image) */}
        <div className="mt-5 pt-3 border-t-2 border-soil flex flex-col items-center">
          {/* Simulated Barcode */}
          <div className="flex items-center justify-center gap-0.5 h-8 w-4/5 my-1">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className={`h-full ${
                  i % 3 === 0 ? 'w-1 bg-soil' : i % 5 === 0 ? 'w-1.5 bg-soil' : 'w-0.5 bg-soil/70'
                }`}
              />
            ))}
          </div>
          <div className="text-[9px] font-mono text-soil-muted tracking-widest text-center mt-1">
            sha256 engine · verify #fasalroute-kolar-kr-tomatoes
          </div>
        </div>
      </div>
    </div>
  );
};
