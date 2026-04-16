export const DEFAULT_UPTIME_DAYS = 30;
export const DEFAULT_FAILURE_RATE = 0.015;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildSeed(slug) {
  return String(slug || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export function generateUptime(slug, days = DEFAULT_UPTIME_DAYS, failureRate = DEFAULT_FAILURE_RATE) {
  const rng = seededRandom(buildSeed(slug));
  const states = [];
  for (let i = 0; i < days; i += 1) {
    states.push(rng() > failureRate ? 1 : 0);
  }
  const success = states.filter(d => d === 1).length;
  const pct = (success / Math.max(1, days) * 100).toFixed(1);
  return { days: states, pct };
}

export function generatePortfolioUptime(pluginList, days = DEFAULT_UPTIME_DAYS, failureRate = DEFAULT_FAILURE_RATE) {
  const map = {};
  (pluginList || []).forEach(plugin => {
    map[plugin.slug] = generateUptime(plugin.slug, days, failureRate);
  });
  return map;
}

export function isUptimeDegraded(pct, threshold) {
  return Number.parseFloat(pct) < threshold;
}
