import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import ProgressBar from './components/ProgressBar';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import ShortcutsModal from './components/ShortcutsModal';
import CommandPalette from './components/CommandPalette';
import BackToTop from './components/BackToTop';
import AnnouncementBanner from './components/AnnouncementBanner';
import useGlobalKeys from './hooks/useGlobalKeys';
import { getItem, setItem } from './utils/storage';

const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const PluginDetail = lazy(() => import('./pages/PluginDetail'));
const Docs = lazy(() => import('./pages/Docs'));
const APIs = lazy(() => import('./pages/APIs'));
const Releases = lazy(() => import('./pages/Releases'));
const Health = lazy(() => import('./pages/Health'));
const Compare = lazy(() => import('./pages/Compare'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const STORAGE_KEY = 'dp_user';

function PageLoader() {
  return (
    <>
      <ProgressBar />
      <div className="page-loader" role="status" aria-label="Loading page">
        <div className="loader-spinner" />
        <span>Loading…</span>
      </div>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.querySelector('.content-area')?.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = {
      '/': 'Home',
      '/catalog': 'Plugin Catalog',
      '/docs': 'Documentation',
      '/apis': 'APIs',
      '/releases': 'Releases',
      '/health': 'System Health',
      '/compare': 'Compare Plugins',
      '/changelog': 'Changelog',
      '/settings': 'Settings',
    };
    const title = pathname.startsWith('/plugin/')
      ? 'Plugin Detail'
      : titles[pathname] || 'Page';
    document.title = `${title} — Developer Portal`;
  }, [pathname]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => getItem('sidebarCollapsed', false));
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const toggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      setItem('sidebarCollapsed', next);
      return next;
    });
  };

  // Global keyboard shortcuts (? for help, G-then-X for nav)
  const keyMap = useMemo(() => ({
    '?': { handler: () => setShortcutsOpen(s => !s) },
    'Escape': { handler: () => { setShortcutsOpen(false); setPaletteOpen(false); }, ignoreInput: true },
    'k': { handler: () => setPaletteOpen(true), ctrl: true },
  }), []);
  useGlobalKeys(keyMap);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!user) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Login onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <ThemeProvider>
    <FavoritesProvider>
    <ToastProvider>
      <div className="app-layout">
        <a href="#main-content" className="skip-link">Skip to content</a>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} onToggleCollapse={toggleCollapse} />

        <div className="main-content">
          <Header user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(s => !s)} onOpenPalette={() => setPaletteOpen(true)} />
          <AnnouncementBanner />
          <main id="main-content" className="content-area" tabIndex={-1}>
            <ScrollToTop />
            <DocumentTitle />
            <ErrorBoundary key={location.pathname}>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/plugin/:slug" element={<PluginDetail />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/apis" element={<APIs />} />
                  <Route path="/releases" element={<Releases />} />
                  <Route path="/health" element={<Health />} />
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <footer className="portal-footer">
            <span>© 2026 Jakub Jirák · Developer Portal v1.5.0</span>
            <span>
              <a href="https://plugins.jetbrains.com/organizations/JakubJirak" target="_blank" rel="noopener noreferrer">
                JetBrains Marketplace <span className="external-icon" aria-hidden="true">↗</span>
              </a>
            </span>
          </footer>
        </div>

        <BackToTop />
        <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onOpenShortcuts={() => setShortcutsOpen(true)} />
      </div>
    </ToastProvider>
    </FavoritesProvider>
    </ThemeProvider>
  );
}
