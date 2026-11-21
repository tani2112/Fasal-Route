import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Mic, Brain, Calculator, PenTool, Volume2, Clock, Coins, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-soil/20 pb-4">
        <div>
          <div className="neo-pill bg-amber/20 text-soil border-soil mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-dark" />
            <span>POWERED BY SARVAM AI · ARCHITECTURE INSPECTOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-soil">
            {t('pipeline.title')}
          </h2>
          <p className="text-sm text-soil-muted mt-1">
            "The language model talks. The engine decides." Zero hallucinated rupee figures.
          </p>
        </div>

        {/* Latency & Credits Stat Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <div className="bg-white border-2 border-soil rounded-xl px-3 py-1.5 shadow-neo-sm">
            <span className="text-[10px] text-soil-muted block">Total Latency</span>
            <span className="font-bold text-forest text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-leaf" />
              {(totalLatency / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="bg-amber/15 border-2 border-soil rounded-xl px-3 py-1.5 shadow-neo-sm">
            <span className="text-[10px] text-forest block">Estimated Cost</span>
            <span className="font-bold text-forest text-sm flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-dark" />
              ₹0.04 (4p)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 5-Step Pipeline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((st, idx) => {
          const Icon = stepIcons[idx % stepIcons.length];
          const isSelected = activeStepTab === idx;

          return (
            <button
              key={st.step}
              onClick={() => setActiveStepTab(idx)}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                isSelected
                  ? 'bg-soil text-white border-soil shadow-neo -translate-y-1'
                  : 'bg-white text-soil border-soil/40 hover:border-soil shadow-neo-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center ${
                    isSelected ? 'bg-amber text-soil border-amber' : 'bg-canvas-dark text-soil border-soil/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-amber' : 'text-leaf'}`}>
                  {st.latencyMs}ms
                </span>
              </div>

              <div className="font-mono text-[10px] font-black uppercase tracking-wider opacity-80">
                Step {idx + 1}
              </div>
              <div className="font-bold text-xs truncate mt-0.5">
                {st.model}
              </div>
              <div className={`text-[10px] truncate ${isSelected ? 'text-white/70' : 'text-soil-muted'}`}>
                {st.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Step Inspector Card */}
      <div className="bg-white border-3 border-soil rounded-2xl p-5 sm:p-7 shadow-neo-lg font-mono">
        <div className="flex items-center justify-between border-b-2 border-soil/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-leaf"></span>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-soil">
              Step {activeStepTab + 1}: {steps[activeStepTab].model} — {steps[activeStepTab].name}
            </h3>
          </div>
          <span className="neo-badge bg-leaf text-white border-soil">
            STATUS: 200 OK
          </span>
        </div>

        <div className="my-4 text-xs font-sans text-soil leading-relaxed">
          {steps[activeStepTab].detail}
        </div>

        {/* Step Deep-Dive Data */}
        <div className="p-3.5 rounded-xl bg-canvas border border-soil/30 text-xs font-mono space-y-2">
          <div className="text-[10px] text-soil-muted uppercase font-bold tracking-wider">
            Diagnostic Telemetry
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-soil-muted text-[10px] block">Latency:</span>
              <span className="font-bold text-forest">{steps[activeStepTab].latencyMs} milliseconds</span>
            </div>
            <div>
              <span className="text-soil-muted text-[10px] block">Provider:</span>
              <span className="font-bold text-forest">
                {activeStepTab === 2 ? 'Local FasalRoute Engine' : 'Sarvam AI Cloud'}
              </span>
            </div>
            <div>
              <span className="text-soil-muted text-[10px] block">Security Guardrail:</span>
              <span className="font-bold text-leaf flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                No Key in Browser
              </span>
            </div>
          </div>
        </div>

        {/* Golden Rule Banner */}
        <div className="mt-4 p-3 rounded-xl bg-amber/15 border-2 border-soil text-xs text-soil font-sans flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-forest font-bold">Hard Architectural Boundary:</strong>
            <span className="text-soil ml-1">
              The LLM is prompted with strict instruction to invoke tools for calculations. When synthesizing output, an automated validator in our backend compares every numerical entity against the engine's JSON output before sending to Bulbul TTS.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
