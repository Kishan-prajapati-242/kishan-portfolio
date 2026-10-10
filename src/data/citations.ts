// Per paper only, never a total. Green Web 3.0 stays at 3 when Scholar flickers to 2.
export const SCHOLAR_PROFILE = 'https://scholar.google.com/citations?user=AqL9YRcAAAAJ';

export const CITATIONS_READ = 'August 2026';

export const CITATIONS: Record<string, number> = {
  '10.1007/978-981-95-2872-1_7': 2,
  '10.1007/978-981-96-1264-2_23': 2,
  '10.1051/itmconf/20246503015': 3,
};

// Undefined for anything unpublished, which renders nothing rather than a 0.
export function citationsFor(doi?: string): number | undefined {
  if (!doi) return undefined;
  const key = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
  return CITATIONS[key];
}
