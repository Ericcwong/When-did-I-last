import { useTaskContext } from '../context/TaskContext';
import { motion } from 'framer-motion';

export function Settings() {
  const { tasks, archivedTasks, restoreTask, deleteTask } = useTaskContext();

  return (
    <motion.div
      initial={{ y: '10%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25 }}
      className="px-4 py-6"
    >
      <h2 className="text-xl font-bold text-slate-100 mb-6">Settings</h2>

      {/* Stats */}
      <div className="bg-slate-800/50 rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-medium text-slate-400 mb-3">Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-100">{tasks.length}</p>
            <p className="text-xs text-slate-400">Active tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-100">
              {tasks.reduce((sum, t) => sum + t.completions.length, 0)}
            </p>
            <p className="text-xs text-slate-400">Total completions</p>
          </div>
        </div>
      </div>

      {/* Archived */}
      {archivedTasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Archived ({archivedTasks.length})
          </h3>
          <div className="flex flex-col gap-2">
            {archivedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-slate-800/50 rounded-xl px-4 py-3"
              >
                <span className="text-sm text-slate-300">{task.name}</span>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => restoreTask(task.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400"
                  >
                    Restore
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteTask(task.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* About */}
      <div className="bg-slate-800/50 rounded-2xl p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-2">About</h3>
        <p className="text-sm text-slate-300">
          When Did I Last... v1.0
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Your data is stored locally on this device.
        </p>
      </div>
    </motion.div>
  );
}
