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
    // private options: AuthMiddlewareOptions = {
    //   forwardUserInfo: true,
    // },
    private options: AuthMiddlewareOptions = {
      forwardUserInfo: false,
      tokenExchangeOptions: {
        issuer: 'https://identity-server.dev01.devland.is',
        clientId: '@vegagerdin.is/air-discount-scheme',
        clientSecret: '',
        scope: 'openid profile @vegagerdin.is/air-discount-scheme-scope offline_access @skra.is/individuals api_resource.scope', // TODO: remove api_resource.scope
        requestActorToken: true,
      },
    }
  ) {}
  async pre(context: RequestContext) {
    console.log('inside pre, new middleware - here comes accessToken')
    let bearerToken = this.auth.authorization
    console.log(bearerToken)
    if (this.options.tokenExchangeOptions) {
      console.log('this logs if options.tokenExchangeOptions is available')
      const accessToken = await this.exchangeToken(
        bearerToken.replace('Bearer ', ''),
        context,
      )

      bearerToken = `Bearer ${accessToken}`
    }

    // Pass auth object for enhancedFetch.
    ;(context.init as any).auth = this.auth

    context.init.headers = Object.assign({}, context.init.headers, {
      authorization: bearerToken,
    })

    if (this.options.forwardUserInfo) {
      context.init.headers = Object.assign({}, context.init.headers, {
        'User-Agent': this.auth.userAgent,
        'X-Forwarded-For': this.auth.ip,
      })
    }
    console.log('this is the end of pre, middleware. Will log context init headers')
    console.log(context.init.headers)
  }

  private async exchangeToken(
    accessToken: string,
    context: RequestContext,
  ): Promise<string> {
    console.log('exchange token middleware function.')
    if (!this.options.tokenExchangeOptions) {
      throw new Error(
        `Token exchange failed for ${context.url}. No token exchange options specified`,
      )
    }

    const options = this.options.tokenExchangeOptions
    console.log('here comes exchangeToken options, followed by response on /connect/token')
    console.log(options)
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
    console.log(response)
    if (!response.ok) {
      throw new Error(
        `Token exchange failed for ${context.url}, ${await response.text()}`,
      )
    }

    const result = await response.json()
    console.log('logs the result of tokenExchange')
    console.log(result)
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
