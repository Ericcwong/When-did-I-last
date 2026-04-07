import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CategoryId, Task } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { CATEGORIES, getCategoryById } from '../../utils/categories';
import { EmojiPicker } from '../shared/EmojiPicker';

const FREQUENCY_PRESETS = [
  { label: 'Weekly', days: 7 },
  { label: 'Monthly', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 180 },
  { label: 'Yearly', days: 365 },
];

export function TaskForm() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { addTask, updateTask, getTask } = useTaskContext();

  const existingTask = taskId ? getTask(taskId) : undefined;
  const isEdit = !!existingTask;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('home');
  const [icon, setIcon] = useState('');
  const [intervalDays, setIntervalDays] = useState(30);
  const [customDays, setCustomDays] = useState('');
  const [isCustomFreq, setIsCustomFreq] = useState(false);
  const [notes, setNotes] = useState('');
  const [lastDoneDate, setLastDoneDate] = useState('');

  useEffect(() => {
    if (existingTask) {
      setName(existingTask.name);
      setCategoryId(existingTask.categoryId);
      setIcon(existingTask.icon ?? '');
      setIntervalDays(existingTask.intervalDays);
      setNotes(existingTask.notes ?? '');
      const preset = FREQUENCY_PRESETS.find((p) => p.days === existingTask.intervalDays);
      if (!preset) {
        setIsCustomFreq(true);
        setCustomDays(String(existingTask.intervalDays));
      }
    }
  }, [existingTask]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const finalInterval = isCustomFreq ? (parseInt(customDays) || 30) : intervalDays;

    const chosenIcon = icon || undefined;

    if (isEdit && existingTask) {
      updateTask({
        ...existingTask,
        name: name.trim(),
        categoryId,
        icon: chosenIcon,
        intervalDays: finalInterval,
        notes: notes.trim() || undefined,
      });
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        name: name.trim(),
        categoryId,
        icon: chosenIcon,
        intervalDays: finalInterval,
        notes: notes.trim() || undefined,
        completions: lastDoneDate
          ? [{ id: crypto.randomUUID(), completedAt: new Date(lastDoneDate).toISOString() }]
          : [],
        createdAt: new Date().toISOString(),
        streakCount: 0,
        isArchived: false,
      };
      addTask(newTask);
    }

    navigate(-1);
  }

  return (
    <motion.div
      initial={{ y: '10%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25 }}
      className="px-4 py-6"
    >
      <h2 className="text-xl font-bold text-slate-100 mb-6">
        {isEdit ? 'Edit Task' : 'Add Task'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            What do you want to track?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Change air filter"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoryId === cat.id
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {cat.icon} {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Icon */}
        <EmojiPicker
          selected={icon || getCategoryById(categoryId).icon}
          onSelect={(emoji) => setIcon(emoji)}
        />

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            How often should you do this?
          </label>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_PRESETS.map((preset) => (
              <motion.button
                key={preset.days}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIntervalDays(preset.days);
                  setIsCustomFreq(false);
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !isCustomFreq && intervalDays === preset.days
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {preset.label}
              </motion.button>
            ))}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCustomFreq(true)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isCustomFreq
                  ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              Custom
            </motion.button>
          </div>
          {isCustomFreq && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-sm text-slate-400">Every</span>
              <input
                type="number"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                min="1"
                className="w-20 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-sm text-slate-400">days</span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Notes <span className="text-slate-600">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Brand, model, links, anything useful..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Last done date (add mode only) */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              When did you last do this? <span className="text-slate-600">(optional)</span>
            </label>
            <input
              type="date"
              value={lastDoneDate}
              onChange={(e) => setLastDoneDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={!name.trim()}
          className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 mt-2"
        >
          {isEdit ? 'Save Changes' : 'Add Task'}
        </motion.button>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-3 text-slate-400 text-sm font-medium"
        >
          Cancel
        </button>
      </form>
    </motion.div>
  );
}
