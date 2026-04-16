import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';

const comparators = {
  name: (a, b) => a.name.localeCompare(b.name),
  version: (a, b) => a.version.localeCompare(b.version),
  category: (a, b) => a.category.localeCompare(b.category),
};

export default function Releases() {
  const toast = useToast();
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

  const exportCSV = () => {
    const header = 'Plugin Name,Version,Category,Marketplace URL';
    const rows = sorted.map(p =>
      `"${p.name}","${p.version}","${p.category}","https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plugin-releases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>📦 Releases</h1>
            <p>Latest plugin versions and release history</p>
          </div>
          <button className="btn-secondary" onClick={exportCSV}>⬇ Export CSV</button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th className="sortable-th" onClick={() => handleSort('name')}>Plugin{sortIcon('name')}</th>
            <th className="sortable-th" onClick={() => handleSort('version')}>Version{sortIcon('version')}</th>
            <th className="sortable-th" onClick={() => handleSort('category')}>Category{sortIcon('category')}</th>
            <th>Marketplace</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p.slug}>
              <td>{p.icon}</td>
              <td><Link to={`/plugin/${p.slug}`}>{p.name}</Link></td>
              <td>
                <code className="copyable" onClick={() => copyVersion(p.version)} title="Click to copy">
                  {p.version}
                </code>
              </td>
              <td>{p.category}</td>
              <td>
                <a href={`https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}`} target="_blank" rel="noopener noreferrer">
                  View <span className="external-icon" aria-hidden="true">↗</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
