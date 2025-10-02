import {
  Request as NodeFetchRequest,
  RequestInfo as NodeRequestInfo,
  Headers,
  HeadersInit,
  RequestInit as NodeFetchRequestInit,
  Response,
} from 'node-fetch'
import { Auth, getAuthContext } from '@island.is/auth-nest-tools'

class Request extends NodeFetchRequest {
  auth?: Auth

  constructor(input: RequestInfo, init?: RequestInit) {
    super(input as NodeRequestInfo, init)

    const authInAsyncContext = getAuthContext()

    if (authInAsyncContext) {
      this.auth = authInAsyncContext
    } else if (init?.auth) {
      this.auth = init.auth
    } else if (input instanceof Request) {
      this.auth = input.auth
    }
  }
}

interface URLLike {
  href: string
}

type RequestInfo = string | URLLike | Request

interface RequestInit extends NodeFetchRequestInit {
  auth?: Auth
}

type FetchAPI = (input: RequestInfo, init?: RequestInit) => Promise<Response>

type MiddlewareAPI = (request: Request) => Promise<Response>

interface FetchMiddlewareOptions {
  fetch: MiddlewareAPI
}

export { Headers, Request, Response }

export type {
  HeadersInit,
  RequestInfo,
  RequestInit,
  FetchAPI,
  FetchMiddlewareOptions,
  MiddlewareAPI,
}
