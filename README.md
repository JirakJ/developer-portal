# Developer Portal

Internal developer portal for the JetBrains Plugin Suite — a catalog of 33+ marketplace plugins, documentation, API references, release tracking, and system health monitoring.

**Live:** [jirakj.github.io/developer-portal](https://jirakj.github.io/developer-portal/)

## Features

- 🔍 **Plugin Catalog** — Browse, search, and filter all plugins by category, pricing model, or keyword
- 📄 **Plugin Detail** — Per-plugin overview with features, tags, and marketplace links
- 📚 **Documentation Hub** — Centralized docs covering development, publishing, and architecture
- 🔗 **API Reference** — Links to JetBrains Platform SDK, Marketplace API, and internal APIs
- 📦 **Release Tracker** — Version overview across the entire plugin suite
- 🧭 **Release Freshness Insights** — Fresh/aging/stale lifecycle visibility with exportable metadata
- 💚 **System Health** — Threshold-based degraded detection, uptime sorting, and degraded incident copy report
- 🚨 **Alerts Center** — Unified stale-release and uptime incident feed with dismiss/restore workflow
- 🧯 **Alert Policy Controls** — Tune incident thresholds and escalation levels directly in Settings
- ⌨️ **Global Search** — `⌘K` / `Ctrl+K` shortcut for instant fuzzy search
- ♿ **Accessible** — Skip navigation, focus indicators, screen reader support
- 📱 **Responsive** — Full mobile layout with hamburger menu
- ⚡ **Fast** — Code-split routes, lazy loading, optimized builds

## Tech Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Framework   | React 19                        |
| Bundler     | Vite 8                          |
| Routing     | react-router-dom 7 (HashRouter) |
| Hosting     | GitHub Pages                    |
| CI/CD       | GitHub Actions                  |
| Styling     | Custom CSS (dark theme)         |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Deployment

Pushes to `main` automatically trigger a GitHub Actions workflow that builds the site and deploys to GitHub Pages.

## Project Structure

```
src/
├── components/    # Shared components (Header, Sidebar, ErrorBoundary)
├── data/          # Plugin catalog data
├── pages/         # Route pages (Home, Catalog, Docs, APIs, etc.)
├── styles/        # Global CSS design system
└── App.jsx        # Root layout, routing, auth
```

## Author

**Ing. Jakub Jirák** — [JetBrains Marketplace](https://plugins.jetbrains.com/organizations/JakubJirak)
