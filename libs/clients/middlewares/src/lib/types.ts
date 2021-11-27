import {
  Request as NodeFetchRequest,
  Headers,
  HeadersInit,
  RequestInit as NodeFetchRequestInit,
  Response,
} from 'node-fetch'
import { Auth } from '@island.is/auth-nest-tools'

interface URLLike {
  href: string
}

class Request extends NodeFetchRequest {
  auth?: Auth

  constructor(input: RequestInfo, init?: RequestInit) {
    super(input, init)
    this.auth =
      init?.auth ?? (input instanceof Request ? input.auth : undefined)
  }
}

type RequestInfo = string | URLLike | Request

interface RequestInit extends NodeFetchRequestInit {
  auth?: Auth
}

type FetchAPI = (input: RequestInfo, init?: RequestInit) => Promise<Response>

interface FetchMiddlewareOptions {
  fetch: FetchAPI
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
}
