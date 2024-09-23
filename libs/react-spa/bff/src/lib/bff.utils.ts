/**
 * Creates a function that can generate a BFF URLs.
 * @usage
 * const bffBaseUrl = createBffUrlGenerator('/stjornbord)
 * const userUrl = bffBaseUrl('/user') // http://localhost:3010/stjornbord/bff/user
 */
export const createBffUrlGenerator = (basePath: string) => {
  const sanitizedBasePath = sanitizePath(basePath)
  const baseUrl = `${window.location.origin}/${sanitizedBasePath}/bff`

  return (relativePath = '') => `${baseUrl}${relativePath}`
}

/**
 * Trim any leading and trailing slashes
 */
const sanitizePath = (path: string) => path.replace(/^\/+|\/+$/g, '')

/**
 * Creates a query string from an object
 */
export const createQueryStr = (params: Record<string, string>) => {
  return new URLSearchParams(params).toString()
}
