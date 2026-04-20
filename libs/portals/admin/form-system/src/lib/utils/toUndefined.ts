export const toUndefined = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined
