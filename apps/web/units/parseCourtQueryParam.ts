/**
 * Parses `court` / `districtCourts` (and similar) from Next.js `query`:
 * supports a single value, comma-separated values, and repeated keys.
 */
export function parseCommaSeparatedListFromQuery(
  value: string | string[] | undefined,
): string[] {
  if (value === undefined) return []
  const joined = Array.isArray(value) ? value.join(',') : value
  if (!joined) return []
  return joined
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
