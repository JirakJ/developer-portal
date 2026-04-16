const plugins = [
  {
    id: 28974, slug: "accessibility-compliance-helper-pro", name: "Accessibility Compliance Helper Pro",
    version: "2026.8.0", category: "Quality", pricing: "freemium",
    description: "Automated WCAG compliance checking and remediation for JetBrains IDEs. Analyzes color contrast, ARIA attributes, keyboard navigation, and generates accessibility reports.",
    features: ["WCAG 2.1 AA/AAA contrast analysis", "ARIA attribute validation", "Keyboard navigation audit", "Automated fix suggestions", "PDF compliance reports"],
    tags: ["accessibility", "wcag", "compliance"],
    icon: "♿"
  },
  {
    id: 30189, slug: "adr-companion", name: "ADR Companion",
    version: "2026.3.7", category: "Documentation", pricing: "freemium",
    description: "Architecture Decision Records management directly in your IDE. Create, browse, and link ADRs to code with full Markdown support.",
    features: ["ADR creation wizard", "Template management", "Code-to-ADR linking", "Timeline view", "Export to Markdown"],
    tags: ["architecture", "documentation", "adr"],
    icon: "📋"
  },
  {
    id: 29067, slug: "api-contract-guard", name: "Kei - API Contract Testing",
    version: "2026.3.13", category: "API", pricing: "freemium",
    description: "Contract-first API testing and validation. Ensures API implementations match OpenAPI/Swagger specifications.",
    features: ["OpenAPI 3.x validation", "Contract drift detection", "Mock server generation", "Response schema testing", "CI/CD integration"],
    tags: ["api", "testing", "openapi"],
    icon: "🛡️"
  },
  {
    id: 30376, slug: "api-first-mocking-studio", name: "API First & Mocking Studio",
    version: "2026.3.5", category: "API", pricing: "freemium",
    description: "Design APIs first, then generate mocks instantly. Full OpenAPI editor with live mock server and request validation.",
    features: ["Visual API designer", "Live mock server", "Request/response validation", "Code generation", "Team collaboration"],
    tags: ["api", "mocking", "openapi"],
    icon: "🎨"
  },
  {
    id: 30190, slug: "architecture-breadcrumbs", name: "Architecture Breadcrumbs",
    version: "2026.3.5", category: "Architecture", pricing: "freemium",
    description: "Trace and visualize architectural boundaries in your codebase. Drop breadcrumbs to mark and navigate layered architectures.",
    features: ["Layer boundary markers", "Dependency flow visualization", "Architecture rule enforcement", "Navigation breadcrumbs"],
    tags: ["architecture", "visualization"],
    icon: "🧭"
  },
  {
    id: 29042, slug: "bdd-test-automation-plugin", name: "BDD Test Automation Pro",
    version: "2026.3.5", category: "Testing", pricing: "freemium",
    description: "Professional BDD testing with Gherkin, Cucumber, and AI-powered step generation. Write behavior specs, run them as tests.",
    features: ["Gherkin editor with autocomplete", "Step definition generation", "Cucumber integration", "Test runner", "Report dashboard"],
    tags: ["bdd", "testing", "cucumber"],
    icon: "🥒"
  },
  {
    id: 30191, slug: "branch-health-dashboard", name: "Branch Health Dashboard",
    version: "2026.3.5", category: "Git", pricing: "freemium",
    description: "Monitor branch health metrics: staleness, merge conflicts, CI status, and code review progress at a glance.",
    features: ["Branch age tracking", "Conflict prediction", "CI status aggregation", "Review progress", "Stale branch cleanup"],
    tags: ["git", "branches", "health"],
    icon: "🌿"
  },
  {
    id: 30193, slug: "dead-code-drift-radar", name: "Dead Code & Drift Radar",
    version: "2026.3.5", category: "Quality", pricing: "freemium",
    description: "Detect dead code, configuration drift, and unused dependencies. Keep your codebase lean and consistent.",
    features: ["Dead code detection", "Config drift analysis", "Unused import cleanup", "Dependency audit", "Drift reports"],
    tags: ["quality", "dead-code", "cleanup"],
    icon: "📡"
  },
  {
    id: 30194, slug: "dependency-license-lens", name: "Dependency License Lens",
    version: "2026.3.5", category: "Security", pricing: "freemium",
    description: "Audit and track licenses of all project dependencies. Get alerts on incompatible or risky licenses.",
    features: ["License detection", "Compatibility matrix", "Risk assessment", "SBOM generation", "Policy enforcement"],
    tags: ["licensing", "security", "compliance"],
    icon: "🔍"
  },
  {
    id: 30195, slug: "docstring-freshness-monitor", name: "Docstring Freshness Monitor",
    version: "2026.3.5", category: "Documentation", pricing: "freemium",
    description: "Track documentation freshness. Highlights stale docstrings when code changes but documentation doesn't.",
    features: ["Staleness detection", "Change correlation", "Freshness score", "Bulk update suggestions", "CI integration"],
    tags: ["documentation", "quality"],
    icon: "📝"
  },
  {
    id: 30205, slug: "flaky-test-detector", name: "Flaky Test Detector",
    version: "2026.3.5", category: "Testing", pricing: "freemium",
    description: "Identify and quarantine flaky tests. Track test stability over time with statistical analysis.",
    features: ["Flakiness scoring", "Test history tracking", "Auto-quarantine", "Root cause hints", "Stability reports"],
    tags: ["testing", "flaky", "ci"],
    icon: "🎲"
  },
  {
    id: 30196, slug: "git-aware-dev-journal", name: "Git-Aware Dev Journal",
    version: "2026.3.5", category: "Productivity", pricing: "freemium",
    description: "Automatic development journal linked to git commits. Track what you worked on, decisions made, and time spent.",
    features: ["Auto-journal from commits", "Time tracking", "Decision log", "Weekly summaries", "Markdown export"],
    tags: ["git", "journal", "productivity"],
    icon: "📓"
  },
  {
    id: 30197, slug: "git-workflow-enforcer", name: "Git Workflow Enforcer",
    version: "2026.3.5", category: "Git", pricing: "freemium",
    description: "Enforce team git workflows: branch naming, commit message formats, merge strategies, and PR templates.",
    features: ["Branch naming rules", "Commit message validation", "Merge strategy enforcement", "PR template generation"],
    tags: ["git", "workflow", "enforcement"],
    icon: "⚙️"
  },
  {
    id: 29044, slug: "gpu-dev-accelerator-ultimate", name: "GPU Dev Accelerator Ultimate",
    version: "2026.4.1", category: "GPU", pricing: "freemium",
    description: "CUDA, Metal, and OpenCL development suite. Syntax highlighting, debugging, profiling, and kernel optimization.",
    features: ["CUDA/Metal/OpenCL support", "GPU debugger", "Kernel profiler", "Memory analyzer", "Shader compilation"],
    tags: ["gpu", "cuda", "metal"],
    icon: "🚀"
  },
  {
    id: 29045, slug: "intel-dpcpp-plugin", name: "Intel DPC++ Support",
    version: "2026.3.4", category: "GPU", pricing: "freemium",
    description: "Intel oneAPI DPC++ and SYCL development support. Code completion, diagnostics, and kernel analysis.",
    features: ["SYCL code completion", "DPC++ diagnostics", "Kernel analysis", "Device targeting", "Performance hints"],
    tags: ["intel", "sycl", "gpu"],
    icon: "💎"
  },
  {
    id: 30204, slug: "kubernetes-context-guard", name: "KubeContext Safety",
    version: "2026.3.5", category: "DevOps", pricing: "freemium",
    description: "Prevent accidental kubectl commands on production clusters. Visual context indicators and safety guards.",
    features: ["Context color coding", "Production guards", "Namespace restrictions", "Command audit log", "Team policies"],
    tags: ["kubernetes", "safety", "devops"],
    icon: "☸️"
  },
  {
    id: 30199, slug: "local-secrets-tripwire", name: "Local Secrets Tripwire",
    version: "2026.3.5", category: "Security", pricing: "freemium",
    description: "Pre-commit secret detection. Catches API keys, passwords, and tokens before they reach version control.",
    features: ["Pattern-based detection", "Custom rules", "Pre-commit hooks", "Allowlist management", "Audit reports"],
    tags: ["security", "secrets", "git"],
    icon: "🔐"
  },
  {
    id: 29050, slug: "logparser", name: "LogParser Pro",
    version: "2026.3.12", category: "DevOps", pricing: "freemium",
    description: "Advanced log parsing, filtering, and analysis directly in your IDE. Support for structured and unstructured logs.",
    features: ["Multi-format parsing", "Real-time filtering", "Pattern highlighting", "Log correlation", "Export & share"],
    tags: ["logging", "debugging", "analysis"],
    icon: "📊"
  },
  {
    id: 30266, slug: "metal-gpu-monitor-plugin", name: "Metal GPU Monitor",
    version: "2026.3.5", category: "GPU", pricing: "freemium",
    description: "Real-time Metal GPU performance monitoring. Track shader execution, memory usage, and frame times.",
    features: ["Real-time GPU metrics", "Shader profiling", "Memory tracking", "Frame time analysis", "Performance alerts"],
    tags: ["metal", "gpu", "monitoring"],
    icon: "📈"
  },
  {
    id: 29038, slug: "metal-shader-support-plugin", name: "Metal Shader Support",
    version: "2026.4.1", category: "GPU", pricing: "freemium",
    description: "Full Metal Shading Language support. Syntax highlighting, code completion, error checking, and shader preview.",
    features: ["MSL syntax highlighting", "Code completion", "Error diagnostics", "Shader preview", "Documentation lookup"],
    tags: ["metal", "shaders", "gpu"],
    icon: "✨"
  },
  {
    id: 30234, slug: "obfuscate-guard", name: "ObfuscateGuard",
    version: "2026.3.8", category: "Security", pricing: "freemium",
    description: "Code obfuscation analysis and protection verification. Ensure your obfuscation rules are effective.",
    features: ["Obfuscation rule validation", "Coverage analysis", "Deobfuscation testing", "ProGuard/R8 support", "Reports"],
    tags: ["security", "obfuscation"],
    icon: "🛡️"
  },
  {
    id: 30304, slug: "obsidian-bridge", name: "Obsidian IDE Bridge",
    version: "2026.4.1", category: "Productivity", pricing: "freemium",
    description: "Bridge between Obsidian and JetBrains IDEs. Access vaults, daily notes, and knowledge graphs from your IDE.",
    features: ["Vault browser", "Daily note creation", "Knowledge graph view", "Wiki-link navigation", "Quick search"],
    tags: ["obsidian", "notes", "productivity"],
    icon: "🌀"
  },
  {
    id: 29046, slug: "robot-framework-plugin", name: "Robot Framework Professional",
    version: "2026.3.6", category: "Testing", pricing: "freemium",
    description: "Professional Robot Framework support. Code completion, test runner, keyword library management, and reporting.",
    features: ["Keyword completion", "Test runner integration", "Library management", "Variable support", "Report viewer"],
    tags: ["robot-framework", "testing", "automation"],
    icon: "🤖"
  },
  {
    id: 30200, slug: "run-config-drift-detector", name: "Run Config Drift Detector",
    version: "2026.3.5", category: "DevOps", pricing: "freemium",
    description: "Detect drift between run configurations across team members. Ensure consistency in development environments.",
    features: ["Config comparison", "Drift alerts", "Team sync", "History tracking", "Template enforcement"],
    tags: ["configuration", "drift", "devops"],
    icon: "🔄"
  },
  {
    id: 29049, slug: "selenium-iq-plugin", name: "SeleniumIQ",
    version: "2026.3.5", category: "Testing", pricing: "freemium",
    description: "Intelligent Selenium test development. Smart locator generation, page object scaffolding, and visual testing.",
    features: ["Smart locator generation", "Page object scaffolding", "Visual regression testing", "Test recorder", "Cross-browser support"],
    tags: ["selenium", "testing", "e2e"],
    icon: "🧪"
  },
  {
    id: 30201, slug: "slow-build-hotspots", name: "Slow Build Hotspots",
    version: "2026.3.5", category: "Performance", pricing: "freemium",
    description: "Identify and fix slow build tasks. Profiling for Gradle, Maven, and other build systems.",
    features: ["Build profiling", "Task timeline", "Hotspot detection", "Optimization suggestions", "Historical trends"],
    tags: ["build", "performance", "gradle"],
    icon: "🐌"
  },
  {
    id: 29351, slug: "structurizr-plugin", name: "Structurizr DSL",
    version: "2026.4.5", category: "Architecture", pricing: "freemium",
    description: "Structurizr DSL support for C4 architecture diagrams. Edit, preview, and export architecture models.",
    features: ["DSL syntax highlighting", "Live preview", "C4 model support", "Diagram export", "Workspace management"],
    tags: ["c4", "architecture", "diagrams"],
    icon: "🏗️"
  },
  {
    id: 30202, slug: "technical-debt-accountant", name: "Technical Debt Accountant",
    version: "2026.3.5", category: "Quality", pricing: "freemium",
    description: "Track and quantify technical debt. Assign costs, prioritize repayment, and monitor debt trends over time.",
    features: ["Debt cataloging", "Cost estimation", "Priority scoring", "Trend tracking", "Sprint planning integration"],
    tags: ["tech-debt", "quality", "planning"],
    icon: "💰"
  },
  {
    id: 30203, slug: "terminal-safety-rails", name: "Terminal Safety Rails",
    version: "2026.3.5", category: "Security", pricing: "freemium",
    description: "Protect against dangerous terminal commands. Configurable safety rules for production-critical operations.",
    features: ["Command interception", "Risk scoring", "Custom rules", "Audit logging", "Team policies"],
    tags: ["terminal", "safety", "security"],
    icon: "🚧"
  },
  {
    id: 29001, slug: "vulnspeed-plugin", name: "VulnSpeed - GPU-Accelerated SAST",
    version: "2026.4.1", category: "Security", pricing: "freemium",
    description: "GPU-accelerated static application security testing. Blazing fast vulnerability scanning powered by GPU compute.",
    features: ["GPU-accelerated scanning", "OWASP Top 10 detection", "Dependency vulnerability check", "Custom rules", "CI/CD integration"],
    tags: ["security", "sast", "gpu"],
    icon: "⚡"
  },
  {
    id: 30409, slug: "zero-trust-secret-guardian", name: "Zero-Trust Enterprise Secret Guardian",
    version: "2026.3.7", category: "Security", pricing: "freemium",
    description: "Enterprise-grade zero-trust secret management. Rotate, audit, and guard secrets with military-grade policies.",
    features: ["Secret rotation", "Access audit trail", "Zero-trust policies", "Integration with vaults", "Compliance reporting"],
    tags: ["security", "secrets", "enterprise"],
    icon: "🔒"
  },
  {
    id: 29125, slug: "gherkin-buddy", name: "Gherkin Buddy",
    version: "2026.3.5", category: "Testing", pricing: "freemium",
    description: "Gherkin language support with smart completions, step matching, and feature file management.",
    features: ["Gherkin syntax support", "Step matching", "Feature file templates", "Scenario outline generation"],
    tags: ["gherkin", "bdd", "testing"],
    icon: "🤝"
  },
  {
    id: 29008, slug: "ansi-log-viewer", name: "ANSI Log Viewer",
    version: "2026.3.5", category: "DevOps", pricing: "freemium",
    description: "Render ANSI color codes in log files. View CI/CD logs with proper formatting and color support.",
    features: ["ANSI color rendering", "Log level filtering", "Search & highlight", "Large file support", "Export clean text"],
    tags: ["logging", "ansi", "devops"],
    icon: "🎨"
  }
];

export const categories = [...new Set(plugins.map(p => p.category))].sort();
export const allTags = [...new Set(plugins.flatMap(p => p.tags))].sort();
export default plugins;
