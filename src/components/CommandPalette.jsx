import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import plugins from '../data/plugins';
import { useTheme } from '../contexts/ThemeContext';

const pages = [
  { label: 'Home', path: '/', icon: '🏠' },
  { label: 'Plugin Catalog', path: '/catalog', icon: '📦' },
  { label: 'Compare Plugins', path: '/compare', icon: '📊' },
  { label: 'Documentation', path: '/docs', icon: '📄' },
  { label: 'APIs', path: '/apis', icon: '⚡' },
  { label: 'Releases', path: '/releases', icon: '🚀' },
  { label: 'System Health', path: '/health', icon: '💚' },
  { label: 'Changelog', path: '/changelog', icon: '📝' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
];

export default function CommandPalette({ open, onClose, onOpenShortcuts }) {
  const navigate = useNavigate();
  const { mode, cycle } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const themeLabel = { dark: 'Dark', light: 'Light', system: 'System' }[mode] || mode;

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    const result = [];

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

    const actions = [
      { label: 'Toggle Theme', icon: '🎨', action: 'toggle-theme', meta: `Current: ${themeLabel}` },
      { label: 'Keyboard Shortcuts', icon: '⌨️', action: 'shortcuts', meta: 'Press ?' },
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
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

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
      }
      onClose();
    }
  }, [navigate, onClose, cycle, onOpenShortcuts]);

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
            ref={inputRef}
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            className="command-palette-input"
            aria-label="Command palette search"
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
                <span className="command-palette-item-label">{item.label}</span>
                {item.meta && <span className="command-palette-item-meta">{item.meta}</span>}
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
