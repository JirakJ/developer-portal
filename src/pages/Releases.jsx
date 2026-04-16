import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

const comparators = {
  name: (a, b) => a.name.localeCompare(b.name),
  version: (a, b) => a.version.localeCompare(b.version),
  category: (a, b) => a.category.localeCompare(b.category),
};

export default function Releases() {
  const toast = useToast();
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({ name: '', version: '', category: '' });

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const fn = filters.name.toLowerCase();
      const fv = filters.version.toLowerCase();
      const fc = filters.category.toLowerCase();
      return (!fn || p.name.toLowerCase().includes(fn)) &&
             (!fv || p.version.toLowerCase().includes(fv)) &&
             (!fc || p.category.toLowerCase().includes(fc));
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
  const clearFilters = () => setFilters({ name: '', version: '', category: '' });

  const copyVersion = (version) => {
    navigator.clipboard.writeText(version).then(() => {
      toast.success(`Copied ${version}`);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const buildExportData = () => sorted.map(p => ({
    name: p.name,
    version: p.version,
    category: p.category,
    marketplace: `https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}`,
  }));

  const exportCSV = () => {
    const data = buildExportData();
    const header = 'Plugin Name,Version,Category,Marketplace URL';
    const rows = data.map(d => `"${d.name}","${d.version}","${d.category}","${d.marketplace}"`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plugin-releases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} plugins as CSV`);
  };

  const exportJSON = () => {
    const data = buildExportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plugin-releases-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${data.length} plugins as JSON`);
  };

  return (
    <div className="page">
      <Breadcrumb current="Releases" />
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>📦 Releases</h1>
            <p>Latest plugin versions and release history</p>
          </div>
          <div className="export-btn-group">
            <button className="btn-secondary" onClick={exportCSV}>⬇ CSV</button>
            <button className="btn-secondary" onClick={exportJSON}>⬇ JSON</button>
          </div>
        </div>
        {hasFilters && (
          <div className="table-filter-status">
            Showing {sorted.length} of {plugins.length} plugins
            <button className="filter-clear" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
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
          <tr className="filter-row">
            <td></td>
            <td><input type="text" className="column-filter" placeholder="Filter name…" value={filters.name} onChange={e => updateFilter('name', e.target.value)} /></td>
            <td><input type="text" className="column-filter" placeholder="Filter version…" value={filters.version} onChange={e => updateFilter('version', e.target.value)} /></td>
            <td><input type="text" className="column-filter" placeholder="Filter category…" value={filters.category} onChange={e => updateFilter('category', e.target.value)} /></td>
            <td></td>
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
          {sorted.length === 0 && (
            <tr><td colSpan="5" className="table-empty">No plugins match the current filters</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
