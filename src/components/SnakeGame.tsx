import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSnake } from '../hooks/useSnake';
import { GRID_SIZE } from '../constants';
import { Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate?: (score: number) => void;
  onHighScoreUpdate?: (highScore: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate, onHighScoreUpdate }) => {
  const { snake, food, score, status, highScore, resetGame } = useSnake();

  // Sync scores with parent for the design's header
  React.useEffect(() => {
    onScoreUpdate?.(score);
  }, [score, onScoreUpdate]);

  React.useEffect(() => {
    onHighScoreUpdate?.(highScore);
  }, [highScore, onHighScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black">
      {/* Game Board Container with Glitch Border */}
      <div className="relative p-1 bg-black border-4 border-[#00f3ff] shadow-[8px_8px_0px_#ff00ff] animate-tear">
        <div 
          className="bg-black relative overflow-hidden border border-[#00f3ff]/20"
          style={{ 
            width: 'min(540px, 80vw)',
            height: 'min(480px, 70vh)',
          }}
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_2px,3px_100%]" />

          {/* Game Elements Layer */}
          <div 
            className="absolute inset-0 grid" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;

              if (isSnakeHead) {
                return (
                  <div key={i} className="flex items-center justify-center p-[1px] z-10">
                    <div className="w-full h-full bg-white shadow-[0_0_20px_white] border-2 border-black flex items-center justify-around">
                      <div className="w-[30%] h-[30%] bg-black" />
                      <div className="w-[30%] h-[30%] bg-black" />
                    </div>
                  </div>
                );
              }

              if (isSnakeBody) {
                return (
                  <div key={i} className="p-[2px]">
                    <div className="w-full h-full bg-[#00f3ff] shadow-[2px_2px_0px_#ff00ff]" />
                  </div>
                );
              }

              if (isFood) {
                return (
                  <div key={i} className="p-[4px]">
                    <div className="w-full h-full bg-[#ff00ff] animate-pulse shadow-[0_0_15px_#ff00ff]" />
                  </div>
                );
              }

              return <div key={i} />;
            })}
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 opacity-50 font-black">
            <div className="px-2 py-1 bg-black text-[#00f3ff] text-[10px] border border-[#00f3ff] uppercase tracking-widest">MV_SEQ::WASD</div>
            <div className="px-2 py-1 bg-black text-[#00f3ff] text-[10px] border border-[#00f3ff] uppercase tracking-widest">ESC::PAUSE</div>
          </div>

          {/* App State Overlays */}
          <AnimatePresence>
            {status !== 'playing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 z-20"
              >
                <div className="text-center p-12 animate-tear">
                  {status === 'idle' ? (
                    <>
                      <h2 className="text-6xl font-black italic tracking-tighter text-glitch mb-4 uppercase">SNAKE_V001</h2>
                      <p className="text-[#ff00ff] mb-12 font-bold text-xs uppercase tracking-[0.5em]">INITIATE_VOID_SEQ // ACCESS_DENIED_OVERRIDE</p>
                      <button 
                        onClick={resetGame}
                        className="px-12 py-5 bg-[#00f3ff] text-black font-black uppercase text-xl shadow-[6px_6px_0px_#ff00ff] hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all"
                      >
                        BOOT_KERNEL
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-5xl font-black italic text-red-600 mb-4 uppercase text-glitch">KERNEL_PANIC</h2>
                      <p className="text-4xl font-mono text-[#00f3ff] mb-12 tracking-widest">VAL::{score.toString().padStart(6, '0')}</p>
                      <button 
                        onClick={resetGame}
                        className="flex items-center gap-4 px-12 py-5 bg-white text-black font-black uppercase text-xl shadow-[6px_6px_0px_#ff00ff] hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-all"
                      >
                        <RotateCcw className="w-6 h-6" />
                        RE_LINK
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
