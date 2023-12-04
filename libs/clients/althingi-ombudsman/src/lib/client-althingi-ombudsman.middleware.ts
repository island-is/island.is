import { Inject, Injectable } from '@nestjs/common'
import {
  FetchParams,
  Middleware,
  RequestContext,
  SecurityApi,
} from '../gen/fetch/dev'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { DAY_IN_MILLISECONDS, SECURITY_TOKEN_KEY } from './const'

@Injectable()
export class TokenMiddleware implements Middleware {
  constructor(
    private readonly password: string,
    private readonly username: string,
    private readonly securityApi: SecurityApi,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async pre(context: RequestContext): Promise<FetchParams | void> {
    const token = await this.getToken()
    return {
      url: context.url,
      init: {
        ...context.init,
        headers: { ...context.init.headers, Token: `${token}` },
      },
    }
  }

  private async getToken(): Promise<string> {
    const cachedToken = await this.cacheManager.get(SECURITY_TOKEN_KEY)
    if (cachedToken && typeof cachedToken === 'string') {
      return cachedToken
    }
    const responseToken = await this.securityApi.authenticate({
      password: this.password,
      username: this.username,
    })
    const token =
      responseToken.startsWith('"') && responseToken.endsWith('"')
        ? responseToken.substring(1, responseToken.length - 1)
        : responseToken
    // Cache token for one day
    this.cacheManager.set(SECURITY_TOKEN_KEY, token, DAY_IN_MILLISECONDS)
    return token
  }
}
