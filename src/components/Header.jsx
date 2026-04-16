import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const routeTitles = {
  '/': 'Home',
  '/catalog': 'Plugin Catalog',
  '/docs': 'Documentation',
  '/apis': 'APIs',
  '/releases': 'Releases',
  '/health': 'System Health',
  '/settings': 'Settings',
};

function useIsMac() {
  return useMemo(() => {
    try {
      const platform = navigator.userAgentData?.platform || navigator.platform || '';
      return /mac/i.test(platform);
    } catch { return false; }
  }, []);
}

export default function Header({ user, onLogout, onMenuToggle, onOpenPalette }) {
  const location = useLocation();
  const isMac = useIsMac();

  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  const title = location.pathname.startsWith('/plugin/')
    ? 'Plugin Detail'
    : routeTitles[location.pathname] || 'Developer Portal';

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <button className="command-palette-trigger" onClick={onOpenPalette} aria-label="Open command palette">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Search or jump to…</span>
          <kbd>{shortcutLabel}</kbd>
        </button>
        <ThemeToggle />
        <div className="header-user">
          <div className="header-avatar">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt={user.name || ''} />
              : (user?.login?.[0] || 'U').toUpperCase()
            }
          </div>
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}
