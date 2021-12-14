export interface CacheControlOptions {
  /**
   * How long (in seconds) a resource can be cached and reused without
   * revalidation (making a request to the server).
   */
  maxAge?: number

  /**
   * How long (in seconds) an authenticated resource can be cached and reused
   * without revalidation.
   */
  sharedMaxAge?: number

  /**
   * How long (in seconds) a stale resource (one who's maxAge has expired) can
   * be reused in case the origin server is down and a fresh resource is
   * unavailable.
   */
  staleIfError?: number

  /**
   * How long (in seconds) a stale resource can be reused while updating the
   * cache in the background.
   */
  staleWhileRevalidate?: number

  /**
   * Configures the resource to be public, meaning it can be shared even if
   * the request carries an authentication header.
   */
  public?: boolean

  /**
   * Resources can be stored, but they won't be served without revalidating
   * with the server.
   */
  noCache?: boolean

  /**
   * Completely disables storing of the resource.
   */
  noStore?: boolean
}

export const buildCacheControl = (
  options: CacheControlOptions = {},
): string => {
  const config: string[] = []
  if (options.public !== undefined) {
    config.push(options.public ? 'public' : 'private')
  }
  if (options.noCache) {
    config.push('no-cache')
  }
  if (options.noStore) {
    config.push('no-store')
  }
  if (options.maxAge !== undefined) {
    config.push(`max-age=${options.maxAge}`)
  }
  if (options.sharedMaxAge !== undefined) {
    config.push(`s-maxage=${options.sharedMaxAge}`)
  }
  if (options.staleIfError !== undefined) {
    config.push(`stale-if-error=${options.staleIfError}`)
  }
  if (options.staleWhileRevalidate !== undefined) {
    config.push(`stale-while-revalidate=${options.staleWhileRevalidate}`)
  }
  return config.join(', ')
}
