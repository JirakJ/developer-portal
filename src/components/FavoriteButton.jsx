import { useFavorites } from '../contexts/FavoritesContext';

export default function FavoriteButton({ slug, size = 18 }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(slug);

  return (
    <button
      className={`favorite-btn${fav ? ' favorite-active' : ''}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </button>
  );
}
