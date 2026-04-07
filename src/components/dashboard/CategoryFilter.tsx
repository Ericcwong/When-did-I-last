import { motion } from 'framer-motion';
import type { CategoryId } from '../../types';
import { CATEGORIES } from '../../utils/categories';

interface CategoryFilterProps {
  selected: CategoryId | null;
  onSelect: (id: CategoryId | null) => void;
  taskCounts: Record<string, number>;
}

export function CategoryFilter({ selected, onSelect, taskCounts }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-slate-800 text-slate-400'
        }`}
      >
        All
      </motion.button>
      {CATEGORIES.map((cat) => {
        const count = taskCounts[cat.id] ?? 0;
        if (count === 0) return null;
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(selected === cat.id ? null : cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selected === cat.id
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {cat.icon} {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}
