export const toRskValue = <T extends string, V>(
  value: T | undefined,
  table: Record<T, V>,
): V | undefined => (value === undefined ? undefined : table[value])

// `keyof` over a union yields only shared keys; this distributes to get all.
export type AllKeys<T> = T extends unknown ? keyof T : never
