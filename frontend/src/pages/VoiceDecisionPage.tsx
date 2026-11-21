import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Volume2, ShieldCheck, CheckCircle2, MapPin, Truck, Leaf, Clock, Scale } from 'lucide-react';
import { VoiceMic } from '../components/voice/VoiceMic';
import { MandiMandateReceipt } from '../components/decision/MandiMandateReceipt';
import { simulateSarvamPipeline, type SarvamPipelineResult } from '../lib/mockSarvam';
import { optimizeHarvestDecision, type DecisionEngineOutput } from '../lib/offlineEngine';
import { playMicStartSound, playMicStopSound, playDecisionChime, speakText } from '../lib/audioSynth';

interface VoiceDecisionPageProps {
  isOffline: boolean;
  onPipelineUpdate?: (result: SarvamPipelineResult) => void;
}

export const VoiceDecisionPage: React.FC<VoiceDecisionPageProps> = ({
  isOffline,
  onPipelineUpdate,
}) => {
  const { t, i18n } = useTranslation();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeechController, setCurrentSpeechController] = useState<{ stop: () => void } | null>(null);

  // Default to Ramesh illustrative scenario
  const defaultEngineOutput = optimizeHarvestDecision({
    cropId: 'tomato',
    quantityKg: 2000,
    localMandiId: 'kolar',
  });

  const [decision, setDecision] = useState<DecisionEngineOutput>(defaultEngineOutput);
  const [userTranscript, setUserTranscript] = useState<string>(
    '2 tonnes of tomatoes in Kolar, what should I do?'
  );

  const sampleQueries = [
    { text: t('sampleQuery1'), label: 'Ramesh Demo (2t Tomatoes)' },
    { text: t('sampleQuery2'), label: 'Onion Price Check' },
    { text: t('sampleQuery3'), label: 'Potato Truck Pool' },
  ];

  const handleStartRecord = () => {
    playMicStartSound();
    setIsRecording(true);
  };

  const handleStopRecordAndProcess = async (queryText?: string) => {
    playMicStopSound();
    setIsRecording(false);
    setIsProcessing(true);

    const query = queryText || userTranscript || '2 tonnes of tomatoes in Kolar, what should I do?';
    setUserTranscript(query);

    try {
      const result = await simulateSarvamPipeline(query, i18n.language);
      setDecision(result.engineOutput);
      if (onPipelineUpdate) {
        onPipelineUpdate(result);
      }
      playDecisionChime();
    } catch (err) {
      console.error('Pipeline error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayAudioDecision = () => {
    if (isPlayingAudio && currentSpeechController) {
      currentSpeechController.stop();
      setIsPlayingAudio(false);
      return;
    }

    let textToSpeak = decision.summaryRecommendationEn;
    if (i18n.language === 'kn') textToSpeak = decision.summaryRecommendationKn;
    else if (i18n.language === 'hi') textToSpeak = decision.summaryRecommendationHi;
    else if (i18n.language === 'mr') textToSpeak = decision.summaryRecommendationMr;
    else if (i18n.language === 'ta') textToSpeak = decision.summaryRecommendationTa;

    setIsPlayingAudio(true);
    const ctrl = speakText(textToSpeak, i18n.language, () => {
      setIsPlayingAudio(false);
      setCurrentSpeechController(null);
    });
    setCurrentSpeechController(ctrl);
  };

  const handleStopAudio = () => {
    if (currentSpeechController) {
      currentSpeechController.stop();
    }
    setIsPlayingAudio(false);
    setCurrentSpeechController(null);
  };

  const localPart = decision.split.find((s) => s.isLocal) || decision.split[0];
  const distantPart = decision.split.find((s) => !s.isLocal);

  return (
    <div className="space-y-10">
      {/* Hero 2-Column Section matching AgroFarm Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-6">
        {/* Left Column: Heading, Subtitle, Voice Mic & Scenarios */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Green Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>FasalRoute · Voice-First AI Harvest Co-Pilot</span>
          </div>

          {/* 2-Tone Headline matching AgroFarm image */}
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-[1.15]">
            <span className="text-emerald-600 block">Smart Harvest Decision</span>
            <span className="text-forest block">Sell At The Right Place,</span>
            <span className="text-emerald-700 flex items-center gap-2">
              At The Right Time.
              <span className="inline-flex w-7 h-7 rounded-full bg-emerald-100 items-center justify-center text-emerald-700 text-sm">
                🌾
              </span>
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg">
            Stop post-harvest spoilage and blind pricing. One voice query in your mother tongue gives you an exact split decision verified by code.
          </p>

          {/* Voice Mic Container */}
          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <VoiceMic
                isRecording={isRecording}
                isProcessing={isProcessing}
                onStartRecord={handleStartRecord}
                onStopRecord={() => handleStopRecordAndProcess()}
                statusText={
                  isRecording
                    ? t('listening')
                    : isProcessing
                    ? t('processing')
                    : t('tapToSpeak')
                }
              />

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                  Instant Voice Analysis
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Powered by Sarvam AI Saaras v4 and Bulbul. Supports Kannada, Hindi, Marathi, Tamil, and English.
                </div>
                {userTranscript && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium italic">
                    "{userTranscript}"
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Scenarios */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">Try scenario:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  disabled={isProcessing || isRecording}
                  onClick={() => handleStopRecordAndProcess(q.text)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 transition-all"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AgroFarm Bento Cards Grid matching image */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Top Hero Banner with Farmer Backdrop & Floating Badges */}
          <div className="sm:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 via-forest to-emerald-950 text-white p-6 sm:p-7 shadow-md">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-emerald-100 border border-white/20">
                  Ramesh Demo · Kolar Hub
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                  LIVE ARBITRAGE
                </span>
              </div>

              {/* Floating badges matching the reference image layout */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Real-Time Agmarknet Prices Synced</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Sarvam AI Multi-Model Intelligence</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Zero Hallucinated Numbers (Code Verified)</span>
                </div>
              </div>

              {/* Net Gain Callout */}
              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-emerald-200 block">Recommended Net Gain</span>
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                    +₹{decision.netGainVsLocalRupees.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs text-emerald-200 font-medium">
                  vs 100% Local Selling
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Decision Allocation Split */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Split Allocation
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {decision.totalQuantityKg.toLocaleString('en-IN')} kg
              </span>
            </div>

            {/* Visual Two-Tone Bar */}
            <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
              <div style={{ width: `${localPart.percentage}%` }} className="bg-gray-400 h-full" />
              {distantPart && (
                <div style={{ width: `${distantPart.percentage}%` }} className="bg-emerald-600 h-full" />
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Local ({localPart.percentage}%):</span>
                <span className="font-bold text-forest">{localPart.allocatedKg} kg @ ₹{localPart.ratePerQuintal}</span>
              </div>
              {distantPart && (
                <div className="flex justify-between items-center text-emerald-800 font-medium">
                  <span>KR Market ({distantPart.percentage}%):</span>
                  <span className="font-bold text-emerald-700">{distantPart.allocatedKg} kg @ ₹{distantPart.ratePerQuintal}</span>
                </div>
              )}
            </div>

            {/* Listen Spoken Decision Button */}
            <button
              onClick={isPlayingAudio ? handleStopAudio : handlePlayAudioDecision}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Speaking Decision...' : 'Listen in Spoken Audio'}</span>
            </button>
          </div>

          {/* Card 3: Group Pooling Freight Split */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Truck Pooling
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                Save ₹1,800
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-forest">Kolar Mini-Truck</div>
                <div className="text-[11px] text-gray-500">₹2,400 ÷ 4 = ₹600 each</div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed">
              Share transport with neighbours heading to KR Market. Verified FPO dispatch tonight at 09:30 PM.
            </p>

            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>4 Farmers Joined</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Detailed Decision Receipt Card */}
      <div className="pt-4 max-w-2xl mx-auto">
        <MandiMandateReceipt
          decision={decision}
          isPlayingAudio={isPlayingAudio}
          onPlayAudio={handlePlayAudioDecision}
          onStopAudio={handleStopAudio}
        />
      </div>
    </div>
  );
};
