import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import plugins from '../data/plugins';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../contexts/ToastContext';
import { getCompareShortlist, setCompareShortlist } from '../utils/compareShortlist';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const selectedSlugs = useMemo(() => {
    const ids = searchParams.get('plugins');
    if (ids) return ids.split(',').filter(Boolean);
    return getCompareShortlist();
  }, [searchParams]);

  const selected = useMemo(() =>
    selectedSlugs.map(s => plugins.find(p => p.slug === s)).filter(Boolean),
  [selectedSlugs]);

  const available = useMemo(() =>
    plugins.filter(p => !selectedSlugs.includes(p.slug)),
  [selectedSlugs]);

  const applySelection = (slugs) => {
    const next = [...new Set(slugs)].slice(0, 4);
    setCompareShortlist(next);
    setSearchParams(next.length ? { plugins: next.join(',') } : {}, { replace: true });
  };

  const togglePlugin = (slug) => {
    const next = selectedSlugs.includes(slug)
      ? selectedSlugs.filter(s => s !== slug)
      : [...selectedSlugs, slug].slice(0, 4);
    applySelection(next);
  };

  const clearAll = () => applySelection([]);

  const copyCompareLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Compare link copied');
    } catch {
      toast.error('Failed to copy compare link');
    }
  };

  const allFeatures = useMemo(() => {
    const set = new Set();
    selected.forEach(p => p.features.forEach(f => set.add(f)));
    return [...set].sort();
  }, [selected]);

  return (
    <div className="page">
      <Breadcrumb current="Compare Plugins" />
      <div className="page-header page-header-row">
        <div>
          <h1>⚖️ Plugin Comparison</h1>
          <p>Select up to 4 plugins to compare side by side</p>
        </div>
        <div className="compare-actions">
          <button className="btn-secondary" onClick={copyCompareLink} disabled={selected.length === 0}>Copy Link</button>
          <button className="btn-secondary" onClick={clearAll} disabled={selected.length === 0}>Clear</button>
        </div>
      </div>

      <div className="compare-selector">
        <div className="compare-selected">
          {selected.length === 0 && (
            <span className="compare-hint">Choose plugins from the list below</span>
          )}
          {selected.map(p => (
            <button key={p.slug} className="compare-chip" onClick={() => togglePlugin(p.slug)}>
              {p.icon} {p.name} <span className="compare-chip-x">×</span>
            </button>
          ))}
        </div>
        <details className="compare-dropdown">
          <summary className="btn-secondary">+ Add Plugin</summary>
          <div className="compare-dropdown-list">
            {available.map(p => (
              <button
                key={p.slug}
                className="compare-dropdown-item"
                onClick={() => togglePlugin(p.slug)}
                disabled={selectedSlugs.length >= 4}
              >
                {p.icon} {p.name}
                <span className="compare-dropdown-cat">{p.category}</span>
              </button>
            ))}
          </div>
        </details>
      </div>

      {selected.length >= 2 ? (
        <div className="compare-table-wrap">
          <table className="data-table compare-table">
            <thead>
              <tr>
                <th>Attribute</th>
                {selected.map(p => (
                  <th key={p.slug}>
                    <Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="compare-label">Category</td>
                {selected.map(p => <td key={p.slug}><span className="badge">{p.category}</span></td>)}
              </tr>
              <tr>
                <td className="compare-label">Version</td>
                {selected.map(p => <td key={p.slug}><code>{p.version}</code></td>)}
              </tr>
              <tr>
                <td className="compare-label">Pricing</td>
                {selected.map(p => <td key={p.slug}><span className="badge badge-pricing">{p.pricing}</span></td>)}
              </tr>
              {allFeatures.map(f => (
                <tr key={f}>
                  <td className="compare-label">{f}</td>
                  {selected.map(p => (
                    <td key={p.slug} className={`compare-check ${p.features.includes(f) ? 'yes' : 'no'}`}>
                      {p.features.includes(f) ? '✅' : '—'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="compare-label">Tags</td>
                {selected.map(p => (
                  <td key={p.slug}>
                    {p.tags.map(t => <span key={t} className="badge" style={{marginRight: 4}}>{t}</span>)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : selected.length === 1 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚖️</div>
          <h3>Select one more plugin</h3>
          <p>You need at least 2 plugins to compare.</p>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">⚖️</div>
          <h3>No plugins selected</h3>
          <p>Add plugins above to see a side-by-side comparison of features, tags, and metadata.</p>
        </div>
      )}
    </div>
  );
}

