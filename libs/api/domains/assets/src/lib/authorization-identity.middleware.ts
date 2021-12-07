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
export class AuthorizationIdentityMiddleware implements Middleware {
  constructor(private bearerToken: string) {}

  async pre(context: RequestContext) {
    context.init.headers = Object.assign({}, context.init.headers, {
      ['Authorization-Identity']: this.bearerToken,
    })
  }
}
