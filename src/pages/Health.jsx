import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

const comparators = {
  name: (a, b) => a.name.localeCompare(b.name),
  version: (a, b) => a.version.localeCompare(b.version),
};

/** Seeded pseudo-random for stable uptime data */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateUptime(slug) {
  const seed = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);
  const days = [];
  for (let i = 0; i < 30; i++) {
    days.push(rng() > 0.015 ? 1 : 0);
  }
  const pct = (days.filter(d => d === 1).length / 30 * 100).toFixed(1);
  return { days, pct };
}

function UptimeBar({ days, pct }) {
  return (
    <div className="uptime-wrap" title={`${pct}% uptime (30 days)`}>
      <div className="uptime-bar">
        {days.map((d, i) => (
          <span key={i} className={`uptime-day${d ? ' up' : ' down'}`} />
        ))}
      </div>
      <span className={`uptime-pct${parseFloat(pct) < 99 ? ' warn' : ''}`}>{pct}%</span>
    </div>
  );
}

export default function Health() {
  const toast = useToast();
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({ name: '', version: '' });

  const uptimeData = useMemo(() => {
    const map = {};
    plugins.forEach(p => { map[p.slug] = generateUptime(p.slug); });
    return map;
  }, []);

  const avgUptime = useMemo(() => {
    const vals = Object.values(uptimeData).map(u => parseFloat(u.pct));
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [uptimeData]);

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const fn = filters.name.toLowerCase();
      const fv = filters.version.toLowerCase();
      return (!fn || p.name.toLowerCase().includes(fn)) &&
             (!fv || p.version.toLowerCase().includes(fv));
    });
  }, [filters]);

  const sorted = useMemo(() => {
    const cmp = comparators[sortKey] || comparators.name;
    const list = [...filtered].sort(cmp);
    return sortDir === 'desc' ? list.reverse() : list;
  }, [filtered, sortKey, sortDir]);

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
  const hasFilters = Object.values(filters).some(v => v);
  const clearFilters = () => setFilters({ name: '', version: '' });

  const copyVersion = (version) => {
    navigator.clipboard.writeText(version).then(() => {
      toast.success(`Copied ${version}`);
    }).catch(() => {
      toast.error('Failed to copy');
    });
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
          <div className="stat-label">IDE Compatibility</div>
          <div className="stat-value">2026.1+</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Uptime (30d)</div>
          <div className="stat-value">{avgUptime}%</div>
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
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Plugin{sortIcon('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('version')}>Version{sortIcon('version')}</th>
              <th>30-Day Uptime</th>
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
              return (
                <tr key={p.slug}>
                  <td><Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link></td>
                  <td>
                    <code className="copyable" onClick={() => copyVersion(p.version)} title="Click to copy">
                      {p.version}
                    </code>
                  </td>
                  <td><UptimeBar days={ut.days} pct={ut.pct} /></td>
                  <td><span className={`status-badge ${parseFloat(ut.pct) >= 99 ? 'status-active' : 'status-warn'}`}>
                    {parseFloat(ut.pct) >= 99 ? 'Healthy' : 'Degraded'}
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
