import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import plugins from '../data/plugins';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../contexts/ToastContext';
import { getHealthThreshold } from '../utils/healthPolicy';
import { getAlertPolicy } from '../utils/alertsPolicy';
import { generatePortfolioUptime } from '../utils/uptime';
import {
  getDismissedAlerts,
  getPortfolioAlerts,
  getOpenAlerts,
  summarizeAlerts,
  dismissAlert,
  restoreAlert,
  clearDismissedAlerts,
} from '../utils/alerts';

const SEVERITY_OPTIONS = ['all', 'critical', 'warning'];
const STATUS_OPTIONS = ['open', 'dismissed', 'all'];
const TYPE_OPTIONS = ['all', 'release-stale', 'health-degraded'];

function readFilters(searchParams) {
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  return {
    severity: SEVERITY_OPTIONS.includes(severity) ? severity : 'all',
    status: STATUS_OPTIONS.includes(status) ? status : 'open',
    type: TYPE_OPTIONS.includes(type) ? type : 'all',
  };
}

export default function Alerts() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dismissed, setDismissed] = useState(() => getDismissedAlerts());
  const threshold = useMemo(() => getHealthThreshold(), []);
  const policy = useMemo(() => getAlertPolicy(), []);
  const { severity, status, type } = readFilters(searchParams);

  const uptimeData = useMemo(() => generatePortfolioUptime(plugins), []);
  const allAlerts = useMemo(
    () => getPortfolioAlerts(plugins, threshold, uptimeData, policy),
    [threshold, uptimeData, policy]
  );
  const openAlerts = useMemo(
    () => getOpenAlerts(allAlerts, dismissed),
    [allAlerts, dismissed]
  );

  const openById = useMemo(() => {
    const map = {};
    openAlerts.forEach(alert => {
      map[alert.id] = true;
    });
    return map;
  }, [openAlerts]);

  const dismissedAlerts = useMemo(
    () => allAlerts.filter(alert => !openById[alert.id]),
    [allAlerts, openById]
  );

  const summary = useMemo(
    () => summarizeAlerts(allAlerts, dismissed),
    [allAlerts, dismissed]
  );

  const severityCounts = useMemo(() => {
    const counts = { all: openAlerts.length, critical: 0, warning: 0 };
    openAlerts.forEach(alert => {
      if (alert.severity === 'critical') counts.critical += 1;
      if (alert.severity === 'warning') counts.warning += 1;
    });
    return counts;
  }, [openAlerts]);

  const typeCounts = useMemo(() => {
    const counts = { all: openAlerts.length, 'release-stale': 0, 'health-degraded': 0 };
    openAlerts.forEach(alert => {
      if (alert.type === 'release-stale') counts['release-stale'] += 1;
      if (alert.type === 'health-degraded') counts['health-degraded'] += 1;
    });
    return counts;
  }, [openAlerts]);

  const visibleAlerts = useMemo(() => {
    const base = status === 'open'
      ? openAlerts
      : (status === 'dismissed' ? dismissedAlerts : allAlerts);
    return base.filter(alert =>
      (severity === 'all' || alert.severity === severity) &&
      (type === 'all' || alert.type === type)
    );
  }, [status, severity, type, openAlerts, dismissedAlerts, allAlerts]);

  const visibleOpenAlerts = useMemo(
    () => visibleAlerts.filter(alert => Boolean(openById[alert.id])),
    [visibleAlerts, openById]
  );

  const visibleDismissedAlerts = useMemo(
    () => visibleAlerts.filter(alert => !openById[alert.id]),
    [visibleAlerts, openById]
  );

  const updateFilters = (next) => {
    const merged = { severity, status, type, ...next };
    const params = new URLSearchParams();
    if (merged.severity !== 'all') params.set('severity', merged.severity);
    if (merged.status !== 'open') params.set('status', merged.status);
    if (merged.type !== 'all') params.set('type', merged.type);
    setSearchParams(params, { replace: true });
  };

  const handleDismiss = (alert) => {
    setDismissed(prev => dismissAlert(alert, prev));
    toast.success('Alert dismissed');
  };

  const handleRestore = (alertId) => {
    setDismissed(prev => restoreAlert(alertId, prev));
    toast.success('Alert restored');
  };

  const handleClearDismissed = () => {
    setDismissed(clearDismissedAlerts());
    toast.success('Dismissed alerts cleared');
  };

  const handleDismissVisible = () => {
    if (visibleOpenAlerts.length === 0) {
      toast.info('No open alerts in current view');
      return;
    }
    setDismissed(prev => {
      let next = prev;
      visibleOpenAlerts.forEach(alert => {
        next = dismissAlert(alert, next);
      });
      return next;
    });
    toast.success(`Dismissed ${visibleOpenAlerts.length} alert(s)`);
  };

  const handleRestoreVisible = () => {
    if (visibleDismissedAlerts.length === 0) {
      toast.info('No dismissed alerts in current view');
      return;
    }
    setDismissed(prev => {
      let next = prev;
      visibleDismissedAlerts.forEach(alert => {
        next = restoreAlert(alert.id, next);
      });
      return next;
    });
    toast.success(`Restored ${visibleDismissedAlerts.length} alert(s)`);
  };

  const exportVisibleJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      filters: { severity, status, type },
      threshold,
      policy,
      alerts: visibleAlerts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alerts-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${visibleAlerts.length} alert(s)`);
  };

  const copyDigest = async () => {
    const source = status === 'dismissed'
      ? visibleDismissedAlerts
      : (status === 'open' ? visibleOpenAlerts : visibleAlerts);
    if (source.length === 0) {
      toast.info('No alerts to copy');
      return;
    }
    const lines = [
      `Developer Portal Alerts Digest`,
      `Threshold: ${threshold.toFixed(1)}%`,
      `Generated: ${new Date().toISOString()}`,
      '',
      ...source.map(alert => `[${alert.severity.toUpperCase()}] ${alert.message}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast.success(`Copied ${source.length} alerts`);
    } catch {
      toast.error('Failed to copy digest');
    }
  };

  return (
    <div className="page">
      <Breadcrumb current="Alerts" />
      <div className="page-header page-header-row">
        <div>
          <h1>🚨 Alerts Center</h1>
          <p>Operational incidents from release lifecycle and uptime policy checks</p>
        </div>
        <div className="compare-actions">
          <button className="btn-secondary" onClick={copyDigest}>Copy digest</button>
          <button className="btn-secondary" onClick={exportVisibleJson}>Export JSON</button>
          <button className="btn-secondary" onClick={handleDismissVisible} disabled={visibleOpenAlerts.length === 0}>Dismiss visible</button>
          <button className="btn-secondary" onClick={handleRestoreVisible} disabled={visibleDismissedAlerts.length === 0}>Restore visible</button>
          <button className="btn-secondary" onClick={handleClearDismissed} disabled={dismissedAlerts.length === 0}>Clear dismissed</button>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="stat-card">
          <div className="stat-label">Open Alerts</div>
          <div className="stat-value">{openAlerts.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical</div>
          <div className="stat-value">{summary.critical}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Warning</div>
          <div className="stat-value">{summary.warning}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Release Alerts</div>
          <div className="stat-value">{summary.releaseStale}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Health Alerts</div>
          <div className="stat-value">{summary.healthDegraded}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Dismissed</div>
          <div className="stat-value">{dismissedAlerts.length}</div>
        </div>
      </div>

      <div className="alerts-policy-inline">
        <span>Policy:</span>
        <span>release ≥ {policy.releaseMinAgeMonths}mo</span>
        <span>critical release ≥ {policy.releaseCriticalAgeMonths}mo</span>
        <span>critical uptime delta ≥ {policy.healthCriticalDelta.toFixed(1)}%</span>
      </div>

      <div className="alerts-filters">
        <div className="release-freshness-filters">
          <button
            className={`release-freshness-chip${severity === 'all' ? ' active' : ''}`}
            onClick={() => updateFilters({ severity: 'all' })}
          >
            All severities ({severityCounts.all})
          </button>
          <button
            className={`release-freshness-chip${severity === 'critical' ? ' active' : ''}`}
            onClick={() => updateFilters({ severity: 'critical' })}
          >
            Critical ({severityCounts.critical})
          </button>
          <button
            className={`release-freshness-chip${severity === 'warning' ? ' active' : ''}`}
            onClick={() => updateFilters({ severity: 'warning' })}
          >
            Warning ({severityCounts.warning})
          </button>
        </div>
        <div className="release-freshness-filters">
          <button
            className={`release-freshness-chip${type === 'all' ? ' active' : ''}`}
            onClick={() => updateFilters({ type: 'all' })}
          >
            All types ({typeCounts.all})
          </button>
          <button
            className={`release-freshness-chip${type === 'release-stale' ? ' active' : ''}`}
            onClick={() => updateFilters({ type: 'release-stale' })}
          >
            Release ({typeCounts['release-stale']})
          </button>
          <button
            className={`release-freshness-chip${type === 'health-degraded' ? ' active' : ''}`}
            onClick={() => updateFilters({ type: 'health-degraded' })}
          >
            Health ({typeCounts['health-degraded']})
          </button>
        </div>
        <div className="release-freshness-filters">
          <button
            className={`release-freshness-chip${status === 'open' ? ' active' : ''}`}
            onClick={() => updateFilters({ status: 'open' })}
          >
            Open
          </button>
          <button
            className={`release-freshness-chip${status === 'dismissed' ? ' active' : ''}`}
            onClick={() => updateFilters({ status: 'dismissed' })}
          >
            Dismissed
          </button>
          <button
            className={`release-freshness-chip${status === 'all' ? ' active' : ''}`}
            onClick={() => updateFilters({ status: 'all' })}
          >
            All
          </button>
        </div>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>No alerts in this view</h3>
          <p>Adjust filters or health threshold to see current incidents.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Type</th>
              <th>Alert</th>
              <th>Plugin</th>
              <th>Action</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleAlerts.map(alert => {
              const isOpen = Boolean(openById[alert.id]);
              return (
                <tr key={alert.id}>
                  <td>
                    <span className={`status-badge alert-severity-${alert.severity}`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td><span className="alerts-type">{alert.type === 'release-stale' ? 'Release' : 'Health'}</span></td>
                  <td>{alert.message}</td>
                  <td>
                    <Link to={`/plugin/${alert.pluginSlug}`}>
                      {alert.pluginIcon} {alert.pluginName}
                    </Link>
                    <div className="alerts-meta">v{alert.version}</div>
                  </td>
                  <td>
                    <Link to={alert.actionPath} className="btn-secondary">{alert.actionLabel}</Link>
                  </td>
                  <td>
                    {isOpen ? (
                      <button className="btn-secondary" onClick={() => handleDismiss(alert)}>Dismiss</button>
                    ) : (
                      <button className="btn-secondary" onClick={() => handleRestore(alert.id)}>Restore</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
