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
import { EnhancedFetchAPI } from './types'
import { Readable } from 'stream'

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
): Promise<InstanceType<typeof NodeFetchRequest>> => {
  const headers = new NodeFetchHeaders()
  globalReq.headers.forEach((value, key) => headers.set(key, value))

  const canHaveBody = !['GET', 'HEAD'].includes(globalReq.method)
  const globalReqBody = globalReq.body

  let body: any = undefined

  // If the request is a globalThis.Request, the body will always be a ReadableStream
  if (canHaveBody && globalReqBody instanceof ReadableStream) {
    body = Readable.fromWeb(globalReqBody as any)
  }

  return new NodeFetchRequest(globalReq.url, {
    method: globalReq.method,
    headers,
    body,
    redirect: globalReq.redirect,
  })
}

export function buildFetch(actualFetch: NodeFetchAPI) {
  let nextMiddleware: MiddlewareAPI = actualFetch
  const result = {
    getFetch(): EnhancedFetchAPI {
      const firstMiddleware = nextMiddleware

      return async (input, init?) => {
        let request: Request
        if (input instanceof globalThis.Request) {
          const nodeFetchRequest = await toNodeFetchRequest(input)
          request = new Request(nodeFetchRequest)
        } else {
          request = new Request(input as RequestInfo, init as RequestInit)
        }

        const response = await firstMiddleware(request)
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
