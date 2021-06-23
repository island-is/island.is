import { Auth } from './auth'

// These types are copied from our OpenAPI generated api clients.
type FetchAPI = WindowOrWorkerGlobalScope['fetch']

interface FetchParams {
  url: string
  init: RequestInit
}

interface RequestContext {
  fetch: FetchAPI
  url: string
  init: RequestInit
}

interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}

/**
 * Middleware that adds user authorization and information to OpenAPI Client requests.
 */
export class AuthMiddleware implements Middleware {
  constructor(private auth: Auth, private forwardUserInfo: boolean = true) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.auth.authorization,
    })

    if (this.forwardUserInfo) {
      context.init.headers = Object.assign({}, context.init.headers, {
        'User-Agent': this.auth.userAgent,
        'X-Real-IP': this.auth.ip,
      })
    }
  }
}
