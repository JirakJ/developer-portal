import plugins from '../data/plugins';

/** Normalize a single tag: lowercase, trim, collapse whitespace */
export function normalizeTag(tag) {
  return tag.toLowerCase().trim().replace(/\s+/g, ' ');
}

/** Get all unique normalized tags with their counts, sorted by count desc */
export function getTagCloud() {
  const map = new Map();
  for (const p of plugins) {
    for (const t of p.tags) {
      const norm = normalizeTag(t);
      map.set(norm, (map.get(norm) || 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Find related plugins by shared tags and category, excluding a slug */
export function getRelatedPlugins(slug, limit = 4) {
  const target = plugins.find(p => p.slug === slug);
  if (!target) return [];

  const targetTags = new Set(target.tags.map(normalizeTag));

  return plugins
    .filter(p => p.slug !== slug)
    .map(p => {
      const sharedTags = p.tags.filter(t => targetTags.has(normalizeTag(t))).length;
      const sameCategory = p.category === target.category ? 1 : 0;
      // Tags weighted 2x over category
      return { plugin: p, score: sharedTags * 2 + sameCategory };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || a.plugin.name.localeCompare(b.plugin.name))
    .slice(0, limit)
    .map(r => r.plugin);
}
