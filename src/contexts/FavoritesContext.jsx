import { createContext, useContext, useState, useCallback } from 'react';
import { getItem, setItem } from '../utils/storage';
import plugins from '../data/plugins';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'favorites';
const validSlugs = new Set(plugins.map(p => p.slug));

/** Load and reconcile favorites against current plugin data */
function loadFavorites() {
  const stored = getItem(STORAGE_KEY, []);
  if (!Array.isArray(stored)) return [];
  return stored.filter(slug => validSlugs.has(slug));
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  const persist = useCallback((next) => {
    setFavorites(next);
    setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback((slug) => {
    setFavorites(prev => {
      const next = prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug];
      setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites]);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite, count: favorites.length, clearAll }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
