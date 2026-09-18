/* Deterministic code-unit ordering, shared by input, output and item fields.
 * `localeCompare` and `sortAlpha` are deliberately not used -- ordering is part
 * of the contract, so it must not vary by locale. */
export const byName = <T extends { name: string }>(a: T, b: T): number =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
