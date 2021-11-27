export interface CacheControlOptions {
  /**
   * How long a resource can be cached and reused without revalidation.
   */
  maxAge?: number

  /**
   * How long a resource can be cached and reused without revalidation.
   */
  sharedMaxAge?: number
  staleIfError?: number
  staleWhileRevalidate?: number
  public?: boolean
  noCache?: boolean
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
