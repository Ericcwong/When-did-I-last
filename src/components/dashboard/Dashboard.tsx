import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CategoryId } from '../../types';
import { useTaskContext } from '../../context/TaskContext';
import { useLiveTimer } from '../../hooks/useLiveTimer';
import { computeTaskStatus } from '../../utils/urgency';
import { TaskCard } from './TaskCard';
import { CategoryFilter } from './CategoryFilter';
import { EmptyState } from './EmptyState';

export function Dashboard() {
  const { tasks, completeTask } = useTaskContext();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  // Force re-render every 60s
  useLiveTimer();

  const tasksWithStatus = useMemo(
    () => tasks.map(computeTaskStatus).sort((a, b) => b.percentElapsed - a.percentElapsed),
    [tasks]
  );

  const filteredTasks = useMemo(
    () =>
      selectedCategory
        ? tasksWithStatus.filter((t) => t.categoryId === selectedCategory)
        : tasksWithStatus,
    [tasksWithStatus, selectedCategory]
  );

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      counts[t.categoryId] = (counts[t.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [tasks]);

  function handleComplete(taskId: string) {
    completeTask(taskId, {
      id: crypto.randomUUID(),
      completedAt: new Date().toISOString(),
    });
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        taskCounts={taskCounts}
      />

      <div className="flex flex-col gap-3 px-4 pt-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <TaskCard task={task} onComplete={handleComplete} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
