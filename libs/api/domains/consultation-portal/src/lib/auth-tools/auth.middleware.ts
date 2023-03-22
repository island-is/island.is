// These types are copied from our OpenAPI generated api clients.

interface FetchParams {
  url: string
  init: RequestInit
}

interface RequestContext {
  init: RequestInit
}

interface Middleware {
  pre?(context: RequestContext): Promise<FetchParams | void>
}

/**
 * Middleware that adds user authorization and information to OpenAPI Client requests.
 */
export class AuthMiddleware implements Middleware {
  constructor(private Authorization: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.Authorization,
    })
  }
}
