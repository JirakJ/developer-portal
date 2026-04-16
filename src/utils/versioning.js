const VERSION_PATTERN = /^(\d{4})\.(\d{1,2})\.(\d+)$/;

function parsePart(value) {
  const num = Number.parseInt(value, 10);
  return Number.isFinite(num) ? num : null;
}

export function parseVersion(version) {
  if (typeof version !== 'string') return null;
  const match = version.match(VERSION_PATTERN);
  if (!match) return null;
  const year = parsePart(match[1]);
  const month = parsePart(match[2]);
  const release = parsePart(match[3]);
  if (year == null || month == null || release == null) return null;
  if (month < 1 || month > 12 || release < 0) return null;
  return { year, month, release };
}

export function compareVersions(a, b) {
  const parsedA = parseVersion(a);
  const parsedB = parseVersion(b);

  if (parsedA && parsedB) {
    if (parsedA.year !== parsedB.year) return parsedA.year - parsedB.year;
    if (parsedA.month !== parsedB.month) return parsedA.month - parsedB.month;
    return parsedA.release - parsedB.release;
  }

  if (parsedA && !parsedB) return 1;
  if (!parsedA && parsedB) return -1;

  return String(a ?? '').localeCompare(String(b ?? ''), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function getVersionAgeInMonths(version, now = new Date()) {
  const parsed = parseVersion(version);
  if (!parsed) return null;
  const currentIndex = now.getFullYear() * 12 + now.getMonth();
  const versionIndex = parsed.year * 12 + (parsed.month - 1);
  return Math.max(0, currentIndex - versionIndex);
}

export function getReleaseFreshness(version, now = new Date()) {
  const ageMonths = getVersionAgeInMonths(version, now);
  if (ageMonths == null) return { key: 'unknown', label: 'Unknown', ageMonths: null };
  if (ageMonths <= 2) return { key: 'fresh', label: 'Fresh', ageMonths };
  if (ageMonths <= 5) return { key: 'aging', label: 'Aging', ageMonths };
  return { key: 'stale', label: 'Stale', ageMonths };
}
