const changelog = [
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
