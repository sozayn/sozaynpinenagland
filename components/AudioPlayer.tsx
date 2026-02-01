import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from './icons';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // No useEffect for src changes is needed. The `key={src}` prop on the <audio>
  // element handles re-mounting the component, which naturally resets all state.

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const onCanPlay = () => {
    setIsLoading(false);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;
    
    if (audio.paused) {
      audio.play().catch(e => {
        console.error("Error playing audio:", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  };

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      audioRef.current.currentTime = Number(progressBarRef.current.value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    audio.muted = newMutedState;

    if (!newMutedState && volume === 0) {
      const defaultVolume = 0.5;
      setVolume(defaultVolume);
      audio.volume = defaultVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time <= 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-sm text-gray-700 dark:text-gray-300">
      <audio
        key={src} // Force re-mount on src change for a clean state
        ref={audioRef}
        src={src}
        crossOrigin="anonymous"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onCanPlay={onCanPlay}
        onWaiting={() => setIsLoading(true)}
        onError={() => setIsLoading(false)} // Handle errors gracefully
        muted={isMuted}
        preload="metadata"
      />
      <button onClick={togglePlayPause} disabled={isLoading} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-tertiary disabled:opacity-50 disabled:cursor-wait">
        {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
      </button>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm w-12 text-center">{formatTime(currentTime)}</span>
        <input
          ref={progressBarRef}
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 audio-progress"
          disabled={isLoading || duration === 0}
        />
        <span className="text-sm w-12 text-center">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-2 group relative">
          <button onClick={toggleMute}>
            {isMuted ? <VolumeXIcon size={20} /> : <Volume2Icon size={20} />}
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-1 bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
             <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 audio-progress"
             />
          </div>
      </div>
      <style>{`
        .audio-progress::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #4F46E5;
            cursor: pointer;
            border-radius: 50%;
        }
        .audio-progress::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: #4F46E5;
            cursor: pointer;
            border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;