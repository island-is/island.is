import { BffUser } from '@island.is/shared/types'

/**
 * Creates a function that can generate a BFF URLs.
 *
 * @usage
 * const bffBaseUrl = createBffUrlGenerator('/myapplication/bff')
 * const userUrl = bffBaseUrl('/user') // http://localhost:3010/myapplication/bff/user
 * const userUrlWithParams = bffBaseUrl('/user', { id: '123' }) // http://localhost:3010/myapplication/bff/user?id=123
 */
export const createBffUrlGenerator = (bffGlobalPrefix: string) => {
  const baseUrl = `${window.location.origin}/${sanitizePath(bffGlobalPrefix)}`

  return (relativePath = '', params?: Record<string, string>) => {
    const url = `${baseUrl}${relativePath}`

    if (params) {
      const qs = createQueryStr(params)

      return `${url}${qs ? `?${qs}` : ''}`
    }

    return url
  }
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

/**
 *  This method checks if the user has a new session
 */
export const isNewSession = (oldUser: BffUser, newUser: BffUser) => {
  const oldSid = oldUser.profile.sid
  const newSid = newUser.profile.sid

  return oldSid && newSid && oldSid !== newSid
}
