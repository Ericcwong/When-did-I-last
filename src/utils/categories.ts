import type { Category, CategoryId } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'home', label: 'Home', icon: '🏠', color: '#6366f1' },
  { id: 'car', label: 'Car', icon: '🚗', color: '#8b5cf6' },
  { id: 'health', label: 'Health', icon: '🩺', color: '#ec4899' },
  { id: 'personal', label: 'Personal', icon: '👤', color: '#f59e0b' },
  { id: 'pet', label: 'Pet', icon: '🐾', color: '#10b981' },
  { id: 'custom', label: 'Custom', icon: '⭐', color: '#6b7280' },
];

export function getCategoryById(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
