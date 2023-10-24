import { Injectable } from '@nestjs/common'
import {
  FetchParams,
  Middleware,
  RequestContext,
  SecurityApi,
} from '../gen/fetch/dev'

@Injectable()
export class TokenMiddleware implements Middleware {
  constructor(
    private readonly password: string,
    private readonly username: string,
    private readonly securityApi: SecurityApi,
  ) {}

  async pre(context: RequestContext): Promise<FetchParams | void> {
    const responseToken = await this.securityApi.authenticate({
      password: this.password,
      username: this.username,
    })
    const token =
      responseToken.startsWith('"') && responseToken.endsWith('"')
        ? responseToken.substring(1, responseToken.length - 1)
        : responseToken

    if (token) {
      return {
        url: context.url,
        init: {
          ...context.init,
          headers: { ...context.init.headers, Token: `${token}` },
        },
      }
    }
  }
}
