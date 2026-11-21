import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Mic, Brain, Calculator, PenTool, Volume2, Clock, Coins, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import type { SarvamPipelineResult } from '../../lib/mockSarvam';

interface SarvamPipelinePanelProps {
  pipelineData?: SarvamPipelineResult | null;
}

export const SarvamPipelinePanel: React.FC<SarvamPipelinePanelProps> = ({ pipelineData }) => {
  const { t } = useTranslation();
  const [activeStepTab, setActiveStepTab] = useState<number>(0);

  const steps = pipelineData?.logs || [
    {
      step: 'HEAR' as const,
      model: 'Saaras v4',
      name: 'Speech-to-Text (Code-Mix)',
      latencyMs: 242,
      status: 'success' as const,
      detail: 'Audio transcribed with code-mixed Indian accent recognition. Supported across 22 Indic languages.',
    },
    {
      step: 'THINK' as const,
      model: 'Sarvam-105B',
      name: 'NLU Intent & Tool Calling',
      latencyMs: 384,
      status: 'success' as const,
      detail: 'Classified intent: sell_advice. Extracted entities: 2 tonnes tomatoes in Kolar. Structured tool call: optimize_harvest_split().',
    },
    {
      step: 'DECIDE' as const,
      model: 'FasalRoute Engine',
      name: 'Deterministic Python Core',
      latencyMs: 16,
      status: 'success' as const,
      detail: 'Pure mathematical calculation of diesel, shrinkage curves, net profit. Numbers strictly generated here.',
    },
    {
      step: 'WRITE' as const,
      model: 'Sarvam-105B',
      name: 'Localized Natural Synthesis',
      latencyMs: 295,
      status: 'success' as const,
      detail: 'Generates conversational spoken advice in native script. Every rupee figure matched against engine output.',
    },
    {
      step: 'SPEAK' as const,
      model: 'Bulbul TTS',
      name: 'Neural Indian TTS',
      latencyMs: 248,
      status: 'success' as const,
      detail: 'Synthesizes native-cadence audio stream for instant farmer playback.',
    },
  ];

  const totalLatency = steps.reduce((sum, s) => sum + s.latencyMs, 0);
  const stepIcons = [Mic, Brain, Calculator, PenTool, Volume2];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Powered by Sarvam AI · Architecture Inspector</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-forest">
            {t('pipeline.title')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            "The language model talks. The engine decides." Zero hallucinated numbers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <div className="bg-white border border-emerald-100 rounded-2xl px-3.5 py-1.5 shadow-xs">
            <span className="text-[10px] text-gray-400 block font-medium">Total Latency</span>
            <span className="font-bold text-emerald-700 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {(totalLatency / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3.5 py-1.5 shadow-xs">
            <span className="text-[10px] text-amber-700 block font-medium">Estimated Cost</span>
            <span className="font-bold text-amber-800 text-sm flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              ₹0.04 (4p)
            </span>
          </div>
        </div>
      </div>

      {/* 5-Step Pipeline Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((st, idx) => {
          const Icon = stepIcons[idx % stepIcons.length];
          const isSelected = activeStepTab === idx;

          return (
            <button
              key={st.step}
              onClick={() => setActiveStepTab(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md -translate-y-0.5'
                  : 'bg-white text-forest border-emerald-100 hover:border-emerald-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}`}>
                  {st.latencyMs}ms
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase opacity-80">
                Step {idx + 1}
              </div>
              <div className="font-bold text-xs truncate mt-0.5">
                {st.model}
              </div>
              <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Card */}
      <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-base sm:text-lg text-forest">
              Step {activeStepTab + 1}: {steps[activeStepTab].model} — {steps[activeStepTab].name}
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
            STATUS: 200 OK
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          {steps[activeStepTab].detail}
        </p>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2">
          <div className="text-[10px] text-gray-400 uppercase font-bold">
            Diagnostic Telemetry
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-gray-400 text-[10px] block">Latency:</span>
              <span className="font-bold text-forest">{steps[activeStepTab].latencyMs} ms</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">Provider:</span>
              <span className="font-bold text-forest">
                {activeStepTab === 2 ? 'FasalRoute Python Core' : 'Sarvam AI Cloud'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">Security:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Key In Backend Only
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Architectural Guardrail:</strong> The LLM is prohibited from computing prices. When synthesizing the farmer's response, an automated validator in our backend verifies that every number in the sentence strictly matches the engine output before passing it to Bulbul TTS.
          </div>
        </div>
      </div>
    </div>
  );
};
