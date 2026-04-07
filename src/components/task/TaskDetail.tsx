import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTaskContext } from '../../context/TaskContext';
import { computeTaskStatus } from '../../utils/urgency';
import { getCategoryById } from '../../utils/categories';
import { formatTimeAgo, formatDuration } from '../../utils/time';
import { getIconStyles, getIconGlow, getDecayAccent } from '../../utils/iconEffects';
import { ConfirmSheet } from '../shared/ConfirmSheet';

export function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTask, completeTask, archiveTask, deleteTask } = useTaskContext();
  const [showArchive, setShowArchive] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const task = taskId ? getTask(taskId) : undefined;

  if (!task) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        Task not found.
      </div>
    );
  }

  const status = computeTaskStatus(task);
  const category = getCategoryById(task.categoryId);
  const sortedCompletions = [...task.completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  function handleComplete() {
    completeTask(task!.id, {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
    });
  }

  function handleArchive() {
    archiveTask(task!.id);
    navigate('/');
  }

  function handleDelete() {
    deleteTask(task!.id);
    navigate('/');
  }

  return (
    <motion.div
      initial={{ y: '10%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25 }}
      className="px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="relative">
          <span
            className="text-4xl block"
            style={{
              ...getIconStyles(status.percentElapsed),
              boxShadow: getIconGlow(status.urgencyColor, status.percentElapsed),
              borderRadius: '8px',
            }}
          >
            {task.icon ?? category.icon}
          </span>
          {getDecayAccent(status.percentElapsed) && (
            <span className="absolute -bottom-1 -right-1 text-sm">
              {getDecayAccent(status.percentElapsed)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-100">{task.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {category.label} · Every {formatDuration(task.intervalDays)}
          </p>
        </div>
      </div>

      {/* Status card */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{ backgroundColor: status.urgencyColor + '15' }}
      >
        <div className="text-center">
          <p className="text-3xl font-bold" style={{ color: status.urgencyColor }}>
            {status.lastCompletedAt
              ? formatTimeAgo(new Date(status.lastCompletedAt))
              : 'Never'}
          </p>
          <p className="text-sm italic mt-2" style={{ color: status.urgencyColor }}>
            {status.personalityMessage}
          </p>
          {task.streakCount > 1 && (
            <p className="text-amber-400 text-sm mt-2">
              🔥 {task.streakCount} streak
            </p>
          )}
        </div>
      </div>

      {/* Done button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleComplete}
        className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/25 mb-6"
      >
        Mark as Done
      </motion.button>

      {/* Notes */}
      {task.notes && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Notes</h3>
          <p className="text-sm text-slate-300 bg-slate-800/50 rounded-xl p-4 whitespace-pre-wrap">
            {task.notes}
          </p>
        </div>
      )}

      {/* History */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-2">
          History ({task.completions.length})
        </h3>
        {sortedCompletions.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No completions yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sortedCompletions.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-300">
                  {new Date(c.completedAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {formatTimeAgo(new Date(c.completedAt))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/edit/${task.id}`)}
          className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium"
        >
          Edit
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowArchive(true)}
          className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-400 font-medium"
        >
          Archive
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDelete(true)}
          className="py-3 px-4 rounded-xl bg-red-500/10 text-red-400 font-medium"
        >
          Delete
        </motion.button>
      </div>

      <ConfirmSheet
        isOpen={showArchive}
        title="Archive Task"
        message="This will hide the task from your dashboard. You can restore it later."
        confirmLabel="Archive"
        onConfirm={handleArchive}
        onCancel={() => setShowArchive(false)}
      />

      <ConfirmSheet
        isOpen={showDelete}
        title="Delete Task"
        message="This will permanently delete this task and all its history. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </motion.div>
  );
}
