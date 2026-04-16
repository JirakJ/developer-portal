import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';

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
  const freemiumCount = plugins.filter(p => p.pricing === 'freemium').length;
  const paidCount = plugins.length - freemiumCount;
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const uptimeData = useMemo(() => {
    const map = {};
    plugins.forEach(p => { map[p.slug] = generateUptime(p.slug); });
    return map;
  }, []);

  const avgUptime = useMemo(() => {
    const vals = Object.values(uptimeData).map(u => parseFloat(u.pct));
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  }, [uptimeData]);

  const sorted = useMemo(() => {
    const cmp = comparators[sortKey] || comparators.name;
    const list = [...plugins].sort(cmp);
    return sortDir === 'desc' ? list.reverse() : list;
  }, [sortKey, sortDir]);

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

  const copyVersion = (version) => {
    navigator.clipboard.writeText(version).then(() => {
      toast.success(`Copied ${version}`);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  return (
    <div className="page">
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
          <span className="uptime-disclaimer">⚠️ Simulated uptime data for illustration</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Plugin{sortIcon('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('version')}>Version{sortIcon('version')}</th>
              <th>30-Day Uptime</th>
              <th>Status</th>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
