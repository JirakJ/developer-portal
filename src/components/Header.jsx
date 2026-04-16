import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import plugins from '../data/plugins';

const routeTitles = {
  '/': 'Home',
  '/catalog': 'Plugin Catalog',
  '/docs': 'Documentation',
  '/apis': 'APIs',
  '/releases': 'Releases',
  '/health': 'System Health',
};

export default function Header({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef(null);

  const title = location.pathname.startsWith('/plugin/')
    ? 'Plugin Detail'
    : routeTitles[location.pathname] || 'Developer Portal';

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(plugins.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    ).slice(0, 6));
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowResults(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const goTo = (slug) => { navigate(`/plugin/${slug}`); setQuery(''); setShowResults(false); };

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        <div className="header-search" ref={ref}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search plugins… (⌘K)"
            value={query}
            onChange={e => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => query && setShowResults(true)}
            className="header-search-input"
          />
          {showResults && results.length > 0 && (
            <div className="search-dropdown">
              {results.map(p => (
                <button key={p.slug} className="search-result" onClick={() => goTo(p.slug)}>
                  <span className="search-result-icon">{p.icon}</span>
                  <div>
                    <div className="search-result-name">{p.name}</div>
                    <div className="search-result-cat">{p.category}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="header-user">
          <div className="header-avatar">
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" />
              : (user?.login?.[0] || 'U').toUpperCase()
            }
          </div>
          <button className="btn-logout" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}
