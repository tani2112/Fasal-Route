import { optimizeHarvestDecision, type DecisionEngineOutput } from './offlineEngine';

export interface SarvamStepLog {
  step: 'HEAR' | 'THINK' | 'DECIDE' | 'WRITE' | 'SPEAK';
  model: string;
  name: string;
  latencyMs: number;
  tokens?: { input: number; output: number };
  status: 'success' | 'running' | 'idle';
  detail: string;
}

export interface SarvamPipelineResult {
  transcript: string;
  detectedLanguage: string;
  intent: 'sell_advice' | 'price_check' | 'set_price_alert' | 'join_group';
  entities: {
    crop: string;
    quantityKg: number;
    location: string;
  };
  toolCall: {
    toolName: string;
    arguments: Record<string, unknown>;
  };
  engineOutput: DecisionEngineOutput;
  localizedResponseText: string;
  audioDurationSeconds: number;
  logs: SarvamStepLog[];
  totalLatencyMs: number;
  estimatedCreditsUsed: number;
}

export async function simulateSarvamPipeline(
  queryTextOrVoice: string,
  userLanguage: string = 'kn'
): Promise<SarvamPipelineResult> {
  const startTime = Date.now();
  const lower = queryTextOrVoice.toLowerCase();

  // 1. Entity Extraction
  let crop = 'tomato';
  if (lower.includes('onion') || lower.includes('प्याज') || lower.includes('ಈರುಳ್ಳಿ') || lower.includes('ಇರುಳ್ಳಿ') || lower.includes('कांदा') || lower.includes('வெங்காய')) {
    crop = 'onion';
  } else if (lower.includes('potato') || lower.includes('आलू') || lower.includes('ಆಲೂಗಡ್ಡೆ') || lower.includes('ಆಲೂ') || lower.includes('बटाटा') || lower.includes('உருளை')) {
    crop = 'potato';
  } else if (lower.includes('tomato') || lower.includes('टमाटर') || lower.includes('ಟೊಮೇಟೊ') || lower.includes('ಟೊಮೆಟೊ') || lower.includes('टोमॅटो') || lower.includes('தக்காளி')) {
    crop = 'tomato';
  }

  // Detect quantity
  let quantityKg = 2000; // default 2 tonnes (Ramesh scenario)
  const matchTonnes = queryTextOrVoice.match(/(\d+(?:\.\d+)?)\s*(?:tonne|ton|टन|ಟನ್|टन|டன்|t)/i);
  const matchQuintal = queryTextOrVoice.match(/(\d+(?:\.\d+)?)\s*(?:quintal|qtl|क्विंटल|ಕ್ವಿಂಟಾಲ್|क्विंटल|குவிண்டால்|q)/i);
  const matchKg = queryTextOrVoice.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|किग्रा|ಕೆಜಿ|கிலோ)/i);

  if (matchTonnes) {
    quantityKg = Math.round(parseFloat(matchTonnes[1]) * 1000);
  } else if (matchQuintal) {
    quantityKg = Math.round(parseFloat(matchQuintal[1]) * 100);
  } else if (matchKg) {
    quantityKg = Math.round(parseFloat(matchKg[1]));
  }

  // 2. Intent Classification
  let intent: 'sell_advice' | 'price_check' | 'set_price_alert' | 'join_group' = 'sell_advice';
  if (lower.includes('alert') || lower.includes('अलर्ट') || lower.includes('ಎಚ್ಚರಿಕೆ') || lower.includes('நோட்டிபிகேஷன்')) {
    intent = 'set_price_alert';
  } else if (lower.includes('pool') || lower.includes('share') || lower.includes('गाड़ी') || lower.includes('ಪಾಲುದಾರಿಕೆ') || lower.includes('கூட்டு')) {
    intent = 'join_group';
  } else if (lower.includes('rate') || lower.includes('price') || lower.includes('भाव') || lower.includes('ಬೆಲೆ') || lower.includes('விலை')) {
    intent = 'price_check';
  }

  // Step 1: Saaras v4 latency
  const saarasLatency = 230 + Math.floor(Math.random() * 40);

  // Step 2: Sarvam-105B Tool Calling
  const thinkLatency = 370 + Math.floor(Math.random() * 50);

  // Step 3: FasalRoute Engine computation
  const engineStartTime = Date.now();
  const engineOutput = optimizeHarvestDecision({
    cropId: crop,
    quantityKg,
    localMandiId: 'kolar',
  });
  const engineLatency = Math.max(12, Date.now() - engineStartTime + 8);

  // Step 4: Sarvam-105B Synthesis
  const writeLatency = 280 + Math.floor(Math.random() * 45);
  let localizedText = engineOutput.summaryRecommendationEn;
  if (userLanguage === 'hi') localizedText = engineOutput.summaryRecommendationHi;
  else if (userLanguage === 'kn') localizedText = engineOutput.summaryRecommendationKn;
  else if (userLanguage === 'mr') localizedText = engineOutput.summaryRecommendationMr;
  else if (userLanguage === 'ta') localizedText = engineOutput.summaryRecommendationTa;

  // Step 5: Bulbul TTS
  const bulbulLatency = 240 + Math.floor(Math.random() * 35);
  const totalLatency = saarasLatency + thinkLatency + engineLatency + writeLatency + bulbulLatency;

  const logs: SarvamStepLog[] = [
    {
      step: 'HEAR',
      model: 'Saaras v4',
      name: 'Speech-to-Text (Code-Mix)',
      latencyMs: saarasLatency,
      tokens: { input: 1, output: 28 },
      status: 'success',
      detail: `Transcribed audio into text with code-mixed Indian language accents. Lang detected: ${userLanguage}-IN`,
    },
    {
      step: 'THINK',
      model: 'Sarvam-105B',
      name: 'NLU & Tool Calling',
      latencyMs: thinkLatency,
      tokens: { input: 412, output: 86 },
      status: 'success',
      detail: `Classified intent: ${intent}. Extracted crop: ${crop}, qty: ${quantityKg}kg. Invoked engine tool optimize_harvest_split().`,
    },
    {
      step: 'DECIDE',
      model: 'FasalRoute Engine',
      name: 'Deterministic Python/TS Core',
      latencyMs: engineLatency,
      status: 'success',
      detail: `Evaluated 5 mandis across distance, diesel, shrinkage curves. Recommended 40/60 split with +₹${engineOutput.netGainVsLocalRupees.toLocaleString('en-IN')} gain.`,
    },
    {
      step: 'WRITE',
      model: 'Sarvam-105B',
      name: 'Localized Language Synthesis',
      latencyMs: writeLatency,
      tokens: { input: 350, output: 95 },
      status: 'success',
      detail: `Generated spoken-friendly advice in ${userLanguage.toUpperCase()}. Zero invented numbers; all figures validated against engine output.`,
    },
    {
      step: 'SPEAK',
      model: 'Bulbul TTS',
      name: 'Neural Indian TTS',
      latencyMs: bulbulLatency,
      status: 'success',
      detail: `Rendered 24kHz audio in ${userLanguage}-IN natural cadence with local agricultural colloquialisms.`,
    },
  ];

  return {
    transcript: queryTextOrVoice,
    detectedLanguage: `${userLanguage}-IN`,
    intent,
    entities: {
      crop,
      quantityKg,
      location: 'Kolar',
    },
    toolCall: {
      toolName: 'optimize_harvest_split',
      arguments: {
        crop,
        quantityKg,
        localMandiId: 'kolar',
      },
    },
    engineOutput,
    localizedResponseText: localizedText,
    audioDurationSeconds: 4.8,
    logs,
    totalLatencyMs: totalLatency,
    estimatedCreditsUsed: 0.042, // ~4 paise
  };
}
