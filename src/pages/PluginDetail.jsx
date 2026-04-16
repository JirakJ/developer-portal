import { useParams, Link } from 'react-router-dom';
import plugins from '../data/plugins';
import FavoriteButton from '../components/FavoriteButton';
import { getRelatedPlugins } from '../utils/tags';

export default function PluginDetail() {
  const { slug } = useParams();
  const plugin = plugins.find(p => p.slug === slug);

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

  const related = getRelatedPlugins(slug, 4);
  const marketplaceUrl = `https://plugins.jetbrains.com/plugin/${plugin.id}-${plugin.slug}`;

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
          <FavoriteButton slug={plugin.slug} size={22} />
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
              🛒 JetBrains Marketplace <span className="external-icon" aria-hidden="true">↗</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <a href={`https://github.com/JirakJ/jetbrains-plugins/tree/main/${plugin.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              📂 Source Code <span className="external-icon" aria-hidden="true">↗</span>
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </div>

        {related.length > 0 && (
          <div className="plugin-detail-section">
            <h2>Related Plugins</h2>
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
          </div>
        )}
      </div>
    </div>
  );
}
