import { getItem, setItem } from './storage';

const ALERT_POLICY_KEY = 'alertPolicy';

export const ALERTS_POLICY_UPDATED_EVENT = 'dp:alerts-policy-updated';

export const DEFAULT_ALERT_POLICY = {
  releaseMinAgeMonths: 6,
  releaseCriticalAgeMonths: 9,
  healthCriticalDelta: 1,
};

function clampNumber(value, min, max, fallback) {
  const num = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
}

export function normalizeAlertPolicy(policy) {
  const releaseMinAgeMonths = Math.round(clampNumber(
    policy?.releaseMinAgeMonths,
    3,
    24,
    DEFAULT_ALERT_POLICY.releaseMinAgeMonths
  ));

  const releaseCriticalAgeMonths = Math.round(clampNumber(
    policy?.releaseCriticalAgeMonths,
    releaseMinAgeMonths + 1,
    36,
    Math.max(DEFAULT_ALERT_POLICY.releaseCriticalAgeMonths, releaseMinAgeMonths + 1)
  ));

  const healthCriticalDelta = Number(
    clampNumber(policy?.healthCriticalDelta, 0.2, 3, DEFAULT_ALERT_POLICY.healthCriticalDelta).toFixed(1)
  );

  return { releaseMinAgeMonths, releaseCriticalAgeMonths, healthCriticalDelta };
}

export function getAlertPolicy() {
  return normalizeAlertPolicy(getItem(ALERT_POLICY_KEY, DEFAULT_ALERT_POLICY));
}

function emitPolicyUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ALERTS_POLICY_UPDATED_EVENT));
  }
}

export function persistAlertPolicy(partial) {
  const current = getAlertPolicy();
  const next = normalizeAlertPolicy({ ...current, ...(partial || {}) });
  setItem(ALERT_POLICY_KEY, next);
  emitPolicyUpdated();
  return next;
}

export function resetAlertPolicy() {
  const next = normalizeAlertPolicy(DEFAULT_ALERT_POLICY);
  setItem(ALERT_POLICY_KEY, next);
  emitPolicyUpdated();
  return next;
}
