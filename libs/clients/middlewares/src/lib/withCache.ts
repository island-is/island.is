import CachePolicy from 'http-cache-semantics'
import { Cache } from 'cache-manager'
import { Logger } from '@island.is/logging'

import { FetchAPI, Headers, HeadersInit, Request, Response } from './nodeFetch'

const DEBUG_NAMES = (process.env.ENHANCED_FETCH_DEBUG_CACHE ?? '')
  .split(',')
  .filter((a) => a)

/**
 * UPGRADE WARNING
 * We need to access Cache Policy internals to implement our cache (same as
 * apollo-rest-datasource does). Should review when upgrading
 * `http-cache-semantics`.
 */
interface CachePolicyInternal extends CachePolicy {
  _status: number
  _url?: string
  _isShared: boolean
  age(): number
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
   * By default, this override only applies to non-500 GET responses. You
   * can change this behaviour by changing the `overrideForAllMethods` and
   * `overrideForErrors` flags below.
   */
  overrideCacheControl?:
    | string
    | ((request: Request, response: Response) => string)

  /**
   * Override cache control for all request methods. Defaults to false.
   */
  overrideForAllMethods?: boolean

  /**
   * Override cache control for 500 error responses. Defaults to false.
   */
  overrideForErrors?: boolean
}

export interface CacheMiddlewareConfig extends CacheConfig {
  name: string
  fetch: FetchAPI
  logger: Logger
}

export function withCache({
  name,
  fetch,
  logger,
  cacheKey: userCacheKey = (request) => request.url,
  shared = true,
  overrideCacheControl,
  overrideForAllMethods = false,
  overrideForErrors = false,
  cacheManager,
}: CacheMiddlewareConfig): FetchAPI {
  const sharedFor = typeof shared === 'function' ? shared : () => shared
  const debug = DEBUG_NAMES.includes('*') || DEBUG_NAMES.includes(name)

  const cacheKeyFor = (request: Request, isShared: boolean) => {
    const parts = [
      'fetch',
      name,
      request.method ?? 'GET',
      isShared ? '' : request.auth?.nationalId,
      userCacheKey(request),
    ]
    return parts.join(':')
  }

  function debugLog(message: string, { policy }: CacheResponse) {
    if (debug) {
      logger.info(`Fetch cache (${name}): ${message} - ${policy._url}`, {
        url: policy._url,
        status: policy._status,
        storable: policy.storable(),
        ttl: Math.round(policy.timeToLive() / 1000),
        shared: policy._isShared,
        cacheControl: policy._resHeaders['cache-control'],
      })
    }
  }

  async function maybeStoreResponse(
    cacheKey: string,
    cacheResponse: CacheResponse,
  ): Promise<void> {
    if (
      // Respect standard HTTP cache semantics
      !cacheResponse.policy.storable()
    ) {
      debugLog('Not storing', cacheResponse)
      return
    }

    const ttl = Math.round(cacheResponse.policy.timeToLive() / 1000)
    if (ttl <= 0) {
      debugLog('Not storing', cacheResponse)
      return
    }

    const body = await cacheResponse.text()
    const entry = JSON.stringify({
      policy: cacheResponse.policy.toObject(),
      body,
    })

    debugLog('Storing', cacheResponse)
    await cacheManager.set(cacheKey, entry, {
      ttl,
    })
  }

  function policyRequestFrom(request: Request) {
    return {
      url: request.url,
      method: request.method,
      headers: headersToObject(request.headers),
    }
  }

  function policyResponseFrom(response: Response, request: Request) {
    const headers = headersToObject(response.headers)

    if (
      overrideCacheControl &&
      (request.method === 'GET' || overrideForAllMethods) &&
      (response.status < 500 || overrideForErrors)
    ) {
      const cacheControl =
        typeof overrideCacheControl !== 'function'
          ? overrideCacheControl
          : overrideCacheControl(request, response)
      if (cacheControl) {
        headers['cache-control'] = cacheControl
      }
    }

    return {
      status: response.status,
      headers,
    }
  }

  /**
   * Check if there's an update on the server.
   */
  async function revalidate(
    cacheKey: string,
    request: Request,
    cacheResponse: CacheResponse,
  ): Promise<CacheResponse> {
    const revalidationRequest = new Request(request, {
      headers: cacheResponse.policy.revalidationHeaders(
        policyRequestFrom(request),
      ) as HeadersInit,
    })

    let revalidationResponse: Response
    try {
      revalidationResponse = await fetch(revalidationRequest)
    } catch (fetchError) {
      if (cacheResponse.policy._useStaleIfError()) {
        debugLog('Revalidate error, return stale', cacheResponse)
        return cacheResponse
      }
      throw fetchError
    }

    const {
      modified,
      policy: revalidatedPolicy,
    } = cacheResponse.policy.revalidatedPolicy(
      policyRequestFrom(revalidationRequest),
      policyResponseFrom(revalidationResponse, revalidationRequest),
    )

    // Is the response body different from what we already have in the cache?
    if (modified) {
      debugLog('Revalidate miss', cacheResponse)
      cacheResponse = CacheResponse.fromResponse(
        revalidationResponse,
        revalidatedPolicy,
      )
    } else {
      debugLog('Revalidate hit', cacheResponse)
      cacheResponse.policy = revalidatedPolicy
    }

    await maybeStoreResponse(cacheKey, cacheResponse)
    return cacheResponse
  }

  function logStaleWhileRevalidateError(
    policy: CachePolicyInternal,
    error: Error,
  ) {
    logger.error(
      `Fetch stale-while-revalidate failure (${name}): ${error.message}`,
      {
        url: policy._url,
        stack: error.stack,
      },
    )
  }

  return async (input, init) => {
    const request = new Request(input, init)

    const isShared = sharedFor(request)
    if (!isShared && !request.auth?.nationalId) {
      logger.warn(
        `Fetch (${name}): Skipped cache since User authentication is missing for private cache. Either configure cache to be shared or pass a valid User authentication to enhanced fetch.`,
      )
      return fetch(request)
    }

    const cacheKey = cacheKeyFor(request, isShared)
    const entry = await cacheManager.get<string>(cacheKey)

    if (!entry) {
      const response = await fetch(request)
      const policy = new CachePolicy(
        policyRequestFrom(request),
        policyResponseFrom(response, request),
        {
          shared: isShared,
        },
      ) as CachePolicyInternal
      const cacheResponse = CacheResponse.fromResponse(response, policy)

      debugLog('Miss', cacheResponse)
      await maybeStoreResponse(cacheKey, cacheResponse)

      return cacheResponse.getResponse()
    }

    const { policy: policyRaw, body } = JSON.parse(entry)
    let cacheResponse = CacheResponse.fromCache(
      body,
      CachePolicy.fromObject(policyRaw) as CachePolicyInternal,
    )

    const satisfied = cacheResponse.policy.satisfiesWithoutRevalidation(
      policyRequestFrom(request),
    )

    if (!satisfied) {
      // Cache does not satisfy request. Need to revalidate.
      if (cacheResponse.policy.useStaleWhileRevalidate()) {
        // Well actually, in this case it's fine to return the stale response.
        // But we'll update the cache in the background.
        debugLog('Stale while revalidate', cacheResponse)
        revalidate(cacheKey, request, cacheResponse).catch(
          logStaleWhileRevalidateError.bind(null, cacheResponse.policy),
        )
      } else {
        // Revalidate before returning a response.
        debugLog('Revalidate', cacheResponse)
        cacheResponse = await revalidate(cacheKey, request, cacheResponse)
      }
    } else {
      debugLog('Hit', cacheResponse)
    }

    return cacheResponse.getResponse()
  }
}

function headersToObject(headers: Headers) {
  const object = Object.create(null)
  for (const [name, value] of headers) {
    object[name] = value
  }
  return object
}

class CacheResponse {
  private innerResponse?: Response
  public policy!: CachePolicyInternal
  private cachedBody?: string

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async text(): Promise<string> {
    if (!this.cachedBody) {
      if (!this.innerResponse) {
        throw new Error('Illegal CacheResponse')
      }

      this.cachedBody = await this.innerResponse.text()
    }
    return this.cachedBody
  }

  async getResponse(): Promise<Response> {
    if (this.innerResponse) {
      if (this.cachedBody) {
        // We have to clone the response before returning it because the body
        // can only be used once.
        // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
        // response.clone() but create a new response from the consumed body.
        return new Response(this.cachedBody, {
          url: this.innerResponse.url,
          status: this.innerResponse.status,
          statusText: this.innerResponse.statusText,
          headers: this.innerResponse.headers,
        })
      } else {
        return this.innerResponse
      }
    }

    if (this.policy && this.cachedBody) {
      // Create response based on cache policy.
      return new Response(this.cachedBody, {
        url: this.policy._url,
        status: this.policy._status,
        headers: this.policy.responseHeaders() as HeadersInit,
      })
    }

    throw new Error('Illegal CacheResponse')
  }

  static fromResponse(response: Response, policy: CachePolicyInternal) {
    const cacheResponse = new CacheResponse()
    cacheResponse.innerResponse = response
    cacheResponse.policy = policy
    return cacheResponse
  }

  static fromCache(body: string, policy: CachePolicyInternal) {
    const cacheResponse = new CacheResponse()
    cacheResponse.policy = policy
    cacheResponse.cachedBody = body
    return cacheResponse
  }
}
