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

  return (
    <div className="page">
      <div className="page-header">
        <h1>📦 Releases</h1>
        <p>Latest plugin versions and release history</p>
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
