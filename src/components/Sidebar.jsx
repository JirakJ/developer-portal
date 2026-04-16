import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { section: 'Menu', items: [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/catalog', icon: '🧩', label: 'Plugin Catalog' },
    { to: '/docs', icon: '📖', label: 'Documentation' },
    { to: '/apis', icon: '🔌', label: 'APIs & Integrations' },
  ]},
  { section: 'Tools', items: [
    { to: '/releases', icon: '📦', label: 'Releases' },
    { to: '/health', icon: '💚', label: 'System Health' },
  ]},
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>🧩 Developer Portal</h2>
        <p>Jakub Jirák · JetBrains Plugins</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div className="sidebar-section" key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive && (item.to === '/' ? location.pathname === '/' : true) ? 'active' : ''}`
                }
                end={item.to === '/'}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 Ing. Jakub Jirák</p>
        <p style={{marginTop: 4}}>Backstage-inspired Portal</p>
      </div>
    </aside>
  );
}
