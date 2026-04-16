import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';

const comparators = {
  name: (a, b) => a.name.localeCompare(b.name),
  version: (a, b) => a.version.localeCompare(b.version),
};

export default function Health() {
  const toast = useToast();
  const freemiumCount = plugins.filter(p => p.pricing === 'freemium').length;
  const paidCount = plugins.length - freemiumCount;
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

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
          <div className="stat-label">Freemium / Paid</div>
          <div className="stat-value">{freemiumCount} / {paidCount}</div>
        </div>
      </div>

      <div className="section">
        <h2>Plugin Compatibility Matrix</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable-th" onClick={() => handleSort('name')}>Plugin{sortIcon('name')}</th>
              <th className="sortable-th" onClick={() => handleSort('version')}>Version{sortIcon('version')}</th>
              <th>IntelliJ 2026.1</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => (
              <tr key={p.slug}>
                <td><Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link></td>
                <td>
                  <code className="copyable" onClick={() => copyVersion(p.version)} title="Click to copy">
                    {p.version}
                  </code>
                </td>
                <td>✅ Compatible</td>
                <td><span className="status-badge status-active">Healthy</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
