import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import CompareToggleButton from './CompareToggleButton';

export default function PluginCard({ plugin }) {
  return (
    <Link to={`/plugin/${plugin.slug}`} className="plugin-card" style={{textDecoration:'none',color:'inherit'}}>
      <div className="plugin-card-header">
        <span className="plugin-icon">{plugin.icon}</span>
        <div style={{flex:1}}>
          <h3>{plugin.name}</h3>
          <span className="plugin-version">v{plugin.version}</span>
        </div>
        <div className="plugin-card-actions">
          <CompareToggleButton slug={plugin.slug} size={16} />
          <FavoriteButton slug={plugin.slug} size={16} />
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
