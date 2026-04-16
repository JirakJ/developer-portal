import { getItem, setItem } from './storage';

const KEY = 'recentViewed';
const MAX_ITEMS = 8;

export function getRecentViewed() {
  const raw = getItem(KEY, []);
  return Array.isArray(raw) ? raw.slice(0, MAX_ITEMS) : [];
}

export function pushRecentViewed(slug) {
  if (!slug) return getRecentViewed();
  const current = getRecentViewed().filter(s => s !== slug);
  const next = [slug, ...current].slice(0, MAX_ITEMS);
  setItem(KEY, next);
  return next;
}

