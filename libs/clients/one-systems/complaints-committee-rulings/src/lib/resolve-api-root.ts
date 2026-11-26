const DEFAULT_API_PATH = '/OneRulings'

const hasPath = (basePath: string): boolean => {
  try {
    return new URL(basePath).pathname !== '/'
  } catch {
    return false
  }
}

/**
 * Resolves the root URL of the rulings API from the configured base path.
 *
 * One Systems hosts the API under different paths per instance, so a base
 * path that already contains a path is used as is. A bare origin gets the
 * default path appended, which keeps existing configuration working.
 */
export const resolveApiRoot = (basePath: string): string => {
  const trimmed = basePath.trim().replace(/\/+$/, '')
  return hasPath(trimmed) ? trimmed : `${trimmed}${DEFAULT_API_PATH}`
}
