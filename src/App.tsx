import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { TrackSidebar, MusicFooter } from './components/MusicPlayer';
import { Sparkles, Gamepad2, Activity, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { SONGS } from './constants';

export default function App() {
  // Music State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Game Score State (lifted from SnakeGame)
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Music Handlers
  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleSkip = useCallback((dir: 'fwd' | 'back') => {
    setCurrentIndex((prev) => {
      if (dir === 'fwd') return (prev + 1) % SONGS.length;
      return (prev - 1 + SONGS.length) % SONGS.length;
    });
    setIsPlaying(true);
  }, []);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isPlaying]);
  return (
    <div className="h-screen w-screen bg-black text-[#00f3ff] flex flex-col overflow-hidden font-sans relative">
      <div className="scanline" />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[#00f3ff]/5 animate-tear" />
      </div>

      <audio 
        ref={audioRef} 
        src={SONGS[currentIndex].url} 
        onTimeUpdate={onTimeUpdate} 
        onEnded={() => handleSkip('fwd')}
      />

      {/* Top Header Bar */}
      <header className="h-16 shrink-0 px-8 flex items-center justify-between border-b-2 border-[#00f3ff] bg-black relative z-20 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff00ff] flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-3xl font-black italic text-glitch tracking-tighter uppercase">CORE_NULL_SNAKE</h1>
        </div>

        <div className="flex gap-16 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#ff00ff] font-bold">NODE_ACCUMULATION</span>
            <span className="text-3xl font-mono text-glitch">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end border-l-2 border-[#00f3ff]/30 pl-12">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">HIST_MAX</span>
            <span className="text-3xl font-mono opacity-50">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Core Area */}
      <main className="flex-1 min-h-0 flex gap-0 relative z-10">
        {/* Sidebar Left: Music Info */}
        <div className="w-72 border-r-2 border-[#00f3ff]">
          <TrackSidebar 
            currentIndex={currentIndex} 
            onSelect={(idx) => { setCurrentIndex(idx); setIsPlaying(true); }} 
          />
        </div>

        {/* Center Stage: Snake Game */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
          <SnakeGame 
            onScoreUpdate={setScore} 
            onHighScoreUpdate={setHighScore} 
          />
        </div>

        {/* Sidebar Right: Stats */}
        <aside className="w-72 flex flex-col gap-0 border-l-2 border-[#00f3ff]">
          <div className="p-6 border-b-2 border-[#00f3ff]">
            <h3 className="text-[11px] uppercase tracking-[0.5em] text-[#ff00ff] font-black mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 animate-bounce" />
              SYSTEM_METRICS
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span>PROC_FLOW</span>
                  <span className="text-glitch">1.2X</span>
                </div>
                <div className="h-4 bg-white/5 border border-[#00f3ff] p-[2px]">
                  <motion.div className="h-full bg-[#00f3ff]" initial={{ width: 0 }} animate={{ width: '70%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span>WAVE_SYNC</span>
                  <span className="text-[#ff00ff]">440HZ</span>
                </div>
                <div className="h-4 bg-white/5 border border-[#ff00ff] p-[2px]">
                  <motion.div 
                    className="h-full bg-[#ff00ff]" 
                    animate={{ width: ['30%', '60%', '40%'] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-4 bg-white/5">
             <span className="text-xs uppercase text-glitch font-black tracking-[0.5em] text-center">AI_VOID_LINK</span>
             <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 border-4 border-double border-[#00f3ff] rounded-none animate-tear"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                />
                <div className="w-12 h-12 flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-white animate-pulse" />
                </div>
             </div>
             <p className="text-[10px] text-center text-white/30 font-bold leading-relaxed px-4 mt-4 uppercase tracking-tighter">
               FEED_BACK_LOOP_STABLE // HARMONIZING_DECAY_CYCLES
             </p>
          </div>
        </aside>
      </main>

      {/* Music Control Bar */}
      <MusicFooter 
        state={{ currentIndex, isPlaying, progress, volume, currentTime, duration: SONGS[currentIndex].duration }}
        onPlayPause={handlePlayPause}
        onSkip={handleSkip}
        onVolumeChange={setVolume}
      />
    </div>
  );
}
