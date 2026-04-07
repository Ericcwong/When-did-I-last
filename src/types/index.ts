export type CategoryId = 'home' | 'car' | 'health' | 'personal' | 'pet' | 'custom';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}

export interface CompletionRecord {
  id: string;
  completedAt: string; // ISO 8601
  notes?: string;
}

export interface Task {
  id: string;
  name: string;
  categoryId: CategoryId;
  icon?: string;        // user-chosen emoji, falls back to category icon
  intervalDays: number;
  notes?: string;
  completions: CompletionRecord[];
  createdAt: string;
  streakCount: number;
  isArchived: boolean;
}

export interface TaskWithStatus extends Task {
  lastCompletedAt: string | null;
  daysSinceLast: number | null;
  percentElapsed: number;
  urgencyLevel: 'fresh' | 'due' | 'overdue';
  urgencyColor: string;
  personalityMessage: string;
}

export interface AppState {
  tasks: Task[];
  hasCompletedOnboarding: boolean;
  version: number;
}

export type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; task: Task }
  | { type: 'COMPLETE_TASK'; taskId: string; completion: CompletionRecord }
  | { type: 'ARCHIVE_TASK'; taskId: string }
  | { type: 'DELETE_TASK'; taskId: string }
  | { type: 'RESTORE_TASK'; taskId: string };
