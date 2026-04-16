import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import plugins, { categories } from '../data/plugins';
import PluginCard from '../components/PluginCard';
import Breadcrumb from '../components/Breadcrumb';
import { getItem, setItem } from '../utils/storage';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { normalizeTag } from '../utils/tags';

const PRESETS_KEY = 'catalogPresets';
const MAX_PRESETS = 8;

function readCatalogState(searchParams) {
  const defaultView = getItem('catalogView', 'grid');
  const view = searchParams.get('view');
  return {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    tagFilter: searchParams.get('tag') || '',
    showFavoritesOnly: searchParams.get('fav') === '1',
    viewMode: view === 'list' ? 'list' : (view === 'grid' ? 'grid' : defaultView),
  };
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [presets, setPresets] = useState(() => getItem(PRESETS_KEY, []));
  const [presetName, setPresetName] = useState('');
  const { isFavorite } = useFavorites();
  const toast = useToast();

  const { search, category, tagFilter, showFavoritesOnly, viewMode } = readCatalogState(searchParams);

  const updateState = (overrides) => {
    const next = {
      search,
      category,
      tagFilter,
      showFavoritesOnly,
      viewMode,
      ...overrides,
    };
    const params = new URLSearchParams();
    if (next.search) params.set('q', next.search);
    if (next.category) params.set('category', next.category);
    if (next.tagFilter) params.set('tag', next.tagFilter);
    if (next.showFavoritesOnly) params.set('fav', '1');
    if (next.viewMode !== 'grid') params.set('view', next.viewMode);
    setSearchParams(params, { replace: true });
  };

  const changeView = (mode) => {
    setItem('catalogView', mode);
    updateState({ viewMode: mode });
  };

  const clearAllFilters = () => {
    updateState({ search: '', category: '', tagFilter: '', showFavoritesOnly: false });
  };

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      const matchCategory = !category || p.category === category;
      const matchTag = !tagFilter || p.tags.some(t => normalizeTag(t) === normalizeTag(tagFilter));
      const matchFav = !showFavoritesOnly || isFavorite(p.slug);
      return matchSearch && matchCategory && matchTag && matchFav;
    });
  }, [search, category, tagFilter, showFavoritesOnly, isFavorite]);

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) {
      toast.info('Enter a preset name');
      return;
    }
    const snapshot = { search, category, tagFilter, showFavoritesOnly, viewMode };
    if (!snapshot.search && !snapshot.category && !snapshot.tagFilter && !snapshot.showFavoritesOnly && snapshot.viewMode === 'grid') {
      toast.info('No filters to save');
      return;
    }
    const next = [
      { id: `${Date.now()}`, name, ...snapshot },
      ...presets.filter(p => p.name.toLowerCase() !== name.toLowerCase()),
    ].slice(0, MAX_PRESETS);
    setPresets(next);
    setItem(PRESETS_KEY, next);
    setPresetName('');
    toast.success(`Saved preset "${name}"`);
  };

  const applyPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;
    updateState({
      search: preset.search || '',
      category: preset.category || '',
      tagFilter: preset.tagFilter || '',
      showFavoritesOnly: Boolean(preset.showFavoritesOnly),
      viewMode: preset.viewMode === 'list' ? 'list' : 'grid',
    });
  };

  const removePreset = (id) => {
    const next = presets.filter(p => p.id !== id);
    setPresets(next);
    setItem(PRESETS_KEY, next);
  };

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
          onChange={e => updateState({ search: e.target.value })}
        />
        <select
          className="filter-select"
          value={category}
          onChange={e => updateState({ category: e.target.value })}
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {tagFilter && (
          <span className="active-filter">
            Tag: {tagFilter}
            <button className="filter-clear" onClick={() => updateState({ tagFilter: '' })} aria-label="Clear tag filter">×</button>
          </span>
        )}
        <label className="favorites-toggle">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={e => updateState({ showFavoritesOnly: e.target.checked })}
          />
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

      <div className="catalog-presets">
        <input
          type="text"
          className="catalog-preset-input"
          placeholder="Preset name"
          value={presetName}
          onChange={e => setPresetName(e.target.value)}
        />
        <button className="btn-secondary" onClick={savePreset}>Save preset</button>
        {presets.length > 0 && (
          <div className="catalog-preset-list">
            {presets.map(preset => (
              <span key={preset.id} className="catalog-preset-chip">
                <button className="catalog-preset-apply" onClick={() => applyPreset(preset.id)}>{preset.name}</button>
                <button className="catalog-preset-remove" onClick={() => removePreset(preset.id)} aria-label={`Delete preset ${preset.name}`}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No plugins found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
          {(search || category || tagFilter || showFavoritesOnly) && (
            <button className="btn-secondary" onClick={clearAllFilters}>
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

