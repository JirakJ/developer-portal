import { useState } from 'react';
import { isInCompareShortlist, toggleCompareShortlist } from '../utils/compareShortlist';

export default function CompareToggleButton({ slug, size = 18 }) {
  const [active, setActive] = useState(() => isInCompareShortlist(slug));

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleCompareShortlist(slug);
    setActive(next.includes(slug));
  };

  return (
    <button
      className={`compare-toggle-btn${active ? ' compare-toggle-active' : ''}`}
      onClick={handleToggle}
      aria-label={active ? 'Remove from comparison shortlist' : 'Add to comparison shortlist'}
      title={active ? 'Remove from comparison shortlist' : 'Add to comparison shortlist'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    </button>
  );
}

