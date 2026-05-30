import { getItem, setItem, removeItem } from './storage';

const STORAGE_KEY = 'pinnedPlugins';
const MAX_PINNED = 8;

export const PINNED_UPDATED_EVENT = 'dp:pinned-updated';

function emitUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PINNED_UPDATED_EVENT));
  }
}

export function getPinnedPlugins() {
  const raw = getItem(STORAGE_KEY, []);
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.filter(Boolean))].slice(0, MAX_PINNED);
}

export function setPinnedPlugins(slugs) {
  const list = Array.isArray(slugs) ? slugs : [];
  const normalized = [...new Set(list.filter(Boolean))].slice(0, MAX_PINNED);
  setItem(STORAGE_KEY, normalized);
  emitUpdate();
  return normalized;
}

export function togglePinnedPlugin(slug) {
  if (!slug) return { list: getPinnedPlugins(), pinned: false, limitReached: false };
  const list = getPinnedPlugins();
  if (list.includes(slug)) {
    const next = list.filter(s => s !== slug);
    setItem(STORAGE_KEY, next);
    emitUpdate();
    return { list: next, pinned: false, limitReached: false };
  }
  if (list.length >= MAX_PINNED) {
    return { list, pinned: true, limitReached: true };
  }
  const next = [...list, slug];
  setItem(STORAGE_KEY, next);
  emitUpdate();
  return { list: next, pinned: true, limitReached: false };
}

export function isPluginPinned(slug) {
  return getPinnedPlugins().includes(slug);
}

export function clearPinnedPlugins() {
  removeItem(STORAGE_KEY);
  emitUpdate();
  return [];
}

export { MAX_PINNED };
