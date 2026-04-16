import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import PluginDetail from './pages/PluginDetail';
import Docs from './pages/Docs';
import APIs from './pages/APIs';
import Releases from './pages/Releases';
import Health from './pages/Health';

const STORAGE_KEY = 'dp_user';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/plugin/:slug" element={<PluginDetail />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/apis" element={<APIs />} />
            <Route path="/releases" element={<Releases />} />
            <Route path="/health" element={<Health />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
