import { useParams, Link } from 'react-router-dom';
import plugins from '../data/plugins';

export default function PluginDetail() {
  const { slug } = useParams();
  const plugin = plugins.find(p => p.slug === slug);

  if (!plugin) {
    return (
      <div className="page">
        <h1>Plugin not found</h1>
        <Link to="/catalog">← Back to Catalog</Link>
      </div>
    );
  }

  const marketplaceUrl = `https://plugins.jetbrains.com/plugin/${plugin.id}-${plugin.slug}`;

  return (
    <div className="page">
      <Link to="/catalog" className="back-link">← Back to Catalog</Link>

      <div className="plugin-detail">
        <div className="plugin-detail-header">
          <span className="plugin-detail-icon">{plugin.icon}</span>
          <div>
            <h1>{plugin.name}</h1>
            <div className="plugin-detail-meta">
              <span className="badge">{plugin.category}</span>
              <span className="badge badge-pricing">{plugin.pricing}</span>
              <span className="plugin-version">v{plugin.version}</span>
            </div>
          </div>
        </div>

        <p className="plugin-detail-desc">{plugin.description}</p>

        <div className="plugin-detail-section">
          <h2>Features</h2>
          <ul className="feature-list">
            {plugin.features.map((f, i) => (
              <li key={i}>✅ {f}</li>
            ))}
          </ul>
        </div>

        <div className="plugin-detail-section">
          <h2>Tags</h2>
          <div className="plugin-tags">
            {plugin.tags.map(t => (
              <span key={t} className="badge">{t}</span>
            ))}
          </div>
        </div>

        <div className="plugin-detail-section">
          <h2>Links</h2>
          <div className="plugin-links">
            <a href={marketplaceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              🛒 JetBrains Marketplace
            </a>
            <a href={`https://github.com/JirakJ/jetbrains-plugins/tree/main/${plugin.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              📂 Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
