import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins, { categories } from '../data/plugins';
import { getTagCloud } from '../utils/tags';
import { getRecentViewed } from '../utils/recentViewed';
import { getCompareShortlist } from '../utils/compareShortlist';
import { useFavorites } from '../contexts/FavoritesContext';
import { compareVersions } from '../utils/versioning';
import { getHealthThreshold } from '../utils/healthPolicy';
import { getAlertPolicy } from '../utils/alertsPolicy';
import { getDismissedAlerts, getPortfolioAlerts, summarizeAlerts } from '../utils/alerts';

const categoryIcons = {
  'API': '⚡', 'Architecture': '🏗️', 'DevOps': '☸️', 'Documentation': '📄',
  'Git': '🔀', 'GPU': '🎮', 'Performance': '⏱️', 'Productivity': '✨',
  'Quality': '✅', 'Security': '🔒', 'Testing': '🧪',
};

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const segments = useMemo(() => {
    return data.map((d, index) => {
      const pct = total > 0 ? d.count / total : 0;
      const dash = circumference * pct;
      const offset = data.slice(0, index).reduce((sum, prev) => {
        const prevPct = total > 0 ? prev.count / total : 0;
        return sum + (circumference * prevPct);
      }, 0);
      return { ...d, dash, gap: circumference - dash, offset };
    });
  }, [data, total, circumference]);
  return (
    <svg viewBox="0 0 100 100" className="donut-chart" aria-hidden="true">
      {segments.map(d => (
          <circle
            key={d.label}
            cx="50" cy="50" r={radius}
            fill="none" stroke={d.color} strokeWidth="10"
            strokeDasharray={`${d.dash} ${d.gap}`}
            strokeDashoffset={-d.offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
      ))}
      <text x="50" y="48" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">{total}</text>
      <text x="50" y="60" textAnchor="middle" fill="var(--text-secondary)" fontSize="7">plugins</text>
    </svg>
  );
}

export default function Home() {
  const { favorites } = useFavorites();
  const freemiumCount = plugins.filter(p => p.pricing === 'freemium').length;
  const paidCount = plugins.length - freemiumCount;
  const freemiumPct = Math.round((freemiumCount / plugins.length) * 100);

  const categoryData = useMemo(() => {
    const colors = ['var(--accent)', 'var(--blue)', 'var(--green)', 'var(--orange)', 'var(--cyan)', 'var(--red)', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];
    return categories.map((cat, i) => ({
      label: cat,
      count: plugins.filter(p => p.category === cat).length,
      color: colors[i % colors.length],
    }));
  }, []);

  const mostFeatured = useMemo(() =>
    [...plugins].sort((a, b) => b.features.length - a.features.length)[0],
  []);

  const newest = useMemo(() =>
    [...plugins].sort((a, b) => compareVersions(b.version, a.version))[0],
  []);

  const recentlyUpdated = useMemo(() =>
    [...plugins].sort((a, b) => compareVersions(b.version, a.version)).slice(0, 8),
  []);

  const tagCloud = useMemo(() => getTagCloud(), []);
  const recentlyViewed = useMemo(() => {
    const slugs = getRecentViewed();
    return slugs.map(slug => plugins.find(p => p.slug === slug)).filter(Boolean).slice(0, 6);
  }, []);
  const favoritePlugins = useMemo(() => {
    return favorites.map(slug => plugins.find(p => p.slug === slug)).filter(Boolean).slice(0, 6);
  }, [favorites]);
  const compareShortlist = useMemo(() => {
    return getCompareShortlist().map(slug => plugins.find(p => p.slug === slug)).filter(Boolean).slice(0, 4);
  }, []);
  const healthThreshold = useMemo(() => getHealthThreshold(), []);
  const alertPolicy = useMemo(() => getAlertPolicy(), []);
  const alertSummary = useMemo(() => {
    const allAlerts = getPortfolioAlerts(plugins, healthThreshold, undefined, alertPolicy);
    return summarizeAlerts(allAlerts, getDismissedAlerts());
  }, [healthThreshold, alertPolicy]);

  return (
    <div className="page">
      <div className="hero">
        <h1>JetBrains Plugin Suite</h1>
        <p>Central hub for {plugins.length} plugins across {categories.length} categories — from GPU acceleration to security scanning.</p>
        <div className="home-hero-actions">
          <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
          <Link to="/docs" className="btn-secondary">Read Docs</Link>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card analytics-donut">
          <h3>Category Distribution</h3>
          <DonutChart data={categoryData} />
          <div className="donut-legend">
            {categoryData.slice(0, 6).map(d => (
              <span key={d.label} className="donut-legend-item">
                <span className="donut-dot" style={{ background: d.color }} />
                {d.label} ({d.count})
              </span>
            ))}
            {categoryData.length > 6 && <span className="donut-legend-item">+{categoryData.length - 6} more</span>}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Pricing Split</h3>
          <div className="pricing-bar-wrap">
            <div className="pricing-bar">
              <div className="pricing-bar-fill" style={{ width: `${freemiumPct}%` }} />
            </div>
            <div className="pricing-labels">
              <span>Freemium <strong>{freemiumCount}</strong> ({freemiumPct}%)</span>
              <span>Paid <strong>{paidCount}</strong> ({100 - freemiumPct}%)</span>
            </div>
          </div>
          <div className="analytics-highlight-row">
            <div className="analytics-highlight">
              <span className="analytics-highlight-icon">🏆</span>
              <div>
                <div className="analytics-highlight-label">Most Features</div>
                <Link to={`/plugin/${mostFeatured.slug}`} className="analytics-highlight-value">{mostFeatured.name}</Link>
                <div className="analytics-highlight-meta">{mostFeatured.features.length} features</div>
              </div>
            </div>
            <div className="analytics-highlight">
              <span className="analytics-highlight-icon">🆕</span>
              <div>
                <div className="analytics-highlight-label">Latest Version</div>
                <Link to={`/plugin/${newest.slug}`} className="analytics-highlight-value">{newest.name}</Link>
                <div className="analytics-highlight-meta">v{newest.version}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Operations Pulse</h2>
          <Link to="/alerts" className="section-link">Open alerts →</Link>
        </div>
        <div className="stats-grid">
          <Link to="/alerts?status=open" className="stat-card stat-card-link">
            <div className="stat-label">Open Alerts</div>
            <div className="stat-value">{alertSummary.total}</div>
          </Link>
          <Link to="/alerts?status=open&severity=critical" className="stat-card stat-card-link">
            <div className="stat-label">Critical Alerts</div>
            <div className="stat-value">{alertSummary.critical}</div>
          </Link>
          <Link to="/alerts?type=health-degraded" className="stat-card stat-card-link">
            <div className="stat-label">Degraded Uptime Alerts</div>
            <div className="stat-value">{alertSummary.healthDegraded}</div>
          </Link>
          <Link to="/alerts?type=release-stale" className="stat-card stat-card-link">
            <div className="stat-label">Stale Release Alerts</div>
            <div className="stat-value">{alertSummary.releaseStale}</div>
          </Link>
          <Link to="/alerts?status=open&severity=warning" className="stat-card stat-card-link">
            <div className="stat-label">Warning Alerts</div>
            <div className="stat-value">{alertSummary.warning}</div>
          </Link>
          <Link to="/settings" className="stat-card stat-card-link">
            <div className="stat-label">Health Threshold</div>
            <div className="stat-value">{healthThreshold.toFixed(1)}%</div>
          </Link>
        </div>
      </div>

      <div className="section">
        <h2>Categories</h2>
        <div className="category-grid">
          {categories.map(cat => {
            const count = plugins.filter(p => p.category === cat).length;
            return (
              <Link to={`/catalog?category=${encodeURIComponent(cat)}`} className="category-card" key={cat}>
                <span className="category-icon">{categoryIcons[cat] || '📦'}</span>
                <div>
                  <h3>{cat}</h3>
                  <p>{count} plugin{count !== 1 ? 's' : ''}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="section">
        <h2>Tags</h2>
        <div className="tag-cloud">
          {tagCloud.map(({ tag, count }) => (
            <Link
              key={tag}
              to={`/catalog?tag=${encodeURIComponent(tag)}`}
              className="tag-cloud-item"
              style={{ fontSize: `${Math.min(11 + count * 1.5, 18)}px` }}
            >
              {tag} <span className="tag-count">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Quick Workbench</h2>
          <Link
            to={compareShortlist.length ? `/compare?plugins=${compareShortlist.map(p => p.slug).join(',')}` : '/compare'}
            className="section-link"
          >
            Open compare →
          </Link>
        </div>
        <div className="related-grid">
          {compareShortlist.length > 0 ? compareShortlist.map(p => (
            <Link to={`/plugin/${p.slug}`} key={`cmp-${p.slug}`} className="related-card">
              <span className="related-icon">{p.icon}</span>
              <div>
                <div className="related-name">{p.name}</div>
                <div className="related-cat">Compare shortlist</div>
              </div>
            </Link>
          )) : (
            <div className="empty-state" style={{ width: '100%' }}>
              <h3>No compare shortlist yet</h3>
              <p>Add plugins to shortlist from Catalog or Plugin Detail.</p>
            </div>
          )}
          {favoritePlugins.length > 0 && favoritePlugins.map(p => (
            <Link to={`/plugin/${p.slug}`} key={`fav-${p.slug}`} className="related-card">
              <span className="related-icon">{p.icon}</span>
              <div>
                <div className="related-name">{p.name}</div>
                <div className="related-cat">Favorite</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="section">
          <div className="section-header">
            <h2>Recently Viewed</h2>
            <Link to="/catalog" className="section-link">Open catalog →</Link>
          </div>
          <div className="related-grid">
            {recentlyViewed.map(p => (
              <Link to={`/plugin/${p.slug}`} key={p.slug} className="related-card">
                <span className="related-icon">{p.icon}</span>
                <div>
                  <div className="related-name">{p.name}</div>
                  <div className="related-cat">{p.category} · v{p.version}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>Recently Updated</h2>
          <Link to="/releases" className="section-link">View all →</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Plugin</th>
              <th>Category</th>
              <th>Version</th>
            </tr>
          </thead>
          <tbody>
            {recentlyUpdated.map(p => (
              <tr key={p.slug}>
                <td><Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link></td>
                <td><span className="badge">{p.category}</span></td>
                <td><code>{p.version}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
