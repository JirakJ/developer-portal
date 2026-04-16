import { useState, useEffect, useRef } from 'react';

/**
 * Thin NProgress-style loading bar, shown after a 200ms delay to avoid flicker.
 */
export default function ProgressBar() {
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer.current);
  }, []);

  if (!visible) return null;

  return (
    <div className="progress-bar" role="progressbar" aria-label="Loading">
      <div className="progress-bar-indicator" />
    </div>
  );
}
