import { useState } from 'react';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    // Demo mode — replace with real GitHub OAuth when hosting behind a serverless function
    const demoUser = {
      login: 'JirakJ',
      name: 'Ing. Jakub Jirák',
      avatar_url: 'https://github.com/JirakJ.png',
    };
    setTimeout(() => onLogin(demoUser), 600);
  };

  return (
    <div className="login-page">
      <div className="login-bg-gradient" aria-hidden="true" />
      <div className="login-card">
        <div className="login-logo">
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#lg)"/>
            <path d="M8 18V10l3 4 3-4v8M17 10h4M19 10v8M19 14h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="lg" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#3b82f6"/></linearGradient></defs>
          </svg>
        </div>
        <h1>Developer Portal</h1>
        <p className="login-subtitle">JetBrains Plugin Suite</p>
        <p className="login-desc">Sign in to access the plugin catalog, documentation, and management tools.</p>

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <span className="login-btn-loading"><span className="loader-spinner small" /> Signing in…</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </>
          )}
        </button>

        <div className="login-footer">
          <p>Private portal · Authorized users only</p>
        </div>
      </div>
    </div>
  );
}
