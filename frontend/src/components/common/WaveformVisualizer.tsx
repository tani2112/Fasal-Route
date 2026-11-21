import React from 'react';

interface WaveformVisualizerProps {
  isRecording?: boolean;
  isPlaying?: boolean;
  bars?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording = false,
  isPlaying = false,
  bars = 24,
  className = '',
  size = 'md',
}) => {
  const active = isRecording || isPlaying;

  const heightClasses = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-16',
  };

  const barHeights = [
    25, 45, 70, 90, 60, 35, 80, 100, 65, 40, 85, 95, 55, 30, 75, 90, 50, 35, 65, 80, 45, 30, 55, 40,
  ];

  return (
    <div className={`flex items-center justify-center gap-1 ${heightClasses[size]} ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = barHeights[i % barHeights.length];
        const animDelay = (i * 0.05).toFixed(2);
        const animDuration = (0.6 + (i % 5) * 0.15).toFixed(2);

        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              active
                ? 'bg-amber border-[0.5px] border-soil'
                : 'bg-soil/25'
            }`}
            style={{
              height: active ? `${baseHeight}%` : '20%',
              animation: active ? `pulseWave ${animDuration}s ease-in-out ${animDelay}s infinite alternate` : 'none',
              transformOrigin: 'bottom',
            }}
          />
        );
      })}
    </div>
  );
};
