import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import plugins from '../data/plugins';
import { getHealthThreshold, HEALTH_POLICY_UPDATED_EVENT } from '../utils/healthPolicy';
import { getAlertPolicy, ALERTS_POLICY_UPDATED_EVENT } from '../utils/alertsPolicy';
import { generatePortfolioUptime } from '../utils/uptime';
import {
  ALERTS_UPDATED_EVENT,
  getDismissedAlerts,
  getPortfolioAlerts,
  summarizeAlerts,
} from '../utils/alerts';

function buildSummary() {
  const threshold = getHealthThreshold();
  const policy = getAlertPolicy();
  const alerts = getPortfolioAlerts(plugins, threshold, generatePortfolioUptime(plugins), policy);
  return summarizeAlerts(alerts, getDismissedAlerts());
}

export default function HeaderInbox() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(() => buildSummary());

  useEffect(() => {
    const refresh = () => setSummary(buildSummary());
    window.addEventListener(ALERTS_UPDATED_EVENT, refresh);
    window.addEventListener(HEALTH_POLICY_UPDATED_EVENT, refresh);
    window.addEventListener(ALERTS_POLICY_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(ALERTS_UPDATED_EVENT, refresh);
      window.removeEventListener(HEALTH_POLICY_UPDATED_EVENT, refresh);
      window.removeEventListener(ALERTS_POLICY_UPDATED_EVENT, refresh);
    };
  }, []);

  const hasCritical = summary.critical > 0;
  const destination = hasCritical ? '/alerts?severity=critical' : '/alerts';
  const label = hasCritical
    ? `Inbox — ${summary.critical} critical, ${summary.total} open`
    : summary.total > 0
      ? `Inbox — ${summary.total} open alert(s)`
      : 'Inbox — no open alerts';

  return (
    <button
      className={`header-inbox${hasCritical ? ' header-inbox-critical' : ''}${summary.total === 0 ? ' header-inbox-empty' : ''}`}
      onClick={() => navigate(destination)}
      aria-label={label}
      title={label}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
      {summary.total > 0 && (
        <span className={`header-inbox-badge${hasCritical ? ' header-inbox-badge-critical' : ''}`}>
          {summary.total}
        </span>
      )}
    </button>
  );
}
