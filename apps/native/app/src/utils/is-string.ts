export const isString = <T = any>(str: T | string): str is string =>
  typeof str === 'string'
