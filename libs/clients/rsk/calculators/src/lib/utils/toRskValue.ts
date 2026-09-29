export const toRskValue = <T extends string, V>(
  value: T | undefined,
  table: Record<T, V>,
): V | undefined => (value === undefined ? undefined : table[value])
