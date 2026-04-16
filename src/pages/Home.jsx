import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins, { categories } from '../data/plugins';
import { getTagCloud } from '../utils/tags';

const categoryIcons = {
  'API': '⚡', 'Architecture': '🏗️', 'DevOps': '☸️', 'Documentation': '📄',
  'Git': '🔀', 'GPU': '🎮', 'Performance': '⏱️', 'Productivity': '✨',
  'Quality': '✅', 'Security': '🔒', 'Testing': '🧪',
};

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 100 100" className="donut-chart" aria-hidden="true">
      {data.map((d, i) => {
        const pct = d.count / total;
        const dash = circumference * pct;
        const gap = circumference - dash;
        const seg = (
          <circle
            key={d.label}
            cx="50" cy="50" r={radius}
            fill="none" stroke={d.color} strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        );
        offset += dash;
        return seg;
      })}
      <text x="50" y="48" textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="700">{total}</text>
      <text x="50" y="60" textAnchor="middle" fill="var(--text-secondary)" fontSize="7">plugins</text>
    </svg>
  );
}

export default function Home() {
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
    [...plugins].sort((a, b) => b.version.localeCompare(a.version))[0],
  []);

  const recentlyUpdated = useMemo(() =>
    [...plugins].sort((a, b) => b.version.localeCompare(a.version)).slice(0, 8),
  []);

  const tagCloud = useMemo(() => getTagCloud(), []);

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
