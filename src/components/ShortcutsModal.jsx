import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const isMac = (() => {
  try {
    return /mac/i.test(navigator.userAgentData?.platform || navigator.platform || '');
  } catch { return false; }
})();

const mod = isMac ? '⌘' : 'Ctrl';

const shortcuts = [
  { section: 'Navigation', items: [
    { keys: [`${mod}+K`], desc: 'Open search' },
    { keys: ['?'], desc: 'Show keyboard shortcuts' },
    { keys: ['Esc'], desc: 'Close modal / clear search' },
  ]},
  { section: 'Catalog', items: [
    { keys: ['G', 'then', 'H'], desc: 'Go to Home' },
    { keys: ['G', 'then', 'C'], desc: 'Go to Catalog' },
    { keys: ['G', 'then', 'D'], desc: 'Go to Docs' },
  ]},
];

export default function ShortcutsModal({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal shortcuts-modal"
        onClick={e => e.stopPropagation()}
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div className="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          {shortcuts.map(s => (
            <div key={s.section} className="shortcut-section">
              <h3>{s.section}</h3>
              {s.items.map((item, i) => (
                <div key={i} className="shortcut-row">
                  <span className="shortcut-desc">{item.desc}</span>
                  <span className="shortcut-keys">
                    {item.keys.map((k, j) =>
                      k === 'then' ? <span key={j} className="shortcut-then">then</span> : <kbd key={j}>{k}</kbd>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
