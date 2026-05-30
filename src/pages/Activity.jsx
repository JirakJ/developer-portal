import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { useToast } from '../contexts/ToastContext';
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_UPDATED_EVENT,
  clearActivityLog,
  getActivityLog,
  recordActivity,
  summarizeActivity,
} from '../utils/activityLog';

const CATEGORY_LABELS = {
  alert: 'Alerts',
  catalog: 'Catalog',
  compare: 'Compare',
  favorite: 'Favorites',
  pin: 'Pinned',
  policy: 'Policy',
  preferences: 'Preferences',
  general: 'General',
};

const CATEGORY_FILTERS = ['all', ...ACTIVITY_CATEGORIES, 'general'];

function formatTimestamp(iso) {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString();
  } catch {
    return iso;
  }
}

export default function Activity() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState(() => getActivityLog());

  useEffect(() => {
    const refresh = () => setEntries(getActivityLog());
    window.addEventListener(ACTIVITY_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refresh);
  }, []);

  const rawCategory = searchParams.get('category');
  const category = CATEGORY_FILTERS.includes(rawCategory) ? rawCategory : 'all';

  const summary = useMemo(() => summarizeActivity(entries), [entries]);

  const filtered = useMemo(() => (
    category === 'all' ? entries : entries.filter(e => e.category === category)
  ), [entries, category]);

  const updateCategory = (next) => {
    const params = new URLSearchParams();
    if (next !== 'all') params.set('category', next);
    setSearchParams(params, { replace: true });
  };

  const handleClear = () => {
    if (entries.length === 0) {
      toast.info('Activity log is already empty');
      return;
    }
    clearActivityLog();
    setEntries([]);
    toast.success('Activity log cleared');
  };

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.info('Nothing to export');
      return;
    }
    const payload = {
      exportedAt: new Date().toISOString(),
      filter: category,
      total: filtered.length,
      entries: filtered,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} entries`);
    recordActivity({
      category: 'preferences',
      message: `Exported ${filtered.length} activity entries`,
    });
  };

  const handleCopyDigest = async () => {
    if (filtered.length === 0) {
      toast.info('Nothing to copy');
      return;
    }
    const lines = [
      'Developer Portal Activity Digest',
      `Filter: ${category}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      ...filtered.map(e => `[${e.timestamp}] (${CATEGORY_LABELS[e.category] || e.category}) ${e.message}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast.success(`Copied ${filtered.length} entries`);
    } catch {
      toast.error('Failed to copy digest');
    }
  };

  return (
    <div className="page">
      <Breadcrumb current="Activity" />
      <div className="page-header page-header-row">
        <div>
          <h1>📜 Activity Log</h1>
          <p>Audit trail of portal actions (stored locally)</p>
        </div>
        <div className="compare-actions">
          <button className="btn-secondary" onClick={handleCopyDigest} disabled={filtered.length === 0}>Copy digest</button>
          <button className="btn-secondary" onClick={handleExport} disabled={filtered.length === 0}>Export JSON</button>
          <button className="btn-secondary" onClick={handleClear} disabled={entries.length === 0}>Clear all</button>
        </div>
      </div>

      <div className="alerts-summary">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{summary.total}</div>
        </div>
        {ACTIVITY_CATEGORIES.map(cat => (
          <div className="stat-card" key={cat}>
            <div className="stat-label">{CATEGORY_LABELS[cat] || cat}</div>
            <div className="stat-value">{summary[cat] || 0}</div>
          </div>
        ))}
      </div>

      <div className="alerts-filters">
        <div className="release-freshness-filters">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              className={`release-freshness-chip${category === cat ? ' active' : ''}`}
              onClick={() => updateCategory(cat)}
            >
              {cat === 'all' ? `All (${entries.length})` : `${CATEGORY_LABELS[cat] || cat} (${cat === 'general' ? (entries.filter(e => e.category === 'general').length) : (summary[cat] || 0)})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗒️</div>
          <h3>No activity yet</h3>
          <p>Actions like dismissing alerts, pinning plugins, or saving presets will show up here.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Category</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(entry => (
              <tr key={entry.id}>
                <td><code>{formatTimestamp(entry.timestamp)}</code></td>
                <td><span className="alerts-type">{CATEGORY_LABELS[entry.category] || entry.category}</span></td>
                <td>{entry.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
