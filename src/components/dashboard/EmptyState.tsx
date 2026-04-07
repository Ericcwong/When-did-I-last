import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-6xl mb-6"
      >
        🤔
      </motion.div>
      <h2 className="text-xl font-bold text-slate-200 mb-2">
        When did you last...?
      </h2>
      <p className="text-slate-400 mb-8 max-w-xs">
        Start tracking the things you keep forgetting about. Add your first task to get started.
      </p>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/add')}
        className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25"
      >
        Add your first task
      </motion.button>
    </div>
  );
}
