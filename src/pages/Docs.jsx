export default function Docs() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>📖 Documentation</h1>
        <p>Guides, tutorials, and reference documentation for all plugins</p>
      </div>

      <div className="docs-grid">
        <div className="doc-card">
          <h3>🚀 Getting Started</h3>
          <p>Install your first plugin, configure it, and start using it in your JetBrains IDE.</p>
          <ul>
            <li>Installation guide</li>
            <li>Initial configuration</li>
            <li>IDE compatibility matrix</li>
          </ul>
        </div>

        <div className="doc-card">
          <h3>🏗️ Architecture</h3>
          <p>Understand the plugin architecture, extension points, and design patterns used across the suite.</p>
          <ul>
            <li>Plugin lifecycle</li>
            <li>IntelliJ Platform SDK overview</li>
            <li>Service & action architecture</li>
          </ul>
        </div>

        <div className="doc-card">
          <h3>🧪 Testing Guide</h3>
          <p>Learn how to write and run tests for plugins. Covers unit tests, integration tests, and UI tests.</p>
          <ul>
            <li>Test framework setup</li>
            <li>Fixture-based testing</li>
            <li>CI/CD pipeline integration</li>
          </ul>
        </div>

        <div className="doc-card">
          <h3>📦 Release Process</h3>
          <p>Step-by-step guide for building, versioning, and publishing plugins to JetBrains Marketplace.</p>
          <ul>
            <li>Version scheme (YYYY.M.release)</li>
            <li>Build & verify workflow</li>
            <li>Marketplace publishing</li>
          </ul>
        </div>

        <div className="doc-card">
          <h3>🔐 Security Practices</h3>
          <p>Security guidelines for plugin development: secret management, code signing, and vulnerability scanning.</p>
          <ul>
            <li>Secret management</li>
            <li>Dependency auditing</li>
            <li>SAST integration</li>
          </ul>
        </div>

        <div className="doc-card">
          <h3>🤝 Contributing</h3>
          <p>How to contribute to the plugin suite: coding standards, PR process, and review guidelines.</p>
          <ul>
            <li>Kotlin coding standards</li>
            <li>Branch & PR workflow</li>
            <li>Code review checklist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
