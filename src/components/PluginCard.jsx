import { Link } from 'react-router-dom';

export default function PluginCard({ plugin }) {
  return (
    <Link to={`/plugin/${plugin.slug}`} className="plugin-card" style={{textDecoration:'none',color:'inherit'}}>
      <div className="plugin-card-header">
        <span className="plugin-icon">{plugin.icon}</span>
        <div>
          <h3>{plugin.name}</h3>
          <span className="plugin-version">v{plugin.version}</span>
        </div>
      </div>
      <p className="plugin-desc">{plugin.description}</p>
      <div className="plugin-tags">
        <span className="badge">{plugin.category}</span>
        <span className="badge badge-pricing">{plugin.pricing}</span>
      </div>
    </Link>
  );
}
