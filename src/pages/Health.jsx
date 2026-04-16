import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import { compareVersions } from '../utils/versioning';
import { getHealthThreshold, persistHealthThreshold } from '../utils/healthPolicy';
import { generatePortfolioUptime, isUptimeDegraded } from '../utils/uptime';

function UptimeBar({ days, pct, threshold }) {
  return (
    <div className="uptime-wrap" title={`${pct}% uptime (30 days)`}>
      <div className="uptime-bar">
        {days.map((d, i) => (
          <span key={i} className={`uptime-day${d ? ' up' : ' down'}`} />
        ))}
      </div>
      <span className={`uptime-pct${parseFloat(pct) < threshold ? ' warn' : ''}`}>{pct}%</span>
    </div>
  );
}

export default function Health() {
  const toast = useToast();
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({ name: '', version: '' });
  const [showDegradedOnly, setShowDegradedOnly] = useState(false);
  const [healthThreshold, setHealthThreshold] = useState(() => getHealthThreshold());

  const uptimeData = useMemo(() => {
    return generatePortfolioUptime(plugins);
  }, []);

  const avgUptime = useMemo(() => {
    const vals = Object.values(uptimeData).map(u => parseFloat(u.pct));
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [uptimeData]);

  const degradedCount = useMemo(() =>
    plugins.filter(p => isUptimeDegraded(uptimeData[p.slug].pct, healthThreshold)).length,
  [uptimeData, healthThreshold]);

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const fn = filters.name.toLowerCase();
      const fv = filters.version.toLowerCase();
      const isDegraded = isUptimeDegraded(uptimeData[p.slug].pct, healthThreshold);
      return (!fn || p.name.toLowerCase().includes(fn)) &&
             (!fv || p.version.toLowerCase().includes(fv)) &&
             (!showDegradedOnly || isDegraded);
    });
  }, [filters, showDegradedOnly, uptimeData, healthThreshold]);

  const sorted = useMemo(() => {
    const list = [...filtered].sort((a, b) => {
      if (sortKey === 'version') return compareVersions(a.version, b.version);
      if (sortKey === 'uptime') return parseFloat(uptimeData[a.slug].pct) - parseFloat(uptimeData[b.slug].pct);
      return a.name.localeCompare(b.name);
    });
    return sortDir === 'desc' ? list.reverse() : list;
  }, [filtered, sortKey, sortDir, uptimeData]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIcon = (key) => {
    if (sortKey !== key) return ' ↕';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  };

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const hasFilters = showDegradedOnly || Object.values(filters).some(v => v);
  const clearFilters = () => {
    setFilters({ name: '', version: '' });
    setShowDegradedOnly(false);
  };

  const updateThreshold = (rawValue) => {
    const next = persistHealthThreshold(rawValue);
    setHealthThreshold(next);
  };

  const copyVersion = async (version) => {
    try {
      await navigator.clipboard.writeText(version);
      toast.success(`Copied ${version}`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const copyDegradedReport = async () => {
    const degraded = sorted
      .filter(p => isUptimeDegraded(uptimeData[p.slug].pct, healthThreshold))
      .map(p => `${p.name} (v${p.version}) — ${uptimeData[p.slug].pct}%`);
    if (degraded.length === 0) {
      toast.info('No degraded plugins for current threshold');
      return;
    }
    const report = [
      `Health threshold: ${healthThreshold.toFixed(1)}%`,
      `Generated: ${new Date().toISOString()}`,
      '',
      ...degraded,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(report);
      toast.success(`Copied degraded report (${degraded.length})`);
    } catch {
      toast.error('Failed to copy degraded report');
    }
  };

  return (
    <div className="page">
      <Breadcrumb current="System Health" />
      <div className="page-header">
        <h1>💚 System Health</h1>
        <p>Marketplace status and plugin health overview</p>
      </div>

        <div className="stats-grid">
          <div className="stat-card stat-green">
            <div className="stat-label">Plugins Published</div>
            <div className="stat-value">{plugins.length}</div>
          </div>
        <div className="stat-card stat-green">
          <div className="stat-label">Marketplace Status</div>
          <div className="stat-value">Online</div>
        </div>
          <div className="stat-card">
            <div className="stat-label">Healthy @{healthThreshold.toFixed(1)}%</div>
            <div className="stat-value">{plugins.length - degradedCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Avg Uptime (30d)</div>
            <div className="stat-value">{avgUptime}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Degraded</div>
            <div className="stat-value">{degradedCount}</div>
          </div>
        </div>

      <div className="section">
        <div className="section-header">
          <h2>Plugin Compatibility &amp; Uptime</h2>
          <div>
            {hasFilters && (
              <span className="table-filter-status">
                {sorted.length}/{plugins.length}
                <button className="filter-clear" onClick={clearFilters}>Clear</button>
              </span>
            )}
            <span className="uptime-disclaimer">⚠️ Simulated uptime data for illustration</span>
          </div>
        </div>
        <div className="health-controls">
          <label className="health-threshold-control">
            <span>SLO threshold: <strong>{healthThreshold.toFixed(1)}%</strong></span>
            <input
              type="range"
              min="95"
              max="100"
              step="0.1"
              value={healthThreshold}
              onChange={e => updateThreshold(Number(e.target.value))}
            />
          </label>
          <label className="favorites-toggle">
            <input
              type="checkbox"
              checked={showDegradedOnly}
              onChange={e => setShowDegradedOnly(e.target.checked)}
            />
            <span>Only degraded</span>
          </label>
          <button className="btn-secondary" onClick={copyDegradedReport}>Copy degraded report</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Plugin{sortIcon('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('version')}>Version{sortIcon('version')}</th>
              <th className="sortable-th" onClick={() => handleSort('uptime')}>30-Day Uptime{sortIcon('uptime')}</th>
              <th>Status</th>
            </tr>
            <tr className="filter-row">
              <td><input type="text" className="column-filter" placeholder="Filter name…" value={filters.name} onChange={e => updateFilter('name', e.target.value)} /></td>
              <td><input type="text" className="column-filter" placeholder="Filter version…" value={filters.version} onChange={e => updateFilter('version', e.target.value)} /></td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => {
              const ut = uptimeData[p.slug];
              const isDegraded = isUptimeDegraded(ut.pct, healthThreshold);
              return (
                <tr key={p.slug}>
                  <td><Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link></td>
                  <td>
                    <code className="copyable" onClick={() => copyVersion(p.version)} title="Click to copy">
                      {p.version}
                    </code>
                  </td>
                  <td><UptimeBar days={ut.days} pct={ut.pct} threshold={healthThreshold} /></td>
                  <td><span className={`status-badge ${isDegraded ? 'status-warn' : 'status-active'}`}>
                    {isDegraded ? 'Degraded' : 'Healthy'}
                  </span></td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr><td colSpan="4" className="table-empty">No plugins match the current filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
