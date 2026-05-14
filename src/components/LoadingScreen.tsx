import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Zap, Search, Scan, Terminal } from 'lucide-react';

const loadingTexts = [
  "Analyzing visual structure...",
  "Reading cinematic details...",
  "Generating ultra prompt...",
  "Encoding neural artifacts...",
  "Synthesizing lighting maps...",
];

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFDE00] overflow-hidden">
      {/* Background deco */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#000_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-32 h-32 border-8 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#FFDE00]"
          >
            <Zap className="w-16 h-16 text-black fill-black" />
          </motion.div>
          
          {/* Scanning line */}
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-black shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4 flex items-center gap-2">
          XYRAA <span className="bg-black text-white px-2">PROMPT</span>
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest text-black/50 mb-8">Generator v1.0.0</p>

        <div className="w-64 h-8 border-4 border-black bg-white relative overflow-hidden mb-4">
          <motion.div 
            className="h-full bg-[#00E0FF]" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="flex items-center gap-2 text-black font-mono text-xs uppercase"
          >
            <Terminal size={14} />
            {loadingTexts[textIndex]}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Cyber deco */}
      <div className="absolute bottom-10 left-10 text-xs font-bold font-mono uppercase text-black">
        SYS_STATUS: BOOTING...<br/>
        ENCRYPTION: ACTIVE<br/>
        AI_MODEL: GEMINI_3_FLASH
      </div>
    </div>
  );
};
