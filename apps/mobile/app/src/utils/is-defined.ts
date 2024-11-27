/**
 * Checks if value is defined, i.e. not (null | undefined)
 */
export const isDefined = <TValue>(
  value: TValue | null | undefined,
): value is TValue => value !== null && value !== undefined
