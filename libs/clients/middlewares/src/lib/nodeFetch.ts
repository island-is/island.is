import {
  Request as NodeFetchRequest,
  RequestInfo as NodeRequestInfo,
  Headers,
  HeadersInit,
  RequestInit as NodeFetchRequestInit,
  Response,
} from 'node-fetch'
import { Auth } from '@island.is/auth-nest-tools'

class Request extends NodeFetchRequest {
  auth?: Auth

  constructor(input: RequestInfo, init?: RequestInit) {
    super(input as NodeRequestInfo, init)
    this.auth =
      init?.auth ?? (input instanceof Request ? input.auth : undefined)
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

export {
  Headers,
  HeadersInit,
  Request,
  RequestInfo,
  RequestInit,
  Response,
  FetchAPI,
  FetchMiddlewareOptions,
  MiddlewareAPI,
}
