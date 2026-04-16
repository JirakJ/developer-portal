import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { getHealthThreshold, HEALTH_POLICY_UPDATED_EVENT } from '../utils/healthPolicy';
import { getAlertPolicy, ALERTS_POLICY_UPDATED_EVENT } from '../utils/alertsPolicy';
import { generatePortfolioUptime } from '../utils/uptime';
import { ALERTS_UPDATED_EVENT, getDismissedAlerts, getPortfolioAlerts, summarizeAlerts } from '../utils/alerts';

export default function CriticalAlertsBanner() {
  const [, setRevision] = useState(0);
  const threshold = getHealthThreshold();
  const policy = getAlertPolicy();
  const alerts = getPortfolioAlerts(plugins, threshold, generatePortfolioUptime(plugins), policy);
  const summary = summarizeAlerts(alerts, getDismissedAlerts());

  useEffect(() => {
    const refresh = () => setRevision(prev => prev + 1);
    window.addEventListener(ALERTS_UPDATED_EVENT, refresh);
    window.addEventListener(HEALTH_POLICY_UPDATED_EVENT, refresh);
    window.addEventListener(ALERTS_POLICY_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(ALERTS_UPDATED_EVENT, refresh);
      window.removeEventListener(HEALTH_POLICY_UPDATED_EVENT, refresh);
      window.removeEventListener(ALERTS_POLICY_UPDATED_EVENT, refresh);
    };
  }, []);

  if (summary.critical === 0) return null;

  return (
    <div className="critical-alerts-banner" role="alert" aria-live="assertive">
      <span className="critical-alerts-banner-text">
        🚨 {summary.critical} critical alert(s) detected
        {summary.warning > 0 ? ` · ${summary.warning} warning alert(s)` : ''}
      </span>
      <Link to="/alerts?severity=critical" className="critical-alerts-banner-link">Review critical alerts</Link>
    </div>
  );
}
