import { HeadersInit, Response } from '../nodeFetch'
import { CachePolicyInternal } from './types'

export class CacheResponse {
  private innerResponse?: Response
  public policy!: CachePolicyInternal
  private cachedBody?: string

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

  async getResponse(): Promise<Response> {
    if (this.innerResponse) {
      if (this.cachedBody !== undefined) {
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

    if (this.policy && this.cachedBody !== undefined) {
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
