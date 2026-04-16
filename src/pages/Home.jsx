import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import plugins, { categories } from '../data/plugins';
import { getTagCloud } from '../utils/tags';

const categoryIcons = {
  'API': '⚡', 'Architecture': '🏗️', 'DevOps': '☸️', 'Documentation': '📄',
  'Git': '🔀', 'GPU': '🎮', 'Performance': '⏱️', 'Productivity': '✨',
  'Quality': '✅', 'Security': '🔒', 'Testing': '🧪',
};

export default function Home() {
  const gpuCount = plugins.filter(p => p.category === 'GPU').length;
  const securityCount = plugins.filter(p => p.category === 'Security').length;
  const testingCount = plugins.filter(p => p.category === 'Testing').length;
  const devopsCount = plugins.filter(p => p.category === 'DevOps').length;

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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Plugins</div>
          <div className="stat-value">{plugins.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Security</div>
          <div className="stat-value">{securityCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Testing</div>
          <div className="stat-value">{testingCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">GPU / HPC</div>
          <div className="stat-value">{gpuCount}</div>
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
