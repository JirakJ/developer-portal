import { Link, useLocation } from 'react-router-dom';

const routeLabels = {
  '/': 'Home',
  '/catalog': 'Catalog',
  '/docs': 'Documentation',
  '/apis': 'APIs',
  '/releases': 'Releases',
  '/health': 'System Health',
  '/compare': 'Compare',
  '/changelog': 'Changelog',
  '/settings': 'Settings',
};

export default function Breadcrumb({ current, parent }) {
  const location = useLocation();
  const path = location.pathname;

  // Don't show breadcrumb on Home
  if (path === '/') return null;

  const parentPath = parent?.path || '/';
  const parentLabel = parent?.label || routeLabels[parentPath] || 'Home';
  const currentLabel = current || routeLabels[path] || 'Page';

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to={parentPath}>{parentLabel}</Link>
      <span className="breadcrumb-sep" aria-hidden="true">/</span>
      <span className="breadcrumb-current" aria-current="page">{currentLabel}</span>
    </nav>
  );
}
