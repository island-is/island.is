export const isString = <T = unknown>(str: T | string): str is string =>
  typeof str === 'string'
