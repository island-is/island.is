export type ExcludesFalse = <T>(
  x: T | null | undefined | false | '' | 0,
) => x is T
