import { getItem, setItem } from './storage';

const KEY = 'compareShortlist';
const MAX_ITEMS = 4;

export function getCompareShortlist() {
  const raw = getItem(KEY, []);
  return Array.isArray(raw) ? raw.slice(0, MAX_ITEMS) : [];
}

export function setCompareShortlist(slugs) {
  const unique = [...new Set((Array.isArray(slugs) ? slugs : []).filter(Boolean))];
  setItem(KEY, unique.slice(0, MAX_ITEMS));
}

export function toggleCompareShortlist(slug) {
  if (!slug) return getCompareShortlist();
  const list = getCompareShortlist();
  const next = list.includes(slug)
    ? list.filter(s => s !== slug)
    : [...list, slug].slice(0, MAX_ITEMS);
  setCompareShortlist(next);
  return next;
}

export function isInCompareShortlist(slug) {
  return getCompareShortlist().includes(slug);
}

