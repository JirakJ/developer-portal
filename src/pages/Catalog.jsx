import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import plugins, { categories } from '../data/plugins';
import PluginCard from '../components/PluginCard';
import Breadcrumb from '../components/Breadcrumb';
import { getItem, setItem } from '../utils/storage';
import { useFavorites } from '../contexts/FavoritesContext';
import { normalizeTag } from '../utils/tags';

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState(() => getItem('catalogView', 'grid'));
  const { isFavorite } = useFavorites();

  useEffect(() => {
    const cat = searchParams.get('category');
    const tag = searchParams.get('tag');
    if (cat) setCategory(cat);
    if (tag) setTagFilter(tag);
  }, [searchParams]);

  const changeView = (mode) => {
    setViewMode(mode);
    setItem('catalogView', mode);
  };

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q));
      const matchCategory = !category || p.category === category;
      const matchTag = !tagFilter || p.tags.some(t => normalizeTag(t) === normalizeTag(tagFilter));
      const matchFav = !showFavoritesOnly || isFavorite(p.slug);
      return matchSearch && matchCategory && matchTag && matchFav;
    });
  }, [search, category, tagFilter, showFavoritesOnly, isFavorite]);

  return (
    <div className="page">
      <Breadcrumb current="Plugin Catalog" />
      <div className="page-header">
        <h1>Plugin Catalog</h1>
        <p>{plugins.length} plugins available</p>
      </div>

      <div className="catalog-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search plugins..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {tagFilter && (
          <span className="active-filter">
            Tag: {tagFilter}
            <button className="filter-clear" onClick={() => setTagFilter('')} aria-label="Clear tag filter">×</button>
          </span>
        )}
        <label className="favorites-toggle">
          <input type="checkbox" checked={showFavoritesOnly} onChange={e => setShowFavoritesOnly(e.target.checked)} />
          <span>★ Favorites</span>
        </label>
        <div className="view-toggle">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => changeView('grid')}
            title="Grid view"
          >▦</button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => changeView('list')}
            title="List view"
          >☰</button>
        </div>
      </div>

      <p className="result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No plugins found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
          {(search || category || tagFilter || showFavoritesOnly) && (
            <button className="btn-secondary" onClick={() => { setSearch(''); setCategory(''); setTagFilter(''); setShowFavoritesOnly(false); }}>
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="catalog-grid">
          {filtered.map(p => <PluginCard key={p.slug} plugin={p} />)}
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th></th>
              <th>Plugin</th>
              <th>Category</th>
              <th>Version</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.slug}>
                <td>{p.icon}</td>
                <td><Link to={`/plugin/${p.slug}`}>{p.name}</Link></td>
                <td>{p.category}</td>
                <td>{p.version}</td>
                <td>{p.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}