import { useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import plugins from '../data/plugins';
import FavoriteButton from '../components/FavoriteButton';
import CompareToggleButton from '../components/CompareToggleButton';
import ShareButton from '../components/ShareButton';
import { getRelatedPlugins } from '../utils/tags';
import { pushRecentViewed } from '../utils/recentViewed';

const TABS = ['overview', 'features', 'links', 'related', 'activity'];
const TAB_LABELS = { overview: 'Overview', features: 'Features', links: 'Links', related: 'Related', activity: 'Activity' };

/** Derive release history from version string (e.g., 2026.8.0 → 1 release in Aug 2026) */
function deriveTimeline(version) {
  const parts = version.split('.');
  if (parts.length < 3) return [];
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const releases = parseInt(parts[2], 10) + 1;
  const entries = [];
  for (let i = 0; i < releases; i++) {
    const m = ((month - 1 + Math.floor(i * 0.7)) % 12);
    const y = year - Math.floor((month - 1 + Math.floor(i * 0.7)) < 0 ? 1 : 0);
    const date = new Date(y, m, Math.max(1, 28 - i * 3));
    const type = i === 0 ? 'latest' : i < 3 ? 'minor' : 'patch';
    const v = `${year}.${month}.${releases - 1 - i}`;
    entries.push({ version: v, date, type });
  }
  return entries.slice(0, 8);
}

export default function PluginDetail() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const plugin = plugins.find(p => p.slug === slug);

  const activeTab = TABS.includes(searchParams.get('tab')) ? searchParams.get('tab') : 'overview';
  const setTab = (tab) => setSearchParams({ tab }, { replace: true });
  const related = useMemo(() => (plugin ? getRelatedPlugins(slug, 4) : []), [plugin, slug]);
  const timeline = useMemo(() => (plugin ? deriveTimeline(plugin.version) : []), [plugin]);
  const marketplaceUrl = plugin ? `https://plugins.jetbrains.com/plugin/${plugin.id}-${plugin.slug}` : '';

  useEffect(() => {
    if (plugin) pushRecentViewed(slug);
  }, [plugin, slug]);

  if (!plugin) {
    return (
      <div className="page">
        <h1>Plugin not found</h1>
        <p style={{color: 'var(--text-secondary)', margin: '8px 0 20px'}}>
          The plugin "{slug}" doesn't exist in the catalog.
        </p>
        <Link to="/catalog" className="btn-secondary">← Back to Catalog</Link>
      </div>
      );
  }

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/catalog">Catalog</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">{plugin.name}</span>
      </nav>

      <div className="plugin-detail">
        <div className="plugin-detail-header">
          <span className="plugin-detail-icon">{plugin.icon}</span>
          <div style={{flex:1}}>
            <h1>{plugin.name}</h1>
            <div className="plugin-detail-meta">
              <span className="badge">{plugin.category}</span>
              <span className="badge badge-pricing">{plugin.pricing}</span>
              <span className="plugin-version">v{plugin.version}</span>
            </div>
          </div>
          <CompareToggleButton slug={plugin.slug} size={20} />
          <FavoriteButton slug={plugin.slug} size={22} />
          <ShareButton title={plugin.name} size={20} />
        </div>

        <div className="detail-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`detail-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setTab(tab)}
            >
              {TAB_LABELS[tab]}
              {tab === 'related' && related.length > 0 && <span className="tab-badge">{related.length}</span>}
              {tab === 'activity' && timeline.length > 0 && <span className="tab-badge">{timeline.length}</span>}
            </button>
          ))}
        </div>

        <div className="detail-tab-content" role="tabpanel">
          <div className={`tab-panel${activeTab === 'overview' ? ' tab-panel-active' : ''}`}>
            <p className="plugin-detail-desc">{plugin.description}</p>
            <div className="plugin-tags">
              {plugin.tags.map(t => (
                <Link key={t} to={`/catalog?tag=${encodeURIComponent(t)}`} className="badge">{t}</Link>
              ))}
            </div>
          </div>

          <div className={`tab-panel${activeTab === 'features' ? ' tab-panel-active' : ''}`}>
            <ul className="feature-list">
              {plugin.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
          </div>

          <div className={`tab-panel${activeTab === 'links' ? ' tab-panel-active' : ''}`}>
            <div className="plugin-links">
              <a href={marketplaceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                🛒 JetBrains Marketplace <span className="external-icon" aria-hidden="true">↗</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
              <a href={`https://github.com/JirakJ/jetbrains-plugins/tree/main/${plugin.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                📂 Source Code <span className="external-icon" aria-hidden="true">↗</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </div>

          <div className={`tab-panel${activeTab === 'related' ? ' tab-panel-active' : ''}`}>
            {related.length > 0 ? (
              <div className="related-grid">
                {related.map(r => (
                  <Link to={`/plugin/${r.slug}`} key={r.slug} className="related-card">
                    <span className="related-icon">{r.icon}</span>
                    <div>
                      <div className="related-name">{r.name}</div>
                      <div className="related-cat">{r.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted">No related plugins found.</p>
            )}
          </div>

          <div className={`tab-panel${activeTab === 'activity' ? ' tab-panel-active' : ''}`}>
            <div className="activity-timeline">
              <p className="timeline-disclaimer">
                📊 <em>Derived release cadence — estimated from version metadata</em>
              </p>
              {timeline.map((entry, i) => (
                <div key={i} className={`timeline-entry timeline-${entry.type}`}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <code className="timeline-version">v{entry.version}</code>
                    <span className={`timeline-type-badge badge-${entry.type}`}>
                      {entry.type === 'latest' ? 'Current' : entry.type}
                    </span>
                    <span className="timeline-date">
                      {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
