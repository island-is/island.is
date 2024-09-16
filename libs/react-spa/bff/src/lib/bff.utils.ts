/**
 * Creates a function that can generate a BFF URLs based on the environment.
 * @usage
 * const bffBaseUrl = createBffUrlGenerator('/myapplication)
 * const userUrl = bffBaseUrl('/user') // http://localhost:3010/myapplication/bff/user
 */
export const createBffUrlGenerator = (basePath: string) => {
  const sanitizedBasePath = sanitizePath(basePath)
  const origin =
    process.env.NODE_ENV === 'development'
      ? // When developing against the BFF locally, use localhost
        'http://localhost:3010'
      : // Use current window origin for production
        sanitizePath(window.location.origin)

  const baseUrl = `${origin}/${sanitizedBasePath}/bff`

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
