import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJI_GROUPS = [
  {
    label: 'Home',
    emojis: ['🏠', '🔧', '🪛', '🧹', '🪣', '💡', '🔥', '🪴', '🛁', '🧺', '🪟', '🗑️', '🛠️', '🧯', '❄️'],
  },
  {
    label: 'Car',
    emojis: ['🚗', '🚙', '🛞', '⛽', '🔋', '🧽', '🪪', '🅿️', '🚘', '🏍️'],
  },
  {
    label: 'Health',
    emojis: ['🩺', '🦷', '👁️', '💊', '🏥', '🩻', '💉', '🧴', '🏋️', '🧘', '🥗', '💤'],
  },
  {
    label: 'Personal',
    emojis: ['👤', '📞', '💇', '💅', '❤️', '🎂', '✉️', '🎁', '👨‍👩‍👧', '👵', '🤝', '🍽️'],
  },
  {
    label: 'Pet',
    emojis: ['🐾', '🐕', '🐈', '🐟', '🐦', '🐹', '🦎', '🐴', '🪮', '🦴'],
  },
  {
    label: 'Other',
    emojis: ['⭐', '📋', '🔑', '💰', '📦', '🎯', '⏰', '📅', '🧊', '🌡️', '☂️', '🔒'],
  },
];

interface EmojiPickerProps {
  selected: string;
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ selected, onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-1.5">Icon</label>
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 w-full text-left"
      >
        <span className="text-3xl">{selected}</span>
        <span className="text-sm text-slate-400">Tap to change</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-slate-800 rounded-xl p-3 border border-slate-700">
              {EMOJI_GROUPS.map((group) => (
                <div key={group.label} className="mb-3 last:mb-0">
                  <p className="text-xs text-slate-500 font-medium mb-1.5">{group.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.emojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                          onSelect(emoji);
                          setIsOpen(false);
                        }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-colors ${
                          selected === emoji
                            ? 'bg-emerald-500/20 ring-1 ring-emerald-500/50'
                            : 'hover:bg-slate-700'
                        }`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
