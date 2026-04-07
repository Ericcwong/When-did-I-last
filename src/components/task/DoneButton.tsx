import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DoneButtonProps {
  onDone: () => void;
}

export function DoneButton({ onDone }: DoneButtonProps) {
  const [showFlash, setShowFlash] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setShowFlash(true);
    onDone();
    setTimeout(() => setShowFlash(false), 600);
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleClick}
        className="shrink-0 w-10 h-10 rounded-full bg-slate-700/80 flex items-center justify-center text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-emerald-400/30 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
