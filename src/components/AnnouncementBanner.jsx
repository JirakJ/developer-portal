import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import announcements from '../data/announcements';
import { getItem, setItem } from '../utils/storage';

const DISMISS_KEY = 'dismissedBanners';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(() => getItem(DISMISS_KEY, {}));

  const banner = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    return announcements.find(a => {
      if (a.expiresAt && a.expiresAt < now) return false;
      const d = dismissed[a.id];
      if (d && d >= a.revision && a.severity !== 'critical') return false;
      return true;
    });
  }, [dismissed]);

  if (!banner) return null;

  const handleDismiss = () => {
    if (banner.severity === 'critical') return;
    const next = { ...dismissed, [banner.id]: banner.revision };
    setDismissed(next);
    setItem(DISMISS_KEY, next);
  };

  const severityClass = `banner-${banner.severity}`;

  return (
    <div className={`announcement-banner ${severityClass}`} role="status">
      <span className="announcement-text">
        {banner.severity === 'critical' && <strong>⚠️ </strong>}
        {banner.message}
        {banner.link && (
          <Link to={banner.link} className="announcement-link">{banner.linkText || 'Learn more'}</Link>
        )}
      </span>
      {banner.severity !== 'critical' && (
        <button className="announcement-dismiss" onClick={handleDismiss} aria-label="Dismiss announcement">×</button>
      )}
    </div>
  );
}
