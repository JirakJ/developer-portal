import { Link } from 'react-router-dom';
import plugins from '../data/plugins';

export default function Health() {
  const freemiumCount = plugins.filter(p => p.pricing === 'freemium').length;
  const paidCount = plugins.length - freemiumCount;

  return (
    <div className="page">
      <div className="page-header">
        <h1>💚 System Health</h1>
        <p>Marketplace status and plugin health overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-green">
          <div className="stat-label">Plugins Published</div>
          <div className="stat-value">{plugins.length}</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-label">Marketplace Status</div>
          <div className="stat-value">Online</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">IDE Compatibility</div>
          <div className="stat-value">2026.1+</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Freemium / Paid</div>
          <div className="stat-value">{freemiumCount} / {paidCount}</div>
        </div>
      </div>

      <div className="section">
        <h2>Plugin Compatibility Matrix</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Plugin</th>
              <th>Version</th>
              <th>IntelliJ 2026.1</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {plugins.map(p => (
              <tr key={p.slug}>
                <td><Link to={`/plugin/${p.slug}`}>{p.icon} {p.name}</Link></td>
                <td><code>{p.version}</code></td>
                <td>✅ Compatible</td>
                <td><span className="status-badge status-active">Healthy</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
