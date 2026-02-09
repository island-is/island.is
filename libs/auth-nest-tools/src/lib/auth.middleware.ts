import { Auth } from './auth'
import fetch from 'isomorphic-fetch'
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

export interface AuthMiddlewareOptions {
  forwardUserInfo: boolean
  tokenExchangeOptions?: TokenExchangeOptions
  customHeaderForToken?: string
}

export interface TokenExchangeOptions {
  issuer: string
  clientId: string
  clientSecret: string
  scope: string
  requestActorToken?: boolean
}

/**
 * Middleware that adds user authorization and information to OpenAPI Client requests.
 */
export class AuthMiddleware implements Middleware {
  constructor(
    private auth: Auth,
    private options: AuthMiddlewareOptions = {
      forwardUserInfo: true,
    },
  ) {}

  async pre(context: RequestContext) {
    let bearerToken = this.auth.authorization

    if (this.options.tokenExchangeOptions) {
      const accessToken = await this.exchangeToken(
        bearerToken.replace('Bearer ', ''),
        context,
      )

      bearerToken = `Bearer ${accessToken}`
    }

    // Pass auth object for enhancedFetch.
    ;(context.init as any).auth = this.auth

    context.init.headers = Object.assign(
      {},
      context.init.headers,
      this.options.customHeaderForToken !== undefined
        ? {
            [this.options.customHeaderForToken]: bearerToken.replace(
              'Bearer ',
              '',
            ),
          }
        : {
            authorization: bearerToken,
          },
    )

    if (this.options.forwardUserInfo) {
      context.init.headers = Object.assign({}, context.init.headers, {
        'User-Agent': this.auth.userAgent,
        'X-Forwarded-For': this.auth.ip,
      })
    }
  }

  private async exchangeToken(
    accessToken: string,
    context: RequestContext,
  ): Promise<string> {
    if (!this.options.tokenExchangeOptions) {
      throw new Error(
        `Token exchange failed for ${context.url}. No token exchange options specified`,
      )
    }

    const options = this.options.tokenExchangeOptions

    const response = await fetch(`${options.issuer}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: options.clientId,
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        scope: options.scope,
        client_secret: options.clientSecret,
        subject_token: accessToken,
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        requested_token_type: options.requestActorToken
          ? 'islandis:oauth:token-type:actor-access-token'
          : 'urn:ietf:params:oauth:token-type:access_token',
      }),
    })

    if (!response.ok) {
      throw new Error(
        `Token exchange failed for ${context.url}, ${await response.text()}`,
      )
    }

    const result = await response.json()

    if (
      result.issued_token_type !=
      'urn:ietf:params:oauth:token-type:access_token'
    ) {
      throw new Error(
        `Token exchange failed for ${context.url}, invalid issued token type (${result.issued_token_type})`,
      )
    }

    if (result.token_type !== 'Bearer') {
      throw new Error(
        `Token exchange failed for ${context.url}, invalid token type (${result.token_type})`,
      )
    }

    return result.access_token
  }
}
