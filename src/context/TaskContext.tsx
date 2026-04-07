import { createContext, useContext, type ReactNode } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';

type TaskStoreReturn = ReturnType<typeof useTaskStore>;

const TaskContext = createContext<TaskStoreReturn | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const store = useTaskStore();
  return <TaskContext.Provider value={store}>{children}</TaskContext.Provider>;
}

export function useTaskContext(): TaskStoreReturn {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
}
