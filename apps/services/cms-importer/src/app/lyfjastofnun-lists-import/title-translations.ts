// Manual fallback for Icelandic items that have no English counterpart on
// ima.is (the Icelandic Medicines Agency's English site) at all — the
// scraper can't find these via LyfjastofnunListsRepository's cross-site
// matching, so there's no source to translate from automatically.
// Keyed by the scraped Icelandic title. English slug is derived from the
// title the same way the Icelandic slug is (see mapper.ts) — no need to
// duplicate it here.
export const TITLE_TRANSLATIONS_EN: Record<string, string> = {
  'Ávana- og fíknilyf forskriftarlyfja': 'Narcotic magistral drugs',
}
