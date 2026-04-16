/**
 * Portal announcements — newest first.
 * severity: 'info' | 'warning' | 'critical'
 * Critical banners cannot be permanently dismissed.
 */
const announcements = [
  {
    id: 'v1.4.0-release',
    revision: 1,
    severity: 'info',
    message: 'Developer Portal v1.4.0 is live — column filters, share links, print mode, and more!',
    link: '/changelog',
    linkText: 'See changelog',
    publishedAt: '2026-02-01',
    expiresAt: '2026-04-01',
  },
];

export default announcements;
