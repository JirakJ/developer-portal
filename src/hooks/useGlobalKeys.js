import { useEffect } from 'react';

function isInputFocused() {
  const tag = document.activeElement?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
    document.activeElement?.isContentEditable;
}

/**
 * Registers global keyboard shortcuts. Each entry maps a key to a handler config.
 * Handlers only fire outside inputs unless `ignoreInput: true`.
 */
export default function useGlobalKeys(keyMap) {
  useEffect(() => {
    function onKeyDown(e) {
      for (const [key, opts] of Object.entries(keyMap)) {
        if (e.key !== key) continue;
        if (opts.ctrl && !e.ctrlKey && !e.metaKey) continue;
        if (opts.meta && !e.metaKey) continue;
        if (!opts.ignoreInput && isInputFocused()) continue;
        e.preventDefault();
        opts.handler(e);
        return;
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [keyMap]);
}
