import { getItem, setItem, removeItem } from './storage';

const STORAGE_KEY = 'activityLog';
const MAX_ENTRIES = 250;

export const ACTIVITY_UPDATED_EVENT = 'dp:activity-updated';
export const ACTIVITY_CATEGORIES = [
  'alert',
  'catalog',
  'compare',
  'favorite',
  'pin',
  'policy',
  'preferences',
];

function emitUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ACTIVITY_UPDATED_EVENT));
  }
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const category = typeof entry.category === 'string' ? entry.category : 'general';
  const message = typeof entry.message === 'string' ? entry.message : '';
  if (!message) return null;
  return {
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    category: ACTIVITY_CATEGORIES.includes(category) ? category : 'general',
    message,
    meta: entry.meta && typeof entry.meta === 'object' ? entry.meta : null,
  };
}

export function getActivityLog() {
  const raw = getItem(STORAGE_KEY, []);
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeEntry)
    .filter(Boolean)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}

export function recordActivity(entry) {
  const normalized = normalizeEntry(entry);
  if (!normalized) return getActivityLog();
  const current = getActivityLog();
  const next = [normalized, ...current].slice(0, MAX_ENTRIES);
  setItem(STORAGE_KEY, next);
  emitUpdate();
  return next;
}

export function clearActivityLog() {
  removeItem(STORAGE_KEY);
  emitUpdate();
  return [];
}

export function summarizeActivity(entries) {
  const list = Array.isArray(entries) ? entries : getActivityLog();
  const summary = { total: list.length };
  ACTIVITY_CATEGORIES.forEach(cat => { summary[cat] = 0; });
  list.forEach(entry => {
    if (summary[entry.category] != null) summary[entry.category] += 1;
  });
  return summary;
}
