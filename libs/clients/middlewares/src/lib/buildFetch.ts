import {
  Request as NodeFetchRequest,
  Headers as NodeFetchHeaders,
} from 'node-fetch'
import { Readable } from 'stream'
import {
  FetchAPI as NodeFetchAPI,
  RequestInit,
  MiddlewareAPI,
  RequestInfo,
  Request,
} from './nodeFetch'
import { EnhancedFetchAPI, AuthSource } from './types'

/**
 * Converts a globalThis.Request (browser-style Request) to a node-fetch Request.
 *
 * This conversion is necessary because the new generated clients using openapi-ts
 * call enhancedFetch with a globalThis.Request instance. However, node-fetch expects
 * its own Request implementation, so we must translate between the two.
 *
 * - If the HTTP method allows a body (i.e., not GET or HEAD) and a body is present,
 *   the body (a web ReadableStream) is converted to a Node.js Readable stream using Readable.fromWeb,
 *   as node-fetch expects a Node.js stream for the body.
 * - Returns a new node-fetch Request instance with the same URL, method, headers, body and redirect policy as the original request.
 */
const toNodeFetchRequest = async (
  globalReq: globalThis.Request,
  init?: RequestInit,
): Promise<NodeFetchRequest> => {
  const headers = new NodeFetchHeaders()
  globalReq.headers.forEach((value, key) => headers.set(key, value))

  const globalReqBody = globalReq.body

  let body: undefined | Readable = undefined

  // If the request is a globalThis.Request, the body will always be a ReadableStream
  if (globalReqBody instanceof ReadableStream) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body = Readable.fromWeb(globalReqBody as any)
  }

  return new NodeFetchRequest(globalReq.url, {
    method: globalReq.method,
    headers,
    body,
    redirect: globalReq.redirect,
    signal: globalReq.signal,
    ...init,
  })
}

export function buildFetch(actualFetch: NodeFetchAPI, authSource?: AuthSource) {
  let nextMiddleware: MiddlewareAPI = actualFetch
  const result = {
    getFetch(): EnhancedFetchAPI {
      const firstMiddleware = nextMiddleware

      // Maps between DOM fetch API types and Node Fetch API types.
      return async (input, init?) => {
        // Normalize Request.
        let request: Request

        if (input instanceof globalThis.Request) {
          const nodeFetchRequest = await toNodeFetchRequest(
            input,
            init as RequestInit,
          )
          request = new Request(nodeFetchRequest, undefined, authSource)
        } else {
          request = new Request(
            input as RequestInfo,
            init as RequestInit,
            authSource,
          )
        }

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
