import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const PluginDetail = lazy(() => import('./pages/PluginDetail'));
const Docs = lazy(() => import('./pages/Docs'));
const APIs = lazy(() => import('./pages/APIs'));
const Releases = lazy(() => import('./pages/Releases'));
const Health = lazy(() => import('./pages/Health'));
const NotFound = lazy(() => import('./pages/NotFound'));

const STORAGE_KEY = 'dp_user';

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="loader-spinner" />
      <span>Loading…</span>
    </div>
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
  const { pathname } = useLocation();

  // Close mobile sidebar on navigation
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

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
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Header user={user} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(s => !s)} />
        <div className="content-area">
          <ScrollToTop />
          <DocumentTitle />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/plugin/:slug" element={<PluginDetail />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/apis" element={<APIs />} />
              <Route path="/releases" element={<Releases />} />
              <Route path="/health" element={<Health />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
