const SCHEMA_VERSION = 1;
const PREFIX = 'dp_';

function getKey(key) {
  return `${PREFIX}${key}`;
}

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed?._v !== SCHEMA_VERSION) {
      localStorage.removeItem(getKey(key));
      return fallback;
    }
    return parsed.data;
  } catch {
    localStorage.removeItem(getKey(key));
    return fallback;
  }
}

export function setItem(key, data) {
  try {
    localStorage.setItem(getKey(key), JSON.stringify({ _v: SCHEMA_VERSION, data }));
  } catch { /* quota exceeded — silently fail */ }
}

export function removeItem(key) {
  localStorage.removeItem(getKey(key));
}
