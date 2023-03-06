/**
 * Checks if a value is an object
 */
export const isObject = <T>(value: unknown): value is T =>
  typeof value === 'object' && value !== null
