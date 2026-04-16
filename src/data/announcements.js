/**
 * Portal announcements — newest first.
 * severity: 'info' | 'warning' | 'critical'
 * Critical banners cannot be permanently dismissed.
 */
const announcements = [
  {
    id: 'v1.7.0-release',
    revision: 1,
    severity: 'info',
    message: 'Developer Portal v1.7.0 is live — catalog bulk actions, compare feature search, install info copy, and settings backup import/export.',
    link: '/changelog',
    linkText: 'See changelog',
    publishedAt: '2026-04-16',
    expiresAt: '2026-07-01',
  },
];

export default announcements;
