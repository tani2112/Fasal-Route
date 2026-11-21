import React from 'react';
import { Mic, MicOff, Square, Sparkles } from 'lucide-react';
import { WaveformVisualizer } from '../common/WaveformVisualizer';

interface VoiceMicProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  statusText?: string;
  className?: string;
}

export const VoiceMic: React.FC<VoiceMicProps> = ({
  isRecording,
  isProcessing,
  onStartRecord,
  onStopRecord,
  statusText,
  className = '',
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecord();
    } else if (!isProcessing) {
      onStartRecord();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Pulse Rings when Recording */}
      <div className="relative flex items-center justify-center">
        {isRecording && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-amber/40 border-2 border-soil animate-ping -z-10" />
            <div className="absolute w-44 h-44 rounded-full bg-amber/20 border border-soil/30 animate-pulse -z-20" />
          </>
        )}

        {/* Main Mic Button */}
        <button
          onClick={handleClick}
          disabled={isProcessing}
          aria-label={isRecording ? 'Stop recording' : 'Start speaking your harvest question'}
          className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-3 border-soil shadow-neo-lg flex flex-col items-center justify-center transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-neo-sm ${
            isRecording
              ? 'bg-tomato text-white scale-105 shadow-neo-xl rotate-1'
              : isProcessing
              ? 'bg-canvas-dark text-soil-muted cursor-wait'
              : 'bg-amber hover:bg-amber-hover text-soil hover:-translate-y-1 hover:shadow-neo-xl'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-10 h-10 fill-current" />
              <span className="text-[11px] font-mono font-bold mt-1 tracking-wider uppercase">
                STOP
              </span>
            </>
          ) : isProcessing ? (
            <>
              <div className="w-10 h-10 rounded-full border-3 border-soil border-t-amber animate-spin" />
              <span className="text-[10px] font-mono font-bold mt-1 text-soil">
                THINKING
              </span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12 stroke-[2.2]" />
              <span className="text-xs font-mono font-black mt-1 tracking-wide uppercase">
                SPEAK
              </span>
            </>
          )}
        </button>
      </div>

      {/* Live Waveform Motif below Mic Button */}
      <div className="mt-4 w-64 flex flex-col items-center">
        <WaveformVisualizer isRecording={isRecording} isPlaying={false} size="sm" bars={28} />
        {statusText && (
          <p className="mt-2 text-xs font-medium text-soil text-center max-w-xs animate-fade-in">
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
};
