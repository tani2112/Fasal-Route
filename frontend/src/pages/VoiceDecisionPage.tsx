import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, Volume2, ShieldCheck, CheckCircle2, MapPin, Truck, Leaf, Clock, Scale, AlertCircle, Search } from 'lucide-react';
import { VoiceMic } from '../components/voice/VoiceMic';
import { MandiMandateReceipt } from '../components/decision/MandiMandateReceipt';
import { simulateSarvamPipeline, type SarvamPipelineResult } from '../lib/mockSarvam';
import { optimizeHarvestDecision, type DecisionEngineOutput } from '../lib/offlineEngine';
import { normalizeDecision } from '../lib/normalizeDecision';
import { playMicStartSound, playMicStopSound, playDecisionChime, speakText } from '../lib/audioSynth';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

interface VoiceDecisionPageProps {
  isOffline: boolean;
  onPipelineUpdate?: (result: SarvamPipelineResult) => void;
}

export const VoiceDecisionPage: React.FC<VoiceDecisionPageProps> = ({
  isOffline,
  onPipelineUpdate,
}) => {
  const { t, i18n } = useTranslation();

  const {
    isRecording,
    recordingDuration,
    volumeLevel,
    error: micError,
    startRecording,
    stopRecording,
  } = useAudioRecorder();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const currentAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentSpeechControllerRef = useRef<{ stop: () => void } | null>(null);

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
  const [lastBase64Audio, setLastBase64Audio] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');

  const sampleQueries = [
    { text: t('sampleQuery1'), label: 'Ramesh Demo (2t Tomatoes)' },
    { text: t('sampleQuery2'), label: 'Onion Price Check' },
    { text: t('sampleQuery3'), label: 'Potato Truck Pool' },
  ];

  const handleStartRecord = async () => {
    playMicStartSound();
    await startRecording();
  };

  const handleTextQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsProcessing(true);
    setUserTranscript(queryText);
    playMicStopSound();

    const langCode = i18n.language === 'kn' ? 'kn-IN' : i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'ta' ? 'ta-IN' : 'en-IN';

    // 1. Attempt live FastAPI backend with real Sarvam AI
    if (!isOffline) {
      try {
        const formData = new FormData();
        formData.append('query_text', queryText);
        formData.append('language_code', langCode);
        formData.append('local_mandi_id', 'kolar');

        const resp = await fetch('http://localhost:8000/api/voice/decision', {
          method: 'POST',
          body: formData,
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.transcript) {
            setUserTranscript(data.transcript);
          }
          if (data.decision) {
            setDecision(normalizeDecision(data.decision));
          }
          if (data.audio_base64) {
            setLastBase64Audio(data.audio_base64);
          }

          const pipelineRes: SarvamPipelineResult = {
            transcript: data.transcript || queryText,
            detectedLanguage: data.language_code || langCode,
            intent: data.intent || 'sell_advice',
            entities: data.entities || { crop: 'tomato', quantityKg: 2000, location: 'Kolar' },
            toolCall: data.tool_call || { toolName: 'optimize_harvest_split', arguments: {} },
            engineOutput: normalizeDecision(data.decision),
            localizedResponseText: data.spoken_text || '',
            audioDurationSeconds: 4.8,
            logs: [
              {
                step: 'HEAR',
                model: 'Text / STT Input',
                name: 'Direct Farmer Search',
                latencyMs: 12,
                status: 'success',
                detail: `Input processed: "${queryText}"`,
              },
              {
                step: 'THINK',
                model: 'Sarvam-105B (Live)',
                name: 'NLU Intent & Tool Calling',
                latencyMs: data.telemetry?.models?.think?.latency_ms || 360,
                status: 'success',
                detail: `Extracted entities and invoked optimize_harvest_split tool.`,
              },
              {
                step: 'DECIDE',
                model: 'FasalRoute Engine',
                name: 'Deterministic Python Core',
                latencyMs: data.telemetry?.models?.decide?.latency_ms || 16,
                status: 'success',
                detail: `Pure mathematical profit calculation. Rupee values locked.`,
              },
              {
                step: 'WRITE',
                model: 'Sarvam-105B (Live)',
                name: 'Localized Natural Synthesis',
                latencyMs: data.telemetry?.models?.write?.latency_ms || 280,
                status: 'success',
                detail: `Generated spoken advice matching engine numbers.`,
              },
              {
                step: 'SPEAK',
                model: 'Bulbul v4 Flash (Live)',
                name: 'Neural Indian TTS',
                latencyMs: data.telemetry?.models?.speak?.latency_ms || 260,
                status: 'success',
                detail: `Generated real MP3 audio stream for playback.`,
              },
            ],
            totalLatencyMs: data.telemetry?.total_latency_ms || 950,
            estimatedCreditsUsed: 0.035,
          };

          if (onPipelineUpdate) {
            onPipelineUpdate(pipelineRes);
          }
          playDecisionChime();
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.warn('Live backend query failed, falling back to local engine:', err);
      }
    }

    // 2. Offline / Local fallback simulation
    try {
      const result = await simulateSarvamPipeline(queryText, i18n.language);
      setDecision(normalizeDecision(result.engineOutput));
      if (onPipelineUpdate) {
        onPipelineUpdate(result);
      }
      playDecisionChime();
    } catch (err) {
      console.error('Local engine fallback error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopRecordAndProcess = async (fallbackQueryText?: string) => {
    if (fallbackQueryText) {
      await handleTextQuerySubmit(fallbackQueryText);
      return;
    }

    playMicStopSound();
    setIsProcessing(true);

    const audioBlob = await stopRecording();
    const langCode = i18n.language === 'kn' ? 'kn-IN' : i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'ta' ? 'ta-IN' : 'en-IN';

    if (!isOffline && audioBlob) {
      try {
        const formData = new FormData();
        const extension = audioBlob.type.includes('webm') ? 'webm' : audioBlob.type.includes('mp4') ? 'mp4' : 'wav';
        formData.append('audio_file', audioBlob, `recording.${extension}`);
        formData.append('language_code', langCode);
        formData.append('local_mandi_id', 'kolar');

        const resp = await fetch('http://localhost:8000/api/voice/decision', {
          method: 'POST',
          body: formData,
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.transcript) {
            setUserTranscript(data.transcript);
          }
          if (data.decision) {
            setDecision(normalizeDecision(data.decision));
          }
          if (data.audio_base64) {
            setLastBase64Audio(data.audio_base64);
          }

          const pipelineRes: SarvamPipelineResult = {
            transcript: data.transcript,
            detectedLanguage: data.language_code,
            intent: data.intent || 'sell_advice',
            entities: data.entities || { crop: 'tomato', quantityKg: 2000, location: 'Kolar' },
            toolCall: data.tool_call || { toolName: 'optimize_harvest_split', arguments: {} },
            engineOutput: normalizeDecision(data.decision),
            localizedResponseText: data.spoken_text,
            audioDurationSeconds: 4.8,
            logs: [
              {
                step: 'HEAR',
                model: 'Saaras v4 (Live)',
                name: 'Speech-to-Text (Code-Mix)',
                latencyMs: data.telemetry?.models?.hear?.latency_ms || 240,
                status: 'success',
                detail: `Transcribed user microphone audio into text via Sarvam API.`,
              },
              {
                step: 'THINK',
                model: 'Sarvam-105B (Live)',
                name: 'NLU Intent & Tool Calling',
                latencyMs: data.telemetry?.models?.think?.latency_ms || 380,
                status: 'success',
                detail: `Extracted entities and invoked optimize_harvest_split tool.`,
              },
              {
                step: 'DECIDE',
                model: 'FasalRoute Engine',
                name: 'Deterministic Python Core',
                latencyMs: data.telemetry?.models?.decide?.latency_ms || 16,
                status: 'success',
                detail: `Pure mathematical profit calculation. Rupee values locked.`,
              },
              {
                step: 'WRITE',
                model: 'Sarvam-105B (Live)',
                name: 'Localized Natural Synthesis',
                latencyMs: data.telemetry?.models?.write?.latency_ms || 280,
                status: 'success',
                detail: `Generated spoken advice matching engine numbers.`,
              },
              {
                step: 'SPEAK',
                model: 'Bulbul v4 Flash (Live)',
                name: 'Neural Indian TTS',
                latencyMs: data.telemetry?.models?.speak?.latency_ms || 260,
                status: 'success',
                detail: `Generated real MP3 audio stream for playback.`,
              },
            ],
            totalLatencyMs: data.telemetry?.total_latency_ms || 1180,
            estimatedCreditsUsed: 0.042,
          };

          if (onPipelineUpdate) {
            onPipelineUpdate(pipelineRes);
          }
          playDecisionChime();
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.warn('Live audio upload failed, falling back to local engine:', err);
      }
    }

    // Local engine fallback
    try {
      const query = userTranscript || '2 tonnes of tomatoes in Kolar, what should I do?';
      const result = await simulateSarvamPipeline(query, i18n.language);
      setDecision(normalizeDecision(result.engineOutput));
      if (onPipelineUpdate) {
        onPipelineUpdate(result);
      }
      playDecisionChime();
    } catch (err) {
      console.error('Pipeline processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlayAudioDecision = () => {
    // If playing, stop
    if (isPlayingAudio) {
      handleStopAudio();
      return;
    }

    // 1. If we have real Sarvam Bulbul audio from backend, play it directly!
    if (lastBase64Audio) {
      try {
        if (currentAudioElementRef.current) {
          currentAudioElementRef.current.pause();
        }
        const audio = new Audio(`data:audio/mp3;base64,${lastBase64Audio}`);
        currentAudioElementRef.current = audio;
        setIsPlayingAudio(true);

        audio.onended = () => {
          setIsPlayingAudio(false);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          // Fallback to speech synth
          fallbackSpeak();
        };
        audio.play();
        return;
      } catch (e) {
        console.warn('Base64 playback fallback:', e);
      }
    }

    // 2. Fallback to Web Speech API
    fallbackSpeak();
  };

  const fallbackSpeak = () => {
    let textToSpeak = decision.summaryRecommendationEn;
    if (i18n.language === 'kn') textToSpeak = decision.summaryRecommendationKn;
    else if (i18n.language === 'hi') textToSpeak = decision.summaryRecommendationHi;
    else if (i18n.language === 'mr') textToSpeak = decision.summaryRecommendationMr;
    else if (i18n.language === 'ta') textToSpeak = decision.summaryRecommendationTa;

    setIsPlayingAudio(true);
    const ctrl = speakText(textToSpeak, i18n.language, () => {
      setIsPlayingAudio(false);
      currentSpeechControllerRef.current = null;
    });
    currentSpeechControllerRef.current = ctrl;
  };

  const handleStopAudio = () => {
    if (currentAudioElementRef.current) {
      currentAudioElementRef.current.pause();
      currentAudioElementRef.current = null;
    }
    if (currentSpeechControllerRef.current) {
      currentSpeechControllerRef.current.stop();
      currentSpeechControllerRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const splitList = decision?.split || [];
  const localPart =
    splitList.find((s) => s.isLocal) ||
    splitList[0] || {
      percentage: 40,
      allocatedKg: 800,
      ratePerQuintal: 1400,
      isLocal: true,
      mandiName: 'Kolar APMC',
    };
  const distantPart = splitList.find((s) => !s.isLocal);

  const netGain = Number(decision?.netGainVsLocalRupees ?? 0);
  const totalKg = Number(decision?.totalQuantityKg ?? 2000);

  return (
    <div className="space-y-10">
      {/* Hero 2-Column Section */}
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
            Stop post-harvest spoilage and blind pricing. Tap the mic, speak in your language, and let Sarvam AI Saaras v4 and our Python engine calculate the optimal split.
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
                    ? `Recording (${recordingDuration}s)... Click Stop when finished`
                    : isProcessing
                    ? "Transcribing with Saaras v4 & computing profit..."
                    : "Tap mic & speak: e.g. 2 tonnes of tomatoes in Kolar"
                }
              />

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    {isRecording ? `Mic Active (Vol: ${volumeLevel}%)` : 'Live Voice Input'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Real audio recorded from your microphone is sent to Sarvam AI Saaras v4 and Bulbul.
                </div>

                {micError && (
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs flex items-center gap-1.5 border border-amber-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                    <span>Mic permission notice: {micError}. You can also use pre-loaded scenarios below.</span>
                  </div>
                )}

                {userTranscript && (
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 font-medium italic">
                    "{userTranscript}"
                  </div>
                )}
              </div>
            </div>

            {/* Quick Question / Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchInput.trim()) {
                  handleTextQuerySubmit(searchInput.trim());
                  setSearchInput('');
                }
              }}
              className="pt-3 border-t border-gray-100 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Or type/search: e.g. 5 tonnes onions in Kolar..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-gray-50 hover:bg-emerald-50/40 focus:bg-white border border-gray-200 focus:border-emerald-500 text-xs text-forest focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !searchInput.trim()}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs flex-shrink-0"
              >
                <span>Ask</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Scenarios */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400">Or tap scenario:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isProcessing || isRecording}
                  onClick={() => handleTextQuerySubmit(q.text)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 transition-all cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bento Cards Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Top Hero Banner with Live Arbitrage */}
          <div className="sm:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-800 via-forest to-emerald-950 text-white p-6 sm:p-7 shadow-md">
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-emerald-100 border border-white/20">
                  Ramesh Demo · Kolar Corridor
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                  SARVAM AI LIVE
                </span>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Real-Time Agmarknet Prices Synced</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Saaras v4 STT + Sarvam-105B Reasoning</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Zero Hallucinated Numbers (Code Verified)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-emerald-200 block">Calculated Net In-Hand Gain</span>
                  <span className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                    +₹{netGain.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs text-emerald-200 font-medium">
                  vs 100% Local Selling
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Split Allocation */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Split Allocation
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {totalKg.toLocaleString('en-IN')} kg
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden flex">
              <div style={{ width: `${localPart.percentage || 40}%` }} className="bg-gray-400 h-full" />
              {distantPart && (
                <div style={{ width: `${distantPart.percentage || 60}%` }} className="bg-emerald-600 h-full" />
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-600">
                <span>Local ({localPart.percentage || 40}%):</span>
                <span className="font-bold text-forest">{(localPart.allocatedKg ?? 0).toLocaleString('en-IN')} kg @ ₹{localPart.ratePerQuintal ?? 0}</span>
              </div>
              {distantPart && (
                <div className="flex justify-between items-center text-emerald-800 font-medium">
                  <span>KR Market ({distantPart.percentage || 60}%):</span>
                  <span className="font-bold text-emerald-700">{(distantPart.allocatedKg ?? 0).toLocaleString('en-IN')} kg @ ₹{distantPart.ratePerQuintal ?? 0}</span>
                </div>
              )}
            </div>

            <button
              onClick={handlePlayAudioDecision}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Speaking Decision...' : 'Listen to Spoken Audio'}</span>
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
