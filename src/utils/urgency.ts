import type { Task, TaskWithStatus } from '../types';
import { daysBetween } from './time';
import { getPersonalityMessage } from './personality';

export function getPercentElapsed(lastCompletedAt: string | null, intervalDays: number): number {
  if (!lastCompletedAt) return 1.5; // never done = max overdue
  const days = daysBetween(new Date(lastCompletedAt), new Date());
  return days / intervalDays;
}

export function getUrgencyColor(percentElapsed: number): string {
  const clamped = Math.min(percentElapsed, 1.5);
  if (clamped <= 0.5) return `hsl(142, 70%, 45%)`;
  if (clamped <= 1.0) {
    const t = (clamped - 0.5) / 0.5;
    return `hsl(${Math.round(142 - 97 * t)}, 80%, 48%)`;
  }
  const t = (clamped - 1.0) / 0.5;
  return `hsl(${Math.round(45 - 45 * t)}, 85%, 50%)`;
}

export function getUrgencyLevel(percentElapsed: number): 'fresh' | 'due' | 'overdue' {
  if (percentElapsed <= 0.5) return 'fresh';
  if (percentElapsed <= 1.0) return 'due';
  return 'overdue';
}

export function computeTaskStatus(task: Task): TaskWithStatus {
  const lastCompletion = task.completions.length > 0
    ? task.completions.reduce((a, b) =>
        new Date(a.completedAt) > new Date(b.completedAt) ? a : b
      )
    : null;

  const lastCompletedAt = lastCompletion?.completedAt ?? null;
  const daysSinceLast = lastCompletedAt
    ? daysBetween(new Date(lastCompletedAt), new Date())
    : null;
  const percentElapsed = getPercentElapsed(lastCompletedAt, task.intervalDays);
  const urgencyLevel = getUrgencyLevel(percentElapsed);
  const urgencyColor = getUrgencyColor(percentElapsed);
  const personalityMessage = getPersonalityMessage(task.categoryId, urgencyLevel, percentElapsed, task.completions.length === 0);

  return {
    ...task,
    lastCompletedAt,
    daysSinceLast,
    percentElapsed,
    urgencyLevel,
    urgencyColor,
    personalityMessage,
  };
}
