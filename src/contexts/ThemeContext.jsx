import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getItem, setItem } from '../utils/storage';

const ThemeContext = createContext(null);

const STORAGE_KEY = 'theme';
const VALID = ['dark', 'light', 'system'];

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(resolved) {
  document.documentElement.setAttribute('data-theme', resolved);
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content', resolved === 'light' ? '#f8f9fa' : '#0a0a0f'
  );
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const stored = getItem(STORAGE_KEY, 'system');
    return VALID.includes(stored) ? stored : 'system';
  });

  const resolved = useMemo(
    () => mode === 'system' ? getSystemTheme() : mode,
    [mode]
  );

  // Apply theme to DOM
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // Listen for system theme changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyTheme(getSystemTheme());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setTheme = useCallback((newMode) => {
    if (!VALID.includes(newMode)) return;
    setMode(newMode);
    setItem(STORAGE_KEY, newMode);
  }, []);

  const cycle = useCallback(() => {
    const next = { dark: 'light', light: 'system', system: 'dark' };
    setTheme(next[mode]);
  }, [mode, setTheme]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
