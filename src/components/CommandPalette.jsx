import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import plugins from '../data/plugins';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { getRecentViewed } from '../utils/recentViewed';
import { getCompareShortlist, setCompareShortlist } from '../utils/compareShortlist';
import { getItem, removeItem } from '../utils/storage';
import { getHealthThreshold } from '../utils/healthPolicy';
import { getAlertPolicy } from '../utils/alertsPolicy';
import { clearDismissedAlerts, getDismissedAlerts, getPortfolioAlerts, summarizeAlerts } from '../utils/alerts';

const pages = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Plugin Catalog', path: '/catalog', icon: '📦' },
  { label: 'Compare Plugins', path: '/compare', icon: '📊' },
  { label: 'Documentation', path: '/docs', icon: '📄' },
  { label: 'APIs', path: '/apis', icon: '⚡' },
  { label: 'Releases', path: '/releases', icon: '🚀' },
  { label: 'System Health', path: '/health', icon: '💚' },
  { label: 'Alerts Center', path: '/alerts', icon: '🚨' },
  { label: 'Changelog', path: '/changelog', icon: '📝' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

function highlightMatch(text, query) {
  if (!query) return text;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="command-palette-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CommandPalette({ open, onClose, onOpenShortcuts }) {
  const navigate = useNavigate();
  const { mode, cycle } = useTheme();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const listRef = useRef(null);

  const themeLabel = { dark: 'Dark', light: 'Light', system: 'System' }[mode] || mode;

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    const result = [];
    const shortlist = getCompareShortlist();
    const shortlistPath = shortlist.length ? `/compare?plugins=${shortlist.join(',')}` : '/compare';
    const alertSummary = summarizeAlerts(
      getPortfolioAlerts(plugins, getHealthThreshold(), undefined, getAlertPolicy()),
      getDismissedAlerts()
    );
    const openAlertsCount = alertSummary.total;
    const criticalAlertsCount = alertSummary.critical;
    const dismissedCount = Object.keys(getDismissedAlerts()).length;
    const favoriteSlugs = getItem('favorites', []);
    const favoriteList = Array.isArray(favoriteSlugs) ? favoriteSlugs : [];
    const favoritePlugins = favoriteList.map(slug => plugins.find(p => p.slug === slug)).filter(Boolean).slice(0, 6);
    const presetRaw = getItem('catalogPresets', []);
    const catalogPresets = Array.isArray(presetRaw) ? presetRaw.slice(0, 6) : [];

    const filteredPages = q
      ? pages.filter(p => p.label.toLowerCase().includes(q))
      : pages;
    if (filteredPages.length > 0) {
      result.push({ type: 'section', label: 'Pages' });
      filteredPages.forEach(p => result.push({ type: 'page', ...p }));
    }

    const filteredPlugins = q
      ? plugins.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q)) ||
          p.category.toLowerCase().includes(q)
        ).slice(0, 6)
      : plugins.slice(0, 6);
    if (filteredPlugins.length > 0) {
      result.push({ type: 'section', label: 'Plugins' });
      filteredPlugins.forEach(p => result.push({
        type: 'plugin', label: p.name, path: `/plugin/${p.slug}`, icon: p.icon, meta: p.category,
      }));
    }

    if (!q) {
      const recentViewed = getRecentViewed()
        .map(slug => plugins.find(p => p.slug === slug))
        .filter(Boolean)
        .slice(0, 5);
      if (recentViewed.length > 0) {
        result.push({ type: 'section', label: 'Recently Viewed' });
        recentViewed.forEach(p => result.push({
          type: 'plugin',
          label: p.name,
          path: `/plugin/${p.slug}`,
          icon: p.icon,
          meta: `Recent · ${p.category}`,
        }));
      }

      if (favoritePlugins.length > 0) {
        result.push({ type: 'section', label: 'Favorites' });
        favoritePlugins.forEach(p => result.push({
          type: 'plugin',
          label: p.name,
          path: `/plugin/${p.slug}`,
          icon: p.icon,
          meta: `Favorite · ${p.category}`,
        }));
      }

      if (catalogPresets.length > 0) {
        result.push({ type: 'section', label: 'Catalog Presets' });
        catalogPresets.forEach(preset => {
          const params = new URLSearchParams();
          if (preset.search) params.set('q', preset.search);
          if (preset.category) params.set('category', preset.category);
          if (preset.tagFilter) params.set('tag', preset.tagFilter);
          if (preset.showFavoritesOnly) params.set('fav', '1');
          if (preset.viewMode === 'list') params.set('view', 'list');
          if (preset.sortKey && preset.sortKey !== 'name') params.set('sort', preset.sortKey);
          if (preset.sortDir === 'desc') params.set('dir', 'desc');
          result.push({
            type: 'page',
            label: `Preset: ${preset.name}`,
            path: `/catalog${params.toString() ? `?${params.toString()}` : ''}`,
            icon: '🧩',
            meta: 'Apply preset',
          });
        });
      }
    }

    const actions = [
      { label: 'Toggle Theme', icon: '🎨', action: 'toggle-theme', meta: `Current: ${themeLabel}` },
      { label: 'Keyboard Shortcuts', icon: '⌨️', action: 'shortcuts', meta: 'Press ?' },
      { label: 'Open Comparison Shortlist', icon: '⚖️', action: 'open-comparison', path: shortlistPath, meta: shortlist.length ? `${shortlist.length} selected` : 'No plugins selected' },
      { label: 'Open Alerts Center', icon: '🚨', action: 'open-alerts', path: '/alerts', meta: openAlertsCount ? `${openAlertsCount} open` : 'No open alerts' },
      { label: 'Open Critical Alerts', icon: '🔥', action: 'open-critical-alerts', path: '/alerts?severity=critical', meta: criticalAlertsCount ? `${criticalAlertsCount} critical` : 'No critical alerts' },
      { label: 'Clear Dismissed Alerts', icon: '🧼', action: 'clear-dismissed-alerts', meta: dismissedCount ? `${dismissedCount} dismissed` : 'Nothing to clear' },
      { label: 'Clear Recently Viewed', icon: '🧹', action: 'clear-recent', meta: 'Reset recent plugin history' },
      { label: 'Clear Comparison Shortlist', icon: '🗑️', action: 'clear-shortlist', meta: 'Remove all compare selections' },
    ];
    const filteredActions = q
      ? actions.filter(a => a.label.toLowerCase().includes(q))
      : actions;
    if (filteredActions.length > 0) {
      result.push({ type: 'section', label: 'Actions' });
      filteredActions.forEach(a => result.push({ type: 'action', ...a }));
    }

    return result;
  }, [query, themeLabel]);

  const selectableIndices = useMemo(() =>
    items.reduce((acc, item, i) => {
      if (item.type !== 'section') acc.push(i);
      return acc;
    }, []),
  [items]);

  useEffect(() => {
    if (!listRef.current) return;
    const realIdx = selectableIndices[activeIdx];
    if (realIdx == null) return;
    const el = listRef.current.children[realIdx];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, selectableIndices]);

  const execute = useCallback((item) => {
    if (item.type === 'page' || item.type === 'plugin') {
      navigate(item.path);
      onClose();
    } else if (item.type === 'action') {
      if (item.action === 'toggle-theme') {
        cycle();
      } else if (item.action === 'shortcuts') {
        onClose();
        setTimeout(() => onOpenShortcuts?.(), 100);
        return;
      } else if (item.action === 'open-comparison') {
        navigate(item.path || '/compare');
      } else if (item.action === 'open-alerts') {
        navigate(item.path || '/alerts');
      } else if (item.action === 'open-critical-alerts') {
        navigate(item.path || '/alerts?severity=critical');
      } else if (item.action === 'clear-dismissed-alerts') {
        clearDismissedAlerts();
        toast.success('Dismissed alerts cleared');
      } else if (item.action === 'clear-recent') {
        removeItem('recentViewed');
        toast.success('Recently viewed cleared');
      } else if (item.action === 'clear-shortlist') {
        setCompareShortlist([]);
        toast.success('Comparison shortlist cleared');
      }
      onClose();
    }
  }, [navigate, onClose, cycle, onOpenShortcuts, toast]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, selectableIndices.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const realIdx = selectableIndices[activeIdx];
      if (realIdx != null && items[realIdx]) execute(items[realIdx]);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="command-palette-overlay" onClick={onClose} role="presentation">
      <div
        className="command-palette"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="command-palette-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            className="command-palette-input"
            aria-label="Command palette search"
            autoFocus
          />
          <kbd className="command-palette-esc">Esc</kbd>
        </div>
        <div className="command-palette-list" ref={listRef} role="listbox">
          {items.map((item, i) => {
            if (item.type === 'section') {
              return <div key={`s-${item.label}`} className="command-palette-section">{item.label}</div>;
            }
            const selIdx = selectableIndices.indexOf(i);
            const isActive = selIdx === activeIdx;
            return (
              <button
                key={`${item.type}-${item.label}-${i}`}
                className={`command-palette-item${isActive ? ' active' : ''}`}
                onClick={() => execute(item)}
                role="option"
                aria-selected={isActive}
              >
                <span className="command-palette-item-icon">{item.icon}</span>
                <span className="command-palette-item-label">{highlightMatch(item.label, query.trim())}</span>
                {item.meta && <span className="command-palette-item-meta">{highlightMatch(item.meta, query.trim())}</span>}
              </button>
            );
          })}
          {selectableIndices.length === 0 && (
            <div className="command-palette-empty">No results for "{query}"</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
