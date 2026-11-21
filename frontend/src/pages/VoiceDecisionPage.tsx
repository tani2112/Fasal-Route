import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, CheckCircle2, Volume2, ShieldCheck, RefreshCw, MessageSquare } from 'lucide-react';
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
    { text: t('sampleQuery1'), crop: 'tomato', qty: 2000, label: 'Ramesh Demo (2t Tomatoes)' },
    { text: t('sampleQuery2'), crop: 'onion', qty: 3000, label: 'Onion Price Check' },
    { text: t('sampleQuery3'), crop: 'potato', qty: 1500, label: 'Potato Truck Pool' },
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        {/* Pill Badge matching theme reference image */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-soil/80 text-xs font-mono font-semibold uppercase tracking-wider bg-white shadow-neo-sm">
          <span className="w-2 h-2 rounded-full bg-leaf"></span>
          <span>{t('openWeight')}</span>
        </div>

        {/* Display Headline with Yellow Marker Highlight Motif */}
        <h1 className="text-3xl sm:text-5xl font-display font-black text-soil tracking-tight max-w-3xl mx-auto leading-tight">
          Speak to your harvest.{' '}
          <span className="relative inline-block px-1.5 py-0.5 bg-amber rounded-md border border-soil/40 -rotate-1 shadow-neo-sm">
            Sell at the right place,
          </span>{' '}
          at the right time.
        </h1>

        <p className="text-sm sm:text-base text-soil-muted max-w-xl mx-auto leading-relaxed">
          {t('heroSubtitle')}
        </p>
      </div>

      {/* Voice Interaction Central Stage */}
      <div className="bg-white border-3 border-soil rounded-3xl p-6 sm:p-8 shadow-neo-lg text-center relative overflow-hidden">
        {/* The Big Voice Mic */}
        <div className="my-2">
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
        </div>

        {/* Quick Suggestion Pills for One-Tap Demo */}
        <div className="mt-6 pt-5 border-t border-soil/15">
          <div className="text-[11px] font-mono text-soil-muted uppercase font-bold mb-2.5">
            Or tap a pre-loaded farmer scenario:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleQueries.map((q, idx) => (
              <button
                key={idx}
                disabled={isProcessing || isRecording}
                onClick={() => handleStopRecordAndProcess(q.text)}
                className="px-3 py-1.5 rounded-xl bg-canvas hover:bg-amber/30 border border-soil text-xs font-mono font-medium text-soil shadow-neo-sm hover:shadow-neo transition-all"
              >
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Transcript Box */}
        {userTranscript && (
          <div className="mt-4 p-3 rounded-xl bg-canvas border border-soil/30 font-mono text-xs text-soil flex items-center justify-between gap-2 max-w-lg mx-auto">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-amber flex-shrink-0" />
              <span className="italic truncate">"{userTranscript}"</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-leaf flex-shrink-0">
              Code-Mix OK
            </span>
          </div>
        )}
      </div>

      {/* The Mandi Mandate Output (Physical Receipt Motif) */}
      <div className="pt-2">
        <div className="text-center mb-3">
          <div className="neo-pill bg-white text-soil border-soil mb-1">
            ● ENGINE DECISION OUTPUT
          </div>
          <h2 className="font-display font-extrabold text-2xl text-soil">
            {t('decision.title')}
          </h2>
        </div>

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
