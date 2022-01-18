export const isDefined = <T>(x: T | null | undefined): x is T => x != null
