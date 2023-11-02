import CachePolicy from 'http-cache-semantics'

import {
  Headers,
  HeadersInit,
  MiddlewareAPI,
  Request,
  Response,
} from '../nodeFetch'
import { FetchError } from '../FetchError'
import { CacheEntry, CacheMiddlewareConfig, CachePolicyInternal } from './types'
import { CacheResponse } from './CacheResponse'

const DEBUG_NAMES = (process.env.ENHANCED_FETCH_DEBUG_CACHE ?? '')
  .split(',')
  .filter((a) => a)

export function withCache({
  name,
  fetch,
  logger,
  cacheKey: userCacheKey = defaultCacheKey,
  shared = true,
  overrideCacheControl,
  overrideForPost = false,
  cacheManager,
}: CacheMiddlewareConfig): MiddlewareAPI {
  const sharedFor = typeof shared === 'function' ? shared : () => shared
  const overrideCacheControlFor =
    typeof overrideCacheControl === 'function'
      ? overrideCacheControl
      : () => overrideCacheControl
  const debug = DEBUG_NAMES.includes('*') || DEBUG_NAMES.includes(name)

  const fetchWithCache: MiddlewareAPI = async (request) => {
    const isShared = sharedFor(request)
    if (!isShared && !request.auth?.nationalId) {
      logger.warn(
        `Fetch (${name}): Skipped cache since User authentication is missing for private cache. Either configure cache to be shared or pass a valid User authentication to enhanced fetch.`,
      )
      return fetch(request)
    }

    const cacheKey = cacheKeyFor(request, isShared)
    const entry = await cacheManager.get<CacheEntry>(cacheKey)

    if (!entry) {
      const response = await fetch(request).catch(handleFetchErrors)
      const policy = new CachePolicy(
        policyRequestFrom(request),
        policyResponseFrom(
          response,
          request,
          await getCacheControl(request, response),
        ),
        {
          shared: isShared,
        },
      ) as CachePolicyInternal
      const cacheResponse = CacheResponse.fromServerResponse(response, policy)

      cacheResponse.cacheStatus.fwd = 'miss'
      debugLog('Miss', cacheResponse)
      await maybeStoreResponse(cacheKey, cacheResponse)

      return cacheResponse.getResponse()
    }

    const { policy: policyRaw, body } = entry
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
        cacheResponse.cacheStatus.hit = true
        debugLog('Stale while revalidate', cacheResponse)
        revalidate(cacheKey, request, cacheResponse).catch((error) =>
          logStaleWhileRevalidateError(cacheResponse.policy, error),
        )
      } else {
        // Revalidate before returning a response.
        debugLog('Revalidate', cacheResponse)
        cacheResponse = await revalidate(cacheKey, request, cacheResponse)
      }
    } else {
      cacheResponse.cacheStatus.hit = true
      debugLog('Hit', cacheResponse)
    }

    return cacheResponse.getResponse()
  }

  function handleFetchErrors(error: Error): Response {
    if (error instanceof FetchError) {
      return error.response
    }
    throw error
  }

  /**
   * Construct a cache key for the specified request.
   */
  function cacheKeyFor(request: Request, isShared: boolean) {
    const parts = [
      'fetch',
      name,
      request.method ?? 'GET',
      isShared ? '*' : request.auth?.nationalId,
      userCacheKey(request),
    ]
    return parts.join(':')
  }

  /**
   * Gets the cache control for a response.
   */
  async function getCacheControl(
    request: Request,
    response: Response,
  ): Promise<string | undefined> {
    let cacheControl: string | undefined
    if (request.method === 'GET' || overrideForPost) {
      cacheControl = await overrideCacheControlFor(request, response)
    }
    return cacheControl ?? response.headers.get('cache-control') ?? undefined
  }

  /**
   * Check if we should store a response in the cache, and store it if we should.
   */
  async function maybeStoreResponse(
    cacheKey: string,
    cacheResponse: CacheResponse,
  ): Promise<void> {
    if (
      // Respect standard HTTP cache semantics
      !cacheResponse.policy.storable()
    ) {
      cacheResponse.cacheStatus.stored = false
      debugLog('Not storing', cacheResponse)
      return
    }

    const ttl = cacheResponse.policy.timeToLive()
    if (ttl <= 0) {
      cacheResponse.cacheStatus.stored = false
      debugLog('Not storing', cacheResponse)
      return
    }

    const body = await cacheResponse.text()
    const entry = {
      policy: cacheResponse.policy.toObject(),
      body,
    }

    cacheResponse.cacheStatus.stored = true
    debugLog('Storing', cacheResponse)
    await cacheManager.set(cacheKey, entry, ttl)
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
      if (fetchError instanceof FetchError && fetchError.status === 304) {
        revalidationResponse = fetchError.response
      } else if (cacheResponse.policy._useStaleIfError()) {
        cacheResponse.cacheStatus.hit = true
        debugLog('Revalidate error, return stale', cacheResponse)
        return cacheResponse
      } else {
        throw fetchError
      }
    }

    const { modified, policy: revalidatedPolicy } =
      cacheResponse.policy.revalidatedPolicy(
        policyRequestFrom(revalidationRequest),
        policyResponseFrom(
          revalidationResponse,
          revalidationRequest,
          await getCacheControl(revalidationRequest, revalidationResponse),
        ),
      )

    // Working around a bug where the revalidated policy does not inherit the
    // parent's _isShared value.
    revalidatedPolicy._isShared = cacheResponse.policy._isShared

    // Update cache response.
    cacheResponse.cacheStatus.fwd = 'stale'
    cacheResponse.policy = revalidatedPolicy

    // Is the response body different from what we already have in the cache?
    if (modified) {
      cacheResponse.setResponse(revalidationResponse)
      debugLog('Revalidate miss', cacheResponse)
    } else {
      cacheResponse.cacheStatus.fwdStatus = revalidationResponse.status
      debugLog('Revalidate hit', cacheResponse)
    }

    await maybeStoreResponse(cacheKey, cacheResponse)
    return cacheResponse
  }

  function debugLog(message: string, cacheResponse: CacheResponse) {
    if (debug) {
      const { policy } = cacheResponse
      logger.info(`Fetch cache (${name}): ${message} - ${policy._url}`, {
        url: policy._url,
        status: policy._status,
        shared: policy._isShared,
        cacheControl: policy._resHeaders['cache-control'],
        cacheStatus: cacheResponse.getCacheStatus(),
      })
    }
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

  return fetchWithCache
}

function defaultCacheKey(request: Request) {
  // Here we trim the origin and the protocol from the URL to clean up cache
  // keys and increase cache hits in environments where the same API is routed
  // in different ways.
  // To avoid cache collisions, we additionally prefixed the cache key with the
  // Enhanced Cache name.
  const url = new URL(request.url)
  return `${url.pathname}${url.search}`
}

/**
 * Create a cache key that includes a header value based on a header name if header is present.
 *
 * This is required for clients that are using cache and the URL contains a static placeholder
 * for the resource identifier, e.g. /users/.national-id where the actual resource identifier is
 * passed in a header.
 */
export function defaultCacheKeyWithHeader(header: string) {
  return (request: Request) => {
    const cacheKey = defaultCacheKey(request)
    const paramHeader = request.headers.get(header)
    return paramHeader ? `${cacheKey}#${paramHeader}` : cacheKey
  }
}

function headersToObject(headers: Headers) {
  const object = Object.create(null)
  for (const [name, value] of headers) {
    object[name] = value
  }
  return object
}

/**
 * Transform fetch request to something http-cache-semantics understands.
 */
function policyRequestFrom(request: Request) {
  return {
    url: request.url,
    method: request.method,
    headers: headersToObject(request.headers),
  }
}

/**
 * Transform fetch response to something http-cache-semantics understands.
 */
function policyResponseFrom(
  response: Response,
  request: Request,
  cacheControl?: string,
) {
  const headers = headersToObject(response.headers)

  if (cacheControl) {
    headers['cache-control'] = cacheControl
  }

  return {
    status: response.status,
    headers,
  }
}
