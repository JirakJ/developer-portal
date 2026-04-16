import { getItem, setItem } from './storage';

export const HEALTH_THRESHOLD_KEY = 'healthThreshold';
export const DEFAULT_HEALTH_THRESHOLD = 99;
export const MIN_HEALTH_THRESHOLD = 95;
export const MAX_HEALTH_THRESHOLD = 100;
export const HEALTH_POLICY_UPDATED_EVENT = 'dp:health-policy-updated';

export function normalizeHealthThreshold(value) {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(num)) return DEFAULT_HEALTH_THRESHOLD;
  return Math.min(MAX_HEALTH_THRESHOLD, Math.max(MIN_HEALTH_THRESHOLD, num));
}

export function getHealthThreshold() {
  return normalizeHealthThreshold(getItem(HEALTH_THRESHOLD_KEY, DEFAULT_HEALTH_THRESHOLD));
}

export function persistHealthThreshold(value) {
  const normalized = normalizeHealthThreshold(value);
  setItem(HEALTH_THRESHOLD_KEY, normalized);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(HEALTH_POLICY_UPDATED_EVENT));
  }
  return normalized;
}
