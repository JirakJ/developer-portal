import { getReleaseFreshness } from './versioning';
import { generatePortfolioUptime, isUptimeDegraded } from './uptime';
import { getItem, removeItem, setItem } from './storage';
import { getAlertPolicy } from './alertsPolicy';

export const ALERTS_DISMISS_KEY = 'dismissedAlerts';
export const ALERTS_UPDATED_EVENT = 'dp:alerts-updated';

const SEVERITY_RANK = {
  critical: 0,
  warning: 1,
  info: 2,
};

function buildReleaseAlert(plugin, freshness, policy) {
  if (freshness.ageMonths == null || freshness.ageMonths < policy.releaseMinAgeMonths) return null;
  const ageMonths = freshness.ageMonths ?? 0;
  const severity = ageMonths >= policy.releaseCriticalAgeMonths ? 'critical' : 'warning';
  return {
    id: `release-stale:${plugin.slug}:${plugin.version}`,
    revision: 1,
    type: 'release-stale',
    severity,
    pluginSlug: plugin.slug,
    pluginName: plugin.name,
    pluginIcon: plugin.icon,
    version: plugin.version,
    ageMonths: freshness.ageMonths,
    message: `${plugin.name} release is stale (${freshness.ageMonths} months old).`,
    actionLabel: 'Review in Releases',
    actionPath: '/releases?freshness=stale',
  };
}

function buildHealthAlert(plugin, pct, threshold, policy) {
  if (!isUptimeDegraded(pct, threshold)) return null;
  const delta = threshold - Number.parseFloat(pct);
  return {
    id: `health-degraded:${plugin.slug}:${threshold.toFixed(1)}`,
    revision: 1,
    type: 'health-degraded',
    severity: delta >= policy.healthCriticalDelta ? 'critical' : 'warning',
    pluginSlug: plugin.slug,
    pluginName: plugin.name,
    pluginIcon: plugin.icon,
    version: plugin.version,
    uptimePct: Number.parseFloat(pct),
    threshold,
    message: `${plugin.name} uptime is ${pct}% (below ${threshold.toFixed(1)}% threshold).`,
    actionLabel: 'Open System Health',
    actionPath: '/health',
  };
}

export function getPortfolioAlerts(pluginList, threshold, uptimeMap, policyInput) {
  const plugins = pluginList || [];
  const uptimeData = uptimeMap || generatePortfolioUptime(plugins);
  const policy = policyInput || getAlertPolicy();
  const alerts = [];

  plugins.forEach(plugin => {
    const freshness = getReleaseFreshness(plugin.version);
    const releaseAlert = buildReleaseAlert(plugin, freshness, policy);
    if (releaseAlert) alerts.push(releaseAlert);

    const uptime = uptimeData[plugin.slug];
    if (uptime?.pct) {
      const healthAlert = buildHealthAlert(plugin, uptime.pct, threshold, policy);
      if (healthAlert) alerts.push(healthAlert);
    }
  });

  return alerts.sort((a, b) => {
    const severityDiff = (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9);
    if (severityDiff !== 0) return severityDiff;
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.pluginName.localeCompare(b.pluginName);
  });
}

export function getOpenAlerts(alerts, dismissedMap) {
  const dismissed = dismissedMap || {};
  return (alerts || []).filter(alert => {
    const revision = dismissed[alert.id];
    return !(typeof revision === 'number' && revision >= alert.revision);
  });
}

export function summarizeAlerts(alerts, dismissedMap) {
  const open = getOpenAlerts(alerts, dismissedMap);
  const summary = {
    total: open.length,
    critical: 0,
    warning: 0,
    releaseStale: 0,
    healthDegraded: 0,
  };
  open.forEach(alert => {
    if (alert.severity === 'critical') summary.critical += 1;
    if (alert.severity === 'warning') summary.warning += 1;
    if (alert.type === 'release-stale') summary.releaseStale += 1;
    if (alert.type === 'health-degraded') summary.healthDegraded += 1;
  });
  return summary;
}

function emitAlertsUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ALERTS_UPDATED_EVENT));
  }
}

export function getDismissedAlerts() {
  const stored = getItem(ALERTS_DISMISS_KEY, {});
  return stored && typeof stored === 'object' ? stored : {};
}

export function dismissAlert(alert, dismissedMap) {
  if (!alert?.id) return getDismissedAlerts();
  const next = {
    ...(dismissedMap || getDismissedAlerts()),
    [alert.id]: alert.revision,
  };
  setItem(ALERTS_DISMISS_KEY, next);
  emitAlertsUpdated();
  return next;
}

export function restoreAlert(alertId, dismissedMap) {
  if (!alertId) return getDismissedAlerts();
  const current = { ...(dismissedMap || getDismissedAlerts()) };
  delete current[alertId];
  setItem(ALERTS_DISMISS_KEY, current);
  emitAlertsUpdated();
  return current;
}

export function clearDismissedAlerts() {
  removeItem(ALERTS_DISMISS_KEY);
  emitAlertsUpdated();
  return {};
}
