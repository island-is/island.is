/**
 * Here's the cache policy for most un-authenticated content on island.is:
 *
 * - GraphQL API - Redis 300 seconds
 * - GraphQL API - CDN 30-300 seconds
 * - Website - CDN 30-300 seconds
 *
 * The CDN caches content for 30 seconds. After that they'll continue to serve up to 300 second old content
 * while revalidating in the background. The next request/user gets a fresher response.
 *
 * To invalidate the Redis cache, visit any (web) page with a special `?bypass-cache=secret` query parameter. The secret
 * must match the one configured in the GraphQL API environment variable.
 */

export const CACHE_CONTROL_MAX_AGE = 300
export const CACHE_CONTROL_MAX_AGE_SHARED = CACHE_CONTROL_MAX_AGE / 10
export const CACHE_CONTROL_STALE_WHILE_REVALIDATE = CACHE_CONTROL_MAX_AGE
export const CACHE_CONTROL_HEADER = `s-maxage=${CACHE_CONTROL_MAX_AGE_SHARED}, stale-while-revalidate=${CACHE_CONTROL_STALE_WHILE_REVALIDATE}, public`
