import { Link } from 'react-router-dom';
import plugins from '../data/plugins';

export default function Releases() {
  const sorted = [...plugins].sort((a, b) => b.version.localeCompare(a.version));

  return (
    <div className="page">
      <div className="page-header">
        <h1>📦 Releases</h1>
        <p>Latest plugin versions and release history</p>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th>Plugin</th>
            <th>Version</th>
            <th>Category</th>
            <th>Marketplace</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr key={p.slug}>
              <td>{p.icon}</td>
              <td><Link to={`/plugin/${p.slug}`}>{p.name}</Link></td>
              <td><code>{p.version}</code></td>
              <td>{p.category}</td>
              <td>
                <a href={`https://plugins.jetbrains.com/plugin/${p.id}-${p.slug}`} target="_blank" rel="noopener noreferrer">
                  View <span className="external-icon" aria-hidden="true">↗</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
