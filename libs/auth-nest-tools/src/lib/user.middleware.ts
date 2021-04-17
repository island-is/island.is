import { User } from './user'

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
export class UserMiddleware implements Middleware {
  constructor(private user: User) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.user.authorization,
      'User-Agent': this.user.userAgent,
      'X-Forwarded-For': this.user.ip,
    })
    console.log('hiiii', context.init.headers)
  }
}
