/* Deterministic code-unit ordering is part of the contract boundary, not a
 * general-purpose utility, which is why this lives beside the contracts rather
 * than in `utils`. It is the single comparator for input fields, output fields
 * and array `itemFields`; `localeCompare` and `sortAlpha` are deliberately not
 * used here. See DESIGN.md, Field Ordering. */
export const byName = <T extends { name: string }>(a: T, b: T): number =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
