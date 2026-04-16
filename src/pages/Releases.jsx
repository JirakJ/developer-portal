import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import { compareVersions, getReleaseFreshness } from '../utils/versioning';

const comparators = {
  name: (a, b) => a.name.localeCompare(b.name),
  version: (a, b) => compareVersions(a.version, b.version),
  category: (a, b) => a.category.localeCompare(b.category),
};

const FRESHNESS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'aging', label: 'Aging' },
  { value: 'stale', label: 'Stale' },
];

export default function Releases() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [filters, setFilters] = useState({ name: '', version: '', category: '' });
  const [freshness, setFreshness] = useState(() => {
    const filter = searchParams.get('freshness');
    return FRESHNESS_OPTIONS.some(option => option.value === filter) ? filter : 'all';
  });

  const freshnessMeta = useMemo(() => {
    const map = {};
    plugins.forEach(p => {
      map[p.slug] = getReleaseFreshness(p.version);
    });
    return map;
  }, []);

  const freshnessCounts = useMemo(() => {
    const counts = { all: plugins.length, fresh: 0, aging: 0, stale: 0 };
    plugins.forEach(p => {
      const key = freshnessMeta[p.slug]?.key;
      if (key === 'fresh' || key === 'aging' || key === 'stale') counts[key] += 1;
    });
    return counts;
  }, [freshnessMeta]);

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const fn = filters.name.toLowerCase();
      const fv = filters.version.toLowerCase();
      const fc = filters.category.toLowerCase();
      const meta = freshnessMeta[p.slug];
      const matchFreshness = freshness === 'all' || meta?.key === freshness;
      return (!fn || p.name.toLowerCase().includes(fn)) &&
             (!fv || p.version.toLowerCase().includes(fv)) &&
             (!fc || p.category.toLowerCase().includes(fc)) &&
             matchFreshness;
    });
  }, [filters, freshness, freshnessMeta]);

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
  const hasFilters = freshness !== 'all' || Object.values(filters).some(v => v);
  const clearFilters = () => {
    setFilters({ name: '', version: '', category: '' });
    updateFreshness('all');
  };

  const updateFreshness = (value) => {
    setFreshness(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete('freshness');
    else next.set('freshness', value);
    setSearchParams(next, { replace: true });
  };

  const copyVersion = async (version) => {
    try {
      await navigator.clipboard.writeText(version);
      toast.success(`Copied ${version}`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const buildExportData = () => sorted.map(p => ({
    name: p.name,
    version: p.version,
    category: p.category,
    freshness: freshnessMeta[p.slug]?.label || 'Unknown',
    ageMonths: freshnessMeta[p.slug]?.ageMonths,
    marketplace: `https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}`,
  }));

  const exportCSV = () => {
    const data = buildExportData();
    const header = 'Plugin Name,Version,Category,Freshness,Age (months),Marketplace URL';
    const rows = data.map(d => `"${d.name}","${d.version}","${d.category}","${d.freshness}","${d.ageMonths ?? ''}","${d.marketplace}"`);
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
              <p>Version inventory with release freshness intelligence</p>
            </div>
            <div className="export-btn-group">
              <button className="btn-secondary" onClick={exportCSV}>⬇ CSV</button>
              <button className="btn-secondary" onClick={exportJSON}>⬇ JSON</button>
            </div>
          </div>
          <div className="release-freshness-filters" role="group" aria-label="Filter releases by freshness">
            {FRESHNESS_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`release-freshness-chip${freshness === option.value ? ' active' : ''}`}
                onClick={() => updateFreshness(option.value)}
              >
                {option.label} ({freshnessCounts[option.value] ?? 0})
              </button>
            ))}
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
              <th>Freshness</th>
              <th>Marketplace</th>
            </tr>
            <tr className="filter-row">
              <td></td>
              <td><input type="text" className="column-filter" placeholder="Filter name…" value={filters.name} onChange={e => updateFilter('name', e.target.value)} /></td>
              <td><input type="text" className="column-filter" placeholder="Filter version…" value={filters.version} onChange={e => updateFilter('version', e.target.value)} /></td>
              <td><input type="text" className="column-filter" placeholder="Filter category…" value={filters.category} onChange={e => updateFilter('category', e.target.value)} /></td>
              <td></td>
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
                  <span className={`status-badge release-freshness-badge freshness-${freshnessMeta[p.slug]?.key || 'unknown'}`}>
                    {freshnessMeta[p.slug]?.label || 'Unknown'}
                  </span>
                  <span className="release-age">
                    {freshnessMeta[p.slug]?.ageMonths == null ? '—' : `${freshnessMeta[p.slug].ageMonths} mo`}
                  </span>
                </td>
                <td>
                  <a href={`https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}`} target="_blank" rel="noopener noreferrer">
                    View <span className="external-icon" aria-hidden="true">↗</span>
                  </a>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan="6" className="table-empty">No plugins match the current filters</td></tr>
            )}
          </tbody>
        </table>
    </div>
  );
}
