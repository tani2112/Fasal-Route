import React from 'react';
import { Mic, Square } from 'lucide-react';
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
      {/* Outer Pulse Rings */}
      <div className="relative flex items-center justify-center">
        {isRecording && (
          <>
            <div className="absolute w-32 h-32 rounded-full bg-red-400/20 animate-ping -z-10" />
            <div className="absolute w-40 h-40 rounded-full bg-red-500/10 animate-pulse -z-20" />
          </>
        )}

        {/* Main Mic Button */}
        <button
          onClick={handleClick}
          disabled={isProcessing}
          aria-label={isRecording ? 'Stop recording' : 'Start speaking your harvest question'}
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-md ${
            isRecording
              ? 'bg-red-500 text-white scale-105 shadow-red-500/30 shadow-lg'
              : isProcessing
              ? 'bg-gray-100 text-gray-400 cursor-wait'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:shadow-lg hover:scale-105'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-8 h-8 fill-current" />
              <span className="text-[10px] font-bold mt-1 tracking-wider uppercase">
                STOP
              </span>
            </>
          ) : isProcessing ? (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
              <span className="text-[10px] font-bold mt-1 text-emerald-800">
                THINKING
              </span>
            </>
          ) : (
            <>
              <Mic className="w-9 h-9 stroke-[2.2]" />
              <span className="text-[11px] font-bold mt-0.5 tracking-wide uppercase">
                SPEAK
              </span>
            </>
          )}
        </button>
      </div>

      {/* Waveform below Mic Button */}
      <div className="mt-3 w-56 flex flex-col items-center">
        <WaveformVisualizer isRecording={isRecording} isPlaying={false} size="sm" bars={24} />
        {statusText && (
          <p className="mt-1.5 text-xs font-medium text-gray-600 text-center max-w-xs">
            {statusText}
          </p>
        )}
      </div>
    </div>
  );
};
