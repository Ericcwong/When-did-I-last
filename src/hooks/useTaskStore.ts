import { useCallback, useMemo } from 'react';
import type { Task, AppState, CompletionRecord } from '../types';
import { useLocalStorage } from './useLocalStorage';

const INITIAL_STATE: AppState = {
  tasks: [],
  hasCompletedOnboarding: false,
  version: 1,
};

function calculateStreak(completions: CompletionRecord[], intervalDays: number): number {
  if (completions.length === 0) return 0;

  const sorted = [...completions].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  // Check if most recent completion is within interval from now
  const now = new Date();
  const mostRecent = new Date(sorted[0].completedAt);
  const daysSinceLast = (now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLast > intervalDays * 1.5) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const curr = new Date(sorted[i - 1].completedAt);
    const prev = new Date(sorted[i].completedAt);
    const gap = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (gap <= intervalDays * 1.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function useTaskStore() {
  const [state, setState] = useLocalStorage<AppState>('when-did-i-last', INITIAL_STATE);

  const tasks = useMemo(() => state.tasks.filter((t) => !t.isArchived), [state.tasks]);
  const archivedTasks = useMemo(() => state.tasks.filter((t) => t.isArchived), [state.tasks]);

  const addTask = useCallback((task: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
  }, [setState]);

  const updateTask = useCallback((updated: Task) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updated.id ? updated : t)),
    }));
  }, [setState]);

  const completeTask = useCallback((taskId: string, completion: CompletionRecord) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newCompletions = [...t.completions, completion];
        return {
          ...t,
          completions: newCompletions,
          streakCount: calculateStreak(newCompletions, t.intervalDays),
        };
      }),
    }));
  }, [setState]);

  const archiveTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, isArchived: true } : t)),
    }));
  }, [setState]);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  }, [setState]);

  const restoreTask = useCallback((taskId: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, isArchived: false } : t)),
    }));
  }, [setState]);

  const getTask = useCallback((taskId: string): Task | undefined => {
    return state.tasks.find((t) => t.id === taskId);
  }, [state.tasks]);

  return {
    tasks,
    archivedTasks,
    addTask,
    updateTask,
    completeTask,
    archiveTask,
    deleteTask,
    restoreTask,
    getTask,
  };
}
