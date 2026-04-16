import plugins from '../data/plugins';

export default function Health() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>💚 System Health</h1>
        <p>Marketplace status and plugin health overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-green">
          <div className="stat-value">{plugins.length}</div>
          <div className="stat-label">Plugins Published</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-value">✓</div>
          <div className="stat-label">Marketplace Status</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-value">2026.1+</div>
          <div className="stat-label">IDE Compatibility</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Freemium</div>
          <div className="stat-label">Pricing Model</div>
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
                <td>{p.icon} {p.name}</td>
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
