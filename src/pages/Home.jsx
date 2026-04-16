import plugins, { categories } from '../data/plugins';

export default function Home() {
  const totalPlugins = plugins.length;
  const cats = categories;
  const securityCount = plugins.filter(p => p.category === 'Security').length;
  const testingCount = plugins.filter(p => p.category === 'Testing').length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome to the Developer Portal</h1>
        <p>Your central hub for all JetBrains Marketplace plugins by Ing. Jakub Jirák</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalPlugins}</div>
          <div className="stat-label">Total Plugins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cats.length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{securityCount}</div>
          <div className="stat-label">Security Plugins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{testingCount}</div>
          <div className="stat-label">Testing Plugins</div>
        </div>
      </div>

      <div className="section">
        <h2>🏷️ Plugins by Category</h2>
        <div className="category-grid">
          {cats.map(cat => {
            const count = plugins.filter(p => p.category === cat).length;
            return (
              <div className="category-card" key={cat}>
                <h3>{cat}</h3>
                <p>{count} plugin{count !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <h2>🆕 Recently Updated</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Plugin</th>
              <th>Category</th>
              <th>Version</th>
              <th>Pricing</th>
            </tr>
          </thead>
          <tbody>
            {plugins
              .slice()
              .sort((a, b) => b.version.localeCompare(a.version))
              .slice(0, 10)
              .map(p => (
                <tr key={p.slug}>
                  <td><a href={`#/plugin/${p.slug}`}>{p.icon} {p.name}</a></td>
                  <td>{p.category}</td>
                  <td>{p.version}</td>
                  <td><span className="badge badge-pricing">{p.pricing}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
