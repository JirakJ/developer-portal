/**
 * Portal announcements — newest first.
 * severity: 'info' | 'warning' | 'critical'
 * Critical banners cannot be permanently dismissed.
 */
const announcements = [
  {
    id: 'v1.6.0-release',
    revision: 1,
    severity: 'info',
    message: 'Developer Portal v1.6.0 is live — catalog sorting, compare diff mode, markdown export, and smarter command palette.',
    link: '/changelog',
    linkText: 'See changelog',
    publishedAt: '2026-04-16',
    expiresAt: '2026-06-01',
  },
];

export default announcements;
