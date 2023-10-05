import type { Middleware, RequestContext } from './types'
export class AuthHeaderMiddleware implements Middleware {
  constructor(private bearerToken: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: this.bearerToken,
    })
  }
}
