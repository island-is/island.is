/**
 * Creates a function that can generate a BFF URLs based on the environment.
 * @usage
 * const bffBaseUrl = createBffUrlGenerator('/stjornbord)
 * const userUrl = bffBaseUrl('/user')
 */
export const createBffUrlGenerator = (basePath: string) => {
  // Trim any leading and trailing slashes from the basePath to avoid extra slashes
  const sanitizedBasePath = sanitizePath(basePath)
  const origin =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3333' // When developing against the BFF locally, use localhost
      : sanitizePath(window.location.origin) // Use current window origin for production

  const baseUrl = `${origin}/${sanitizedBasePath}/bff`

  return (relativePath = '') => `${baseUrl}${relativePath}`
}

/**
 * Trim any leading and trailing slashes
 */
const sanitizePath = (path: string) => path.replace(/^\/+|\/+$/g, '')

export const createQueryStr = (params: Record<string, string>) => {
  return new URLSearchParams(params).toString()
}
