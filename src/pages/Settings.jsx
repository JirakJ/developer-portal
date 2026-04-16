import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { removeItem, getItem, setItem } from '../utils/storage';
import Breadcrumb from '../components/Breadcrumb';

const themeOptions = [
  { value: 'dark', label: 'Dark', icon: '🌙', desc: 'Dark background with light text' },
  { value: 'light', label: 'Light', icon: '☀️', desc: 'Light background with dark text' },
  { value: 'system', label: 'System', icon: '💻', desc: 'Follow your OS preference' },
];

export default function Settings() {
  const { mode, setTheme } = useTheme();
  const { favorites, clearAll: clearFavorites } = useFavorites();
  const toast = useToast();

  const [sidebarDefault, setSidebarDefault] = useState(() => getItem('sidebarCollapsed', false));

  const handleSidebarDefault = (val) => {
    setSidebarDefault(val);
    setItem('sidebarCollapsed', val);
    toast.success(`Sidebar will ${val ? 'start collapsed' : 'start expanded'}`);
  };

  const handleClearSearchHistory = () => {
    removeItem('recentSearches');
    toast.success('Search history cleared');
  };

  const handleClearFavorites = () => {
    if (favorites.length === 0) {
      toast.info('No favorites to clear');
      return;
    }
    clearFavorites();
    toast.success(`Cleared ${favorites.length} favorite(s)`);
  };

  const handleResetAll = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dp_')) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
    toast.success(`Reset ${keys.length} preference(s). Reload for full effect.`);
  };

  return (
    <div className="page">
      <Breadcrumb current="Settings" />
      <div className="page-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your portal preferences</p>
      </div>

      <div className="settings-section">
        <h2>Appearance</h2>
        <p className="settings-desc">Choose your preferred color theme</p>
        <div className="settings-theme-grid">
          {themeOptions.map(opt => (
            <button
              key={opt.value}
              className={`settings-theme-card${mode === opt.value ? ' active' : ''}`}
              onClick={() => setTheme(opt.value)}
            >
              <span className="settings-theme-icon">{opt.icon}</span>
              <span className="settings-theme-label">{opt.label}</span>
              <span className="settings-theme-desc">{opt.desc}</span>
              {mode === opt.value && <span className="settings-theme-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Layout</h2>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Sidebar collapsed by default</strong>
            <p>Start with icon-only sidebar for more content space</p>
          </div>
          <button
            className={`settings-toggle${sidebarDefault ? ' active' : ''}`}
            onClick={() => handleSidebarDefault(!sidebarDefault)}
            role="switch"
            aria-checked={sidebarDefault}
          >
            <span className="settings-toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2>Data</h2>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Search history</strong>
            <p>Clear your recent search queries</p>
          </div>
          <button className="btn-secondary" onClick={handleClearSearchHistory}>Clear</button>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Favorites</strong>
            <p>{favorites.length} plugin(s) bookmarked</p>
          </div>
          <button className="btn-secondary" onClick={handleClearFavorites}>Clear</button>
        </div>
      </div>

      <div className="settings-section settings-danger">
        <h2>⚠️ Danger Zone</h2>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Reset all preferences</strong>
            <p>Clear theme, favorites, search history, sidebar state — everything</p>
          </div>
          <button className="btn-danger" onClick={handleResetAll}>Reset All</button>
        </div>
      </div>
    </div>
  );
}
