import { useEffect, useState } from 'react';
import plugins from '../data/plugins';
import { useToast } from '../contexts/ToastContext';
import {
  isPluginPinned,
  togglePinnedPlugin,
  MAX_PINNED,
  PINNED_UPDATED_EVENT,
} from '../utils/pinnedPlugins';
import { recordActivity } from '../utils/activityLog';

export default function PinButton({ slug, size = 18 }) {
  const toast = useToast();
  const [pinned, setPinned] = useState(() => isPluginPinned(slug));

  useEffect(() => {
    const refresh = () => setPinned(isPluginPinned(slug));
    refresh();
    window.addEventListener(PINNED_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(PINNED_UPDATED_EVENT, refresh);
  }, [slug]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const plugin = plugins.find(p => p.slug === slug);
    const name = plugin?.name || slug;
    const result = togglePinnedPlugin(slug);
    if (result.limitReached) {
      toast.error(`Cannot pin more than ${MAX_PINNED} plugins`);
      return;
    }
    setPinned(result.pinned);
    toast.success(result.pinned ? `Pinned "${name}"` : `Unpinned "${name}"`);
    recordActivity({
      category: 'pin',
      message: result.pinned ? `Pinned ${name}` : `Unpinned ${name}`,
      meta: { slug },
    });
  };

  return (
    <button
      className={`pin-btn${pinned ? ' pin-active' : ''}`}
      onClick={handleClick}
      aria-label={pinned ? 'Unpin plugin' : 'Pin plugin to dashboard'}
      aria-pressed={pinned}
      title={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l2.39 4.84L20 8l-4 3.89L17 18l-5-2.63L7 18l1-6.11L4 8l5.61-1.16L12 2z" />
      </svg>
    </button>
  );
}
