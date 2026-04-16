/**
 * Portal announcements — newest first.
 * severity: 'info' | 'warning' | 'critical'
 * Critical banners cannot be permanently dismissed.
 */
const announcements = [
  {
    id: 'v1.8.0-release',
    revision: 1,
    severity: 'info',
    message: 'Developer Portal v1.8.0 is live — release freshness insights, health threshold policies, degraded-only workflow, and accurate semantic version sorting.',
    link: '/changelog',
    linkText: 'See changelog',
    publishedAt: '2026-04-16',
    expiresAt: '2026-07-01',
  },
];

export default announcements;
