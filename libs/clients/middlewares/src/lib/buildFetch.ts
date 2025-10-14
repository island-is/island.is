import {
  Request as NodeFetchRequest,
  Headers as NodeFetchHeaders,
} from 'node-fetch'
import {
  FetchAPI as NodeFetchAPI,
  RequestInit,
  MiddlewareAPI,
  RequestInfo,
  Request,
} from './nodeFetch'
import { EnhancedFetchAPI, AuthSource } from './types'
import { Readable } from 'stream'

export function buildFetch(actualFetch: NodeFetchAPI, authSource?: AuthSource) {
  let nextMiddleware: MiddlewareAPI = actualFetch
  const result = {
    getFetch(): EnhancedFetchAPI {
      const firstMiddleware = nextMiddleware

      // Maps between DOM fetch API types and Node Fetch API types.
      return async (input, init?) => {
        // Normalize Request.
        const request = new Request(
          input as RequestInfo,
          init as RequestInit,
          authSource,
        )
        const response = firstMiddleware(request)
        return response as unknown as Promise<Response>
      }
    },

    wrap<T extends { fetch: MiddlewareAPI }>(
      createFetch: (options: T) => MiddlewareAPI,
      options: Omit<T, 'fetch'>,
    ) {
      nextMiddleware = createFetch({ ...options, fetch: nextMiddleware } as T)
      return result
    },
  }
  return result
}
