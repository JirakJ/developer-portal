export default function APIs() {
  const apis = [
    {
      name: 'JetBrains Marketplace API',
      desc: 'Plugin listing, sales data, reviews, and analytics.',
      url: 'https://plugins.jetbrains.com/docs/marketplace/api-reference.html',
      status: 'active',
    },
    {
      name: 'JetBrains Sales API',
      desc: 'Revenue reports, transaction history, and financial data.',
      url: 'https://plugins.jetbrains.com/docs/marketplace/plugin-developers.html',
      status: 'active',
    },
    {
      name: 'GitHub REST API',
      desc: 'Repository management, releases, and CI/CD integration.',
      url: 'https://docs.github.com/en/rest',
      status: 'active',
    },
    {
      name: 'IntelliJ Platform SDK',
      desc: 'Plugin development SDK — actions, services, UI components, and extension points.',
      url: 'https://plugins.jetbrains.com/docs/intellij/welcome.html',
      status: 'active',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔌 APIs & Integrations</h1>
        <p>External APIs and services used across the plugin suite</p>
      </div>

      <div className="api-grid">
        {apis.map(api => (
          <div className="api-card" key={api.name}>
            <div className="api-card-header">
              <h3>{api.name}</h3>
              <span className={`status-badge status-${api.status}`}>{api.status}</span>
            </div>
            <p>{api.desc}</p>
            <a href={api.url} target="_blank" rel="noopener noreferrer" className="api-link">
              View Documentation →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
