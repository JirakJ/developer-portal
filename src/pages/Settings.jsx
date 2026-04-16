import { useRef, useState } from 'react';
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
  const [recentViewedCount, setRecentViewedCount] = useState(() => getItem('recentViewed', []).length);
  const [compareShortlistCount, setCompareShortlistCount] = useState(() => getItem('compareShortlist', []).length);
  const [presetCount, setPresetCount] = useState(() => getItem('catalogPresets', []).length);
  const importRef = useRef(null);

  const refreshCounts = () => {
    const recentViewed = getItem('recentViewed', []);
    const shortlist = getItem('compareShortlist', []);
    const presets = getItem('catalogPresets', []);
    setRecentViewedCount(Array.isArray(recentViewed) ? recentViewed.length : 0);
    setCompareShortlistCount(Array.isArray(shortlist) ? shortlist.length : 0);
    setPresetCount(Array.isArray(presets) ? presets.length : 0);
    setSidebarDefault(getItem('sidebarCollapsed', false));
  };

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

  const handleClearRecentViewed = () => {
    removeItem('recentViewed');
    setRecentViewedCount(0);
    toast.success('Recently viewed list cleared');
  };

  const handleClearCompareShortlist = () => {
    removeItem('compareShortlist');
    setCompareShortlistCount(0);
    toast.success('Comparison shortlist cleared');
  };

  const handleClearCatalogPresets = () => {
    removeItem('catalogPresets');
    setPresetCount(0);
    toast.success('Catalog presets cleared');
  };

  const handleResetAll = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dp_')) keys.push(key);
    }
    keys.forEach(k => localStorage.removeItem(k));
    refreshCounts();
    toast.success(`Reset ${keys.length} preference(s). Reload for full effect.`);
  };

  const handleExportPreferences = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {},
    };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('dp_')) payload.data[key] = localStorage.getItem(key);
    }
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `developer-portal-preferences-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Preferences exported');
  };

  const handleImportPreferences = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const entries = Object.entries(parsed?.data || {});
      let restored = 0;
      entries.forEach(([key, value]) => {
        if (key.startsWith('dp_') && typeof value === 'string') {
          localStorage.setItem(key, value);
          restored += 1;
        }
      });
      refreshCounts();
      toast.success(`Imported ${restored} preference item(s). Reload for full effect.`);
    } catch {
      toast.error('Invalid preferences file');
    } finally {
      e.target.value = '';
    }
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
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Recently viewed</strong>
            <p>{recentViewedCount} plugin(s) in history</p>
          </div>
          <button className="btn-secondary" onClick={handleClearRecentViewed}>Clear</button>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Comparison shortlist</strong>
            <p>{compareShortlistCount} plugin(s) selected for compare</p>
          </div>
          <button className="btn-secondary" onClick={handleClearCompareShortlist}>Clear</button>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Catalog presets</strong>
            <p>{presetCount} saved filter preset(s)</p>
          </div>
          <button className="btn-secondary" onClick={handleClearCatalogPresets}>Clear</button>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <strong>Preferences backup</strong>
            <p>Export or restore all portal settings as JSON</p>
          </div>
          <div className="settings-actions">
            <button className="btn-secondary" onClick={handleExportPreferences}>Export</button>
            <button className="btn-secondary" onClick={() => importRef.current?.click()}>Import</button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleImportPreferences}
            />
          </div>
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
