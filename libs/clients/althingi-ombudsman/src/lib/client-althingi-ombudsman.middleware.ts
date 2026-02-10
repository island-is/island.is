import { Injectable } from '@nestjs/common'
import {
  FetchParams,
  Middleware,
  RequestContext,
  SecurityApi,
} from '../gen/fetch/dev'
import { ConfigType } from '@nestjs/config'
import { AlthingiOmbudsmanClientConfig } from './clients-althingi-ombudsman.config'

@Injectable()
export class TokenMiddleware implements Middleware {
  constructor(
    private readonly config: ConfigType<typeof AlthingiOmbudsmanClientConfig>,
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
