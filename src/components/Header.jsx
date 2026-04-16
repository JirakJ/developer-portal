import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import plugins from '../data/plugins';
import ThemeToggle from './ThemeToggle';
import { getItem, setItem } from '../utils/storage';

const MAX_RECENT = 5;
const RECENT_KEY = 'recentSearches';

const routeTitles = {
  '/': 'Home',
  '/catalog': 'Plugin Catalog',
  '/docs': 'Documentation',
  '/apis': 'APIs',
  '/releases': 'Releases',
  '/health': 'System Health',
};

function useIsMac() {
  return useMemo(() => {
    try {
      const platform = navigator.userAgentData?.platform || navigator.platform || '';
      return /mac/i.test(platform);
    } catch { return false; }
  }, []);
}

export default function Header({ user, onLogout, onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMac = useIsMac();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = getItem(RECENT_KEY, []);
    return Array.isArray(stored) ? stored.slice(0, MAX_RECENT) : [];
  });
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  const title = location.pathname.startsWith('/plugin/')
    ? 'Plugin Detail'
    : routeTitles[location.pathname] || 'Developer Portal';

  useEffect(() => {
    if (!query.trim()) { setResults([]); setActiveIdx(-1); return; }
    const q = query.toLowerCase();
    setResults(plugins.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 8));
    setActiveIdx(-1);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setShowResults(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setShowResults(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const goTo = useCallback((slug, searchQuery) => {
    // Save to recent searches if a meaningful query was used
    if (searchQuery && searchQuery.trim().length >= 2) {
      const normalized = searchQuery.trim().toLowerCase();
      setRecentSearches(prev => {
        const deduped = prev.filter(s => s.toLowerCase() !== normalized);
        const next = [searchQuery.trim(), ...deduped].slice(0, MAX_RECENT);
        setItem(RECENT_KEY, next);
        return next;
      });
    }
    navigate(`/plugin/${slug}`);
    setQuery('');
    setShowResults(false);
    inputRef.current?.blur();
  }, [navigate]);

  const clearRecent = useCallback((idx) => {
    if (idx === undefined) {
      setRecentSearches([]);
      setItem(RECENT_KEY, []);
    } else {
      setRecentSearches(prev => {
        const next = prev.filter((_, i) => i !== idx);
        setItem(RECENT_KEY, next);
        return next;
      });
    }
  }, []);

  const applyRecent = useCallback((term) => {
    setQuery(term);
    setShowResults(true);
  }, []);

  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); goTo(results[activeIdx].slug, query); }
  };

  return (
    <header className="header" role="banner">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="header-search" ref={containerRef} role="search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search… ${shortcutLabel}`}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKeyDown}
            className="header-search-input"
            aria-label="Search plugins"
            aria-expanded={showResults && (results.length > 0 || recentSearches.length > 0)}
            role="combobox"
            aria-autocomplete="list"
          />
          <kbd className="search-kbd">{shortcutLabel}</kbd>
          {showResults && results.length > 0 && (
            <div className="search-dropdown" role="listbox">
              {results.map((p, i) => (
                <button
                  key={p.slug}
                  className={`search-result${i === activeIdx ? ' active' : ''}`}
                  onClick={() => goTo(p.slug, query)}
                  role="option"
                  aria-selected={i === activeIdx}
                >
                  <span className="search-result-icon">{p.icon}</span>
                  <div>
                    <div className="search-result-name">{p.name}</div>
                    <div className="search-result-cat">{p.category} · v{p.version}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showResults && !query && recentSearches.length > 0 && (
            <div className="search-dropdown">
              <div className="search-recent-header">
                <span>Recent</span>
                <button className="search-recent-clear" onClick={() => clearRecent()}>Clear all</button>
              </div>
              {recentSearches.map((term, i) => (
                <div key={i} className="search-recent-item">
                  <button className="search-recent-term" onClick={() => applyRecent(term)}>
                    🕐 {term}
                  </button>
                  <button className="search-recent-remove" onClick={() => clearRecent(i)} aria-label={`Remove "${term}"`}>×</button>
                </div>
              ))}
            </div>
          )}
          {showResults && query && results.length === 0 && (
            <div className="search-dropdown">
              <div className="search-empty">No plugins found for "{query}"</div>
            </div>
          )}
        </div>
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
