import { Cache } from 'cache-manager'
import CachePolicy from 'http-cache-semantics'
import { Logger } from '@island.is/logging'
import { DogStatsD } from '@island.is/infra-metrics'

import { FetchAPI, Request, Response } from '../nodeFetch'

/**
 * UPGRADE WARNING
 * We need to access Cache Policy internals to implement our cache (same as
 * apollo-rest-datasource does). Should review when upgrading
 * `http-cache-semantics`.
 */
export interface CachePolicyInternal extends CachePolicy {
  _status: number
  _url?: string
  _isShared: boolean

  age(): number
  maxAge(): number

  _resHeaders: Record<string, string>

  // eslint-disable-next-line @typescript-eslint/naming-convention
  _useStaleIfError(): boolean

  useStaleWhileRevalidate(): boolean

  revalidatedPolicy(
    revalidationRequest: CachePolicy.Request,
    revalidationResponse?: CachePolicy.Response,
  ): CachePolicy.RevalidationPolicy & { policy: CachePolicyInternal }
}

export interface CacheConfig {
  /**
   * Cache to store responses in.
   */
  cacheManager: Cache

  /**
   * Provides a way to override the cache key for each request. Defaults to `request.url`.
   * The final cache keys have additional prefixes depending on the `shared` configuration:
   *
   *   shared: true - `fetch:{fetch name}:{request method}::{cacheKey}`
   *   shared: false - `fetch:{fetch name}:{request method}:{user.nationalId}:{cacheKey}`
   */
  cacheKey?: (request: Request) => string

  /**
   * Configures if the cache should be shared between all users or if each user should
   * have their own private cache. Can be customized for each request.
   *
   * Defaults to `true`. If you set this to `false`, you need to pass a `User` object
   * as an authentication to enhancedFetch:
   *
   * ```ts
   * const fetch = createEnhancedFetch({ cache: { cacheManager, shared: false } })
   * fetch('/private-data', { auth: currentUser })
   * ```
   */
  shared?: boolean | ((request: Request) => boolean)

  /**
   * This cache works using standard http cache-control semantics. When calling APIs
   * which don't return practical cache-control headers you can override the response
   * header. Note that it only affects behaviour in this cache, it does not modify
   * the final response.
   *
   * You should generally use the `buildCacheControl` utility for this:
   *
   * ```ts
   * const fetch = createEnhancedFetch({
   *   cache: {
   *     cacheManager,
   *     overrideCacheControl: buildCacheControl({
   *       maxAge: 60, // seconds
   *     })
   *   }
   * }
   * ```
   *
   * By default, this override only applies to GET responses. You can change
   * override POST requests as well by setting `overrideForPost: true`.
   */
  overrideCacheControl?:
    | string
    | ((
        request: Request,
        response: Response,
      ) => undefined | string | Promise<undefined | string>)

  /**
   * Override cache control for post request methods. Defaults to false.
   */
  overrideForPost?: boolean
}

export interface CacheMiddlewareConfig extends CacheConfig {
  name: string
  fetch: FetchAPI
  logger: Logger
}

export interface CacheEntry {
  body: string
  policy: CachePolicy.CachePolicyObject
}
