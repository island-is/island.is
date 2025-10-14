import {
  Request as NodeFetchRequest,
  RequestInfo as NodeRequestInfo,
  Headers,
  HeadersInit,
  RequestInit as NodeFetchRequestInit,
  Response,
} from 'node-fetch'
import { Auth, getAuthContext } from '@island.is/auth-nest-tools'
import { AuthSource } from './types'

class Request extends NodeFetchRequest {
  auth?: Auth

  constructor(
    input: RequestInfo,
    init?: RequestInit,
    authSource: AuthSource = 'request',
  ) {
    super(input as NodeRequestInfo, init)

    if (init?.auth) {
      this.auth = init.auth
    } else if (input instanceof Request) {
      this.auth = input.auth
    } else if (authSource === 'context') {
      const authInAsyncContext = getAuthContext()
      this.auth = authInAsyncContext ?? undefined
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
