import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, User, Music as MusicIcon, BarChart3 } from 'lucide-react';
import { SONGS } from '../constants';

interface MusicState {
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentTime: number;
  duration: number;
}

export const MusicPlayer: React.FC = () => {
  // This is now a layout wrapper or provider-like component if needed, 
  // but we'll use it as a container in App.tsx. 
  // For simplicity, we'll just implement the pieces here.
  return null;
};

export const TrackSidebar: React.FC<{ 
  currentIndex: number; 
  onSelect: (index: number) => void;
}> = ({ currentIndex, onSelect }) => {
  const currentSong = SONGS[currentIndex];

  return (
    <aside className="w-full flex flex-col gap-0 h-full bg-black">
      {/* Track Info Card */}
      <div className="p-6 flex flex-col gap-6 border-b-2 border-[#00f3ff]">
        <div className="aspect-square bg-white/5 border-2 border-[#00f3ff] p-2 flex items-center justify-center relative overflow-hidden group shadow-[4px_4px_0px_#ff00ff]">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSong.id}
              src={currentSong.cover} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-75"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              exit={{ scale: 0.8, opacity: 0 }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-x-0 bottom-0 flex h-12 items-end justify-center gap-1 group-hover:animate-tear px-4">
               {[...Array(8)].map((_, i) => (
                 <motion.div 
                  key={i}
                  className={`w-2 bg-[#00f3ff]/90 ${i % 2 === 0 ? 'bg-[#ff00ff]/90' : ''}`}
                  animate={{ height: [10, 40, 20, 30, 10][i % 5] }}
                  transition={{ repeat: Infinity, duration: 0.4 + i*0.1, ease: "steps(4)" }}
                 />
               ))}
          </div>

          <div className="absolute top-2 left-2 px-2 bg-black text-[9px] uppercase font-bold text-[#00f3ff] font-mono border border-[#00f3ff]">
            SIGNAL_RAW
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black truncate text-glitch leading-none uppercase">{currentSong.title}</h2>
          <p className="text-xs text-white/40 flex items-center gap-2 uppercase tracking-[0.2em] font-bold">
            <User className="w-3 h-3" />
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Queue */}
      <div className="flex-1 p-6 flex flex-col gap-4 min-h-0">
        <h3 className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-black mb-2 animate-pulse">_ACCESS_QUEUE</h3>
        <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar">
          {SONGS.map((song, idx) => (
            <button
              key={song.id}
              onClick={() => onSelect(idx)}
              className={`flex items-center gap-4 p-3 transition-all group border-b border-white/5 ${
                idx === currentIndex 
                  ? 'bg-[#ff00ff]/20 text-[#ff00ff] border-l-4 border-l-[#ff00ff]' 
                  : 'hover:bg-white/10 text-white/50 border-l-4 border-l-transparent'
              }`}
            >
              <span className="text-sm font-mono opacity-50">{String(idx + 1).padStart(2, '0')}</span>
              <span className={`text-sm font-black truncate text-left uppercase tracking-tighter`}>
                {song.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export const MusicFooter: React.FC<{
  state: MusicState;
  onPlayPause: () => void;
  onSkip: (dir: 'fwd' | 'back') => void;
  onVolumeChange: (v: number) => void;
}> = ({ state, onPlayPause, onSkip, onVolumeChange }) => {
  const currentSong = SONGS[state.currentIndex];

  return (
    <footer className="h-24 bg-black border-t-2 border-[#00f3ff] px-10 flex items-center gap-16 relative z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      {/* Left: Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onSkip('back')}
          className="p-3 text-[#00f3ff] hover:bg-[#00f3ff]/10 border border-transparent hover:border-[#00f3ff] transition-all"
        >
          <SkipBack className="w-5 h-5 fill-current" />
        </button>
        <button 
          onClick={onPlayPause}
          className="w-16 h-16 bg-[#ff00ff] flex items-center justify-center text-black shadow-[4px_4px_0px_#00f3ff] hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all font-black text-2xl"
        >
          {state.isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
        </button>
        <button 
          onClick={() => onSkip('fwd')}
          className="p-3 text-[#00f3ff] hover:bg-[#00f3ff]/10 border border-transparent hover:border-[#00f3ff] transition-all"
        >
          <SkipForward className="w-5 h-5 fill-current" />
        </button>
      </div>

      {/* Center: Progress */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-center text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] font-black">
          <span>{Math.floor(state.currentTime / 60)}:{(Math.floor(state.currentTime % 60)).toString().padStart(2, '0')}</span>
          <div className="flex items-center gap-4 text-[#00f3ff]">
            <div className="w-12 h-[2px] bg-[#00f3ff] animate-tear" />
            <span className="text-lg italic tracking-tightest text-glitch">SIGNAL::{currentSong.title.toUpperCase()}</span>
            <div className="w-12 h-[2px] bg-[#00f3ff] animate-tear" />
          </div>
          <span>{Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="h-6 w-full bg-white/5 border border-[#00f3ff] relative overflow-hidden group cursor-crosshair">
          <motion.div 
            className="absolute h-full bg-[#00f3ff] animate-pulse"
            animate={{ width: `${state.progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[9px] font-black tracking-[1em] text-white/20">
            LOADING_BUFFER_PHASE
          </div>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="w-56 flex items-center gap-6 group">
        <span className="text-[10px] font-mono text-white/40 uppercase">GAIN::</span>
        <div className="flex-1 h-3 bg-white/5 border border-white/20 overflow-hidden relative">
          <input 
            type="range" 
            min="0" max="1" step="0.01" 
            value={state.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full accent-[#ff00ff] bg-transparent cursor-pointer appearance-none z-10"
          />
          <div 
            className="absolute h-full bg-[#ff00ff]/30 pointer-events-none" 
            style={{ width: `${state.volume * 100}%` }}
          />
        </div>
      </div>
    </footer>
  );
};
