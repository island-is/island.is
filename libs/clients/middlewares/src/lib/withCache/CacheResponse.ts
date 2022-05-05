import { HeadersInit, Response } from '../nodeFetch'
import { CachePolicyInternal } from './types'
import {
  CacheStatus,
  parseCacheStatusHeader,
  serializeCacheStatusHeader,
} from './CacheStatus'

const CACHE_NAME = 'EnhancedFetch'

export class CacheResponse {
  private innerResponse?: Response
  public policy!: CachePolicyInternal
  private cachedBody?: string
  public cacheStatus: CacheStatus = {
    cacheName: CACHE_NAME,
    hit: undefined,
    fwd: undefined,
    fwdStatus: undefined,
    ttl: undefined,
    stored: undefined,
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  async text(): Promise<string> {
    if (this.cachedBody === undefined) {
      if (!this.innerResponse) {
        throw new Error('Illegal CacheResponse')
      }

      this.cachedBody = await this.innerResponse.text()
    }
    return this.cachedBody
  }

  setResponse(response: Response): void {
    this.innerResponse = response
    this.cachedBody = undefined
  }

  async getResponse(): Promise<Response> {
    let response = this.innerResponse
    if (response && this.cachedBody !== undefined) {
      // We have to clone the response before returning it because the body
      // can only be used once.
      // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
      // response.clone() but create a new response from the consumed body.
      response = new Response(this.cachedBody, {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    }

    if (!response && this.policy && this.cachedBody !== undefined) {
      // Create response based on cache policy.
      response = new Response(this.cachedBody, {
        url: this.policy._url,
        status: this.policy._status,
        headers: this.policy.responseHeaders() as HeadersInit,
      })
    }

    if (!response) {
      throw new Error('Illegal CacheResponse')
    }

    this.addCacheStatusHeader(response)
    return response
  }

  getCacheStatus(): CacheStatus | undefined {
    if (this.cacheStatus.hit || this.cacheStatus.fwd) {
      // policy.timeToLive() includes stale time which should be negative in cache-status.
      this.cacheStatus.ttl =
        this.cacheStatus.hit || this.cacheStatus.stored
          ? this.policy.maxAge() - this.policy.age()
          : undefined
      return this.cacheStatus
    }
  }

  private addCacheStatusHeader(response: Response) {
    const cacheStatus = this.getCacheStatus()
    if (cacheStatus) {
      const cacheStatuses = parseCacheStatusHeader(
        response.headers.get('cache-status'),
      )
      cacheStatuses.push(cacheStatus)
      response.headers.set(
        'cache-status',
        serializeCacheStatusHeader(cacheStatuses),
      )
    }
  }

  static fromServerResponse(response: Response, policy: CachePolicyInternal) {
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
