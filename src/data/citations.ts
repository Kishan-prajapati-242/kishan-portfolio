// CONTENT.md section 6, "Citation counts, the single source".
//
// Per paper only. There is deliberately no total and no h-index: a total of 7
// next to a Scholar link that displays 6 is a contradiction a reader can check
// in one click, and Scholar's own totals move on their own.
//
// Green Web 3.0 is 3 by Kishan's call. Scholar currently displays 2; it
// previously displayed 3, and this is a known Scholar indexing fluctuation
// that usually reverts. Do not change it to 2 without asking him.
//
// To refresh: edit this file and the table in CONTENT.md section 6. Those are
// the only two places a count exists.

export const SCHOLAR_PROFILE = 'https://scholar.google.com/citations?user=AqL9YRcAAAAJ';

/** The month the counts were read, shown next to every one of them. */
export const CITATIONS_READ = 'August 2026';

/** Keyed by DOI, because that is the one identifier a paper cannot lose. */
export const CITATIONS: Record<string, number> = {
  '10.1007/978-981-95-2872-1_7': 2,
  '10.1007/978-981-96-1264-2_23': 2,
  '10.1051/itmconf/20246503015': 3,
};

/** Undefined for anything unpublished, which renders nothing rather than a 0. */
export function citationsFor(doi?: string): number | undefined {
  if (!doi) return undefined;
  const key = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '');
  return CITATIONS[key];
}
