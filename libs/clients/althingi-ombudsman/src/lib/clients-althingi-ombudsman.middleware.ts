import { Inject } from '@nestjs/common'
import {
  FetchParams,
  Middleware,
  RequestContext,
  SecurityApi,
} from '../gen/fetch/dev'
import {
  CLIENT_CONFIG,
  ComplaintToAlthingiOmbudsmanClientConfig,
} from './config/config'

export class TokenMiddleware implements Middleware {
  constructor(
    @Inject(CLIENT_CONFIG)
    private readonly config: ComplaintToAlthingiOmbudsmanClientConfig,
    private readonly securityApi: SecurityApi,
  ) {}
  async pre(context: RequestContext): Promise<FetchParams | void> {
    const responseToken = await this.securityApi.authenticate({
      password: this.config.password,
      username: this.config.username,
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
