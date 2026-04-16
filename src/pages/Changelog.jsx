import Breadcrumb from '../components/Breadcrumb';

const changelog = [
  {
    version: '1.10.0',
    date: '2026-04-16',
    changes: [
      'Added configurable alert policy engine (release age thresholds and health critical delta) used across incident generation',
      'Added global critical incident banner in app shell with direct deep-link to critical alerts',
      'Upgraded Alerts Center with alert-type filters, visible bulk dismiss/restore actions, and JSON export',
      'Alerts Center now displays active policy snapshot and release/health incident split',
      'Settings now includes advanced alert policy controls with default reset workflow',
      'Sidebar alert badge now reflects severity state and updates with policy changes',
      'Command palette now includes quick navigation to critical alerts',
      'Updated release metadata and announcement for v1.10.0',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-04-16',
    changes: [
      'Added dedicated Alerts Center with severity and status filters, open/dismissed workflows, and digest copy action',
      'Added shared alerts domain model that correlates stale releases and degraded uptime incidents into one operational feed',
      'Added new Alerts navigation in sidebar and command palette, including live open-alert badges and quick clearing actions',
      'Home now includes an Operations Pulse section with deep links into active incidents and policy controls',
      'Settings now includes dismissed-alert management controls to reset hidden incidents',
      'Added shared uptime utility and reused it across health and alert intelligence surfaces',
      'Updated release metadata and announcement for v1.9.0',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-04-16',
    changes: [
      'Added shared version intelligence utilities for date-based semantic sorting across catalog, home, releases, and health views',
      'Releases page now includes Fresh/Aging/Stale filters, freshness badges, and age-in-months indicators',
      'Release exports (CSV/JSON) now include freshness metadata for portfolio reporting',
      'Health page now supports configurable SLO threshold, degraded-only filtering, uptime sorting, and degraded report copy',
      'Settings now includes Health Policy controls to manage and reset degraded uptime threshold',
      'Updated release metadata and announcement for v1.8.0',
    ],
  },
  {
    version: '1.7.0',
    date: '2026-04-16',
    changes: [
      'Added Catalog bulk selection with actions for compare and selected JSON export',
      'Catalog selection now persists in URL via sel query parameter',
      'Compare page now supports feature-row search and row count feedback',
      'Plugin detail now includes copy-install-info action with plugin metadata',
      'Settings now supports preferences backup export and JSON restore import',
      'Improved print layout exclusions for new interactive controls',
      'Updated release metadata and announcement for v1.7.0',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-04-16',
    changes: [
      'Added Catalog sorting controls (field + direction) with URL persistence',
      'Catalog presets now persist and restore sorting metadata',
      'Compare page gained Differences-only mode with URL support (?diff=1)',
      'Added Compare markdown export (copy matrix to clipboard)',
      'Command Palette now includes Favorites and Catalog Presets sections',
      'Added quick actions in Command Palette to clear recently viewed and compare shortlist',
      'Added Quick Workbench panel on Home for compare shortlist and favorites',
      'Improved sidebar and command palette behavior for cleaner navigation state handling',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-04-16',
    changes: [
      'Catalog filters are now URL-synced (search, category, tag, favorites, view mode) for shareable deep links',
      'Added Catalog saved presets with quick apply/remove actions',
      'Added comparison shortlist toggle button on plugin cards and plugin detail pages',
      'Compare page now loads from persistent shortlist and supports clear + copy-link actions',
      'Added recently viewed plugins tracking and surfaced it on Home and in the Command Palette',
      'Command Palette now highlights matched search text and includes comparison shortlist quick action',
      'Settings now includes clear actions for recently viewed items, compare shortlist, and catalog presets',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-04-16',
    changes: [
      'Added announcement banner with severity levels and dismissal persistence',
      'Added share button on plugin detail pages (Web Share API + clipboard fallback)',
      'Added column filters on Releases and Health tables',
      'Added JSON export alongside CSV on Releases page (respects active filters)',
      'Added print stylesheet for clean printed output (renders all plugin tabs)',
      'Added breadcrumb navigation on all pages',
      'Added export button group layout (CSV + JSON)',
      'Improved table empty states when filters return no results',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-04-16',
    changes: [
      'Added command palette (⌘K) with pages, plugins, and actions',
      'Added Settings page for managing portal preferences',
      'Added tabbed navigation on plugin detail pages (Overview, Features, Links, Related, Activity)',
      'Added derived activity timeline on plugin detail pages',
      'Added analytics dashboard cards (donut chart, pricing split, highlights)',
      'Added 30-day uptime bars on System Health page (simulated)',
      'Replaced inline header search with command palette trigger',
      'Settings page: theme selector, sidebar default, clear data, reset all',
      'Improved Home page with richer analytics and visual indicators',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-04-16',
    changes: [
      'Added dark/light/system theme toggle with flash-free sync',
      'Added collapsible sidebar with icon-only mode',
      'Added plugin favorites/bookmarks with persistence',
      'Added tag cloud on Home page for browsing by tag',
      'Added related plugins section on plugin detail pages',
      'Added CSV export on Releases page',
      'Added search history (last 5 recent queries)',
      'Added NProgress-style loading bar for route transitions',
      'Added favorites toggle filter in Catalog',
      'Added tag filter support in Catalog URL (?tag=X)',
      'Improved PluginCard and PluginDetail with favorite buttons',
      'Sidebar shows favorites badge count on Catalog nav item',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-04-16',
    changes: [
      'Added toast notification system',
      'Added keyboard shortcuts overlay (press ?)',
      'Added sortable table columns on Releases and Health pages',
      'Added plugin comparison page (/compare)',
      'Added copy-to-clipboard on version badges',
      'Added back-to-top floating button',
      'Added changelog page',
      'Added user preference persistence (view mode)',
      'Improved keyboard shortcut architecture with global registry',
      'Added versioned localStorage utility',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-16',
    changes: [
      'Initial production release',
      'Plugin catalog with 33 JetBrains plugins',
      'Global search with ⌘K / Ctrl+K shortcut',
      'Error boundary with chunk-error detection',
      'Skip-to-content and focus indicators',
      'Breadcrumb navigation on plugin detail',
      'Responsive mobile layout with hamburger menu',
      'Code-split lazy-loaded routes',
      'Portal footer with version and marketplace link',
      'Proper README and project metadata',
    ],
  },
];

export default function Changelog() {
  return (
    <div className="page">
      <Breadcrumb current="Changelog" />
      <div className="page-header">
        <h1>📝 Changelog</h1>
        <p>Portal version history and release notes</p>
      </div>

      <div className="changelog-list">
        {changelog.map(release => (
          <div key={release.version} className="changelog-entry">
            <div className="changelog-header">
              <span className="changelog-version">v{release.version}</span>
              <span className="changelog-date">{release.date}</span>
            </div>
            <ul className="changelog-changes">
              {release.changes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
