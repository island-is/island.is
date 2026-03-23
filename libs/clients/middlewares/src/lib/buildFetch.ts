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

/**
 * Converts a globalThis.Request (browser-style Request) to a node-fetch Request.
 *
 * This conversion is necessary because when NODE_OPTIONS=--experimental-fetch is enabled,
 * the native fetch implementation has a bug where POST/PUT request bodies are stripped.
 * To work around this, we convert the globalThis.Request to a node-fetch Request and
 * manually extract and preserve the request body.
 *
 * - For text-based content types (JSON, form data, text), the body is read as a string.
 * - For binary content (images, files, etc.), the body is converted to a Buffer.
 * - Returns a new node-fetch Request instance with the same URL, method, headers, body,
 *   and redirect policy as the original request.
 */
const toNodeFetchRequest = async (
  globalReq: globalThis.Request,
  init?: RequestInit,
): Promise<NodeFetchRequest> => {
  const headers = new NodeFetchHeaders()
  globalReq.headers.forEach((value, key) => headers.set(key, value))

  let body: undefined | string | Buffer = undefined

  if (globalReq.body) {
    const contentType = globalReq.headers.get('content-type') || ''

    if (
      contentType.includes('application/json') ||
      contentType.includes('text/') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      // Text-based content
      body = await globalReq.text()
    } else {
      // Binary content (images, files, etc.)
      body = Buffer.from(await globalReq.arrayBuffer())
    }
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

export const buildFetch = (
  actualFetch: NodeFetchAPI,
  authSource?: AuthSource,
) => {
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
