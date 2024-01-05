import {
  FetchAPI as NodeFetchAPI,
  Request,
  RequestInfo,
  RequestInit,
  MiddlewareAPI,
} from './nodeFetch'
import { EnhancedFetchAPI } from './types'

export function buildFetch(actualFetch: NodeFetchAPI) {
  let nextMiddleware: MiddlewareAPI = actualFetch
  const result = {
    getFetch(): EnhancedFetchAPI {
      const firstMiddleware = nextMiddleware

      // Maps between DOM fetch API types and Node Fetch API types.
      return (input, init) => {
        // Normalize Request.
        const request = new Request(input as RequestInfo, init as RequestInit)
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
