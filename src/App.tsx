import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LoadingScreen } from './components/LoadingScreen';
import { Button } from './components/ui/Button';
import { Generator } from './components/Generator';
import { Templates } from './components/Templates';
import { HistoryView } from './components/HistoryView';
import { AboutView } from './components/AboutView';
import { Zap, History, Info, Home as HomeIcon, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Screen = 'home' | 'history' | 'about';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      darkMode ? "bg-zinc-900 text-white" : "bg-[#FFDE00] text-black"
    )}>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          border: '4px solid black',
          borderRadius: 0,
          fontWeight: 'bold',
          padding: '16px',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
        }
      }} />

      {/* Navbar - Restored with new theme */}
      <nav className="sticky top-6 z-40 max-w-7xl mx-auto px-4 md:px-0">
        <div className="bg-white dark:bg-zinc-800 border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentScreen('home')}
          >
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              XYRAA <span className="text-blue-600 dark:text-[#00E0FF]">PROMPT</span> GEN
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
            <NavButton 
              active={currentScreen === 'home'} 
              onClick={() => setCurrentScreen('home')}
              icon={<HomeIcon size={18} />}
              label="Generator"
            />
            <NavButton 
              active={currentScreen === 'history'} 
              onClick={() => setCurrentScreen('history')}
              icon={<History size={18} />}
              label="History"
            />
            <NavButton 
              active={currentScreen === 'about'} 
              onClick={() => setCurrentScreen('about')}
              icon={<Info size={18} />}
              label="About"
            />
            <button
              onClick={toggleDarkMode}
              className="p-2 border-4 border-black bg-white dark:bg-zinc-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all ml-2"
            >
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === 'home' && (
              <div className="space-y-12">
                <Generator onHistoryUpdate={() => {}} />
                <Templates />
              </div>
            )}
            {currentScreen === 'history' && <HistoryView />}
            {currentScreen === 'about' && <AboutView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-20 border-t-4 border-black p-8 bg-[#00E0FF] dark:bg-zinc-800 border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-black uppercase text-xl">Xyraa Generator</p>
            <p className="text-sm font-bold opacity-75">Elevating vision to neural masterpieces.</p>
          </div>
          <p className="text-sm font-black uppercase">© 2026 XYRAA LABS</p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-1 border-4 border-black font-black uppercase transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-none active:translate-y-0 active:translate-x-0 active:shadow-none",
        active ? "bg-[#00E5FF] text-black" : "bg-white dark:bg-zinc-700 dark:text-white"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
