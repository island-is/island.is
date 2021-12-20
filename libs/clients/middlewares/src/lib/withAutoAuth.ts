import { buildCacheControl } from '@island.is/clients/middlewares'
import { caching } from 'cache-manager'
import { Logger } from 'winston'
import { CacheConfig } from './withCache/types'
import { createEnhancedFetch } from './createEnhancedFetch'
import {
  FetchAPI,
  Request,
  RequestInfo,
  RequestInit,
  Headers,
} from './nodeFetch'

export interface AutoAuthTokenExchangeOptions {
  /**
   * Request token exchange even though the current authentication has all of
   * the specified scopes. Defaults to false.
   */
  alwaysTokenExchange?: boolean

  /**
   * Request a token for the actor (the real end user) and removes information
   * about the active delegation. This is useful for services that do not
   * understand delegation tokens or should always return data for the actor
   * rather than the active delegation. Defaults to false.
   */
  requestActorToken?: boolean

  /**
   * Enable caching for token exchange tokens. Only works if Enhanced Fetch is
   * constructed with a cache manager. Defaults to false.
   */
  useCache?: boolean
}

export type AutoAuthMode = 'token' | 'tokenExchange' | 'auto'

export interface AutoAuthOptions {
  /**
   * The base URL of an Identity Server.
   */
  issuer: string

  /**
   * The ID of the client to use when getting tokens.
   */
  clientId: string

  /**
   * The client secret to use when getting tokens.
   */
  clientSecret: string

  /**
   * Which scopes to request.
   */
  scope: string[]

  /**
   * Controls how EnhancedFetch should auto-authenticate:
   *
   * - 'token': always request a non-user token. Ignores Auth object that are passed to the fetch function.
   * - 'tokenExchange': always get a user token with a token exchange. Throws an error if there's no Auth object.
   * - 'auto': performs a token exchange if an Auth object is passed in, otherwise gets a non-user token.
   */
  mode: AutoAuthMode

  /**
   * Additional configuration for token exchange.
   */
  tokenExchange?: AutoAuthTokenExchangeOptions
}

export interface AuthMiddlewareOptions {
  name: string
  logger: Logger
  options: AutoAuthOptions
  cache?: CacheConfig
  fetch: FetchAPI
  rootFetch: FetchAPI
}

export interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
  issued_token_type?: string
}

/**
 * In-memory cache key for client credential token.
 */
const TOKEN_CACHE_KEY = 'token'

export const withAutoAuth = ({
  fetch,
  logger,
  name,
  cache,
  rootFetch,
  options,
}: AuthMiddlewareOptions): FetchAPI => {
  const {
    alwaysTokenExchange = false,
    requestActorToken = false,
    useCache = false,
  } = options.tokenExchange || {}
  const tokenCacheManager = caching({ store: 'memory', ttl: 0 })
  const tokenEndpoint = `${options.issuer}/connect/token`
  if (useCache && !cache) {
    logger.warn(
      `Fetch (${name}): AutoAuth configured to use cache but no cache manager configured.`,
    )
  }

  let innerFetch = createEnhancedFetch({
    fetch: rootFetch,
    logger,
    name: `${name}:auth`,
    cache:
      cache && useCache
        ? {
            cacheManager: cache.cacheManager,
            overrideForPost: true,
            shared: false,
            overrideCacheControl: async (req, res) => {
              if (res.ok) {
                const response = (await res.clone().json()) as TokenResponse
                return buildCacheControl({ maxAge: response.expires_in })
              }
              return buildCacheControl({ noStore: true })
            },
          }
        : undefined,
  })

  const getAuth = async (
    input: RequestInfo,
    init: RequestInit | undefined,
  ): Promise<string> => {
    const auth = init?.auth ?? (input as Request).auth
    const isTokenExchange = options.mode !== 'token' && !!auth

    if (options.mode === 'tokenExchange' && !auth) {
      const message = `Fetch failure (${name}): Could not perform token exchange. Auth object was missing.`
      logger.error({
        url: input,
        message,
      })
      throw new Error(message)
    }

    if (!isTokenExchange) {
      const authorization = await tokenCacheManager.get<string>(TOKEN_CACHE_KEY)
      if (authorization) {
        return authorization
      }
    }

    // In some cases the original access token has everything we need. Then we can skip a token exchange.
    const hasAllScopes = options.scope.every((scope) =>
      auth?.scope.includes(scope),
    )
    if (
      auth &&
      isTokenExchange &&
      !alwaysTokenExchange &&
      hasAllScopes &&
      (!requestActorToken || !auth.actor)
    ) {
      return auth.authorization
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: options.clientId,
      client_secret: options.clientSecret,
      scope: options.scope.join(' '),
    })

    if (auth && isTokenExchange) {
      params.set(
        'grant_type',
        'urn:ietf:params:oauth:grant-type:token-exchange',
      )
      params.set('subject_token', auth.authorization.replace(/^bearer /i, ''))
      params.set(
        'subject_token_type',
        'urn:ietf:params:oauth:token-type:access_token',
      )
      params.set(
        'requested_token_type',
        requestActorToken
          ? 'islandis:oauth:token-type:actor-access-token'
          : 'urn:ietf:params:oauth:token-type:access_token',
      )
    }

    const response = await innerFetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
      auth,
    })

    const result: TokenResponse = await response.json()

    if (result.token_type !== 'Bearer') {
      throw new Error(
        `Fetch (${name}): Token exchange failed, invalid token type (${result.token_type})`,
      )
    }

    if (
      isTokenExchange &&
      result.issued_token_type !=
        'urn:ietf:params:oauth:token-type:access_token'
    ) {
      throw new Error(
        `Fetch (${name}): Token exchange failed, invalid issued token type (${result.issued_token_type})`,
      )
    }

    const authorization = `Bearer ${result.access_token}`

    if (!isTokenExchange) {
      await tokenCacheManager.set(TOKEN_CACHE_KEY, authorization, {
        ttl: result.expires_in,
      })
    }

    return authorization
  }

  return async (input, init) => {
    const headers = new Headers(init?.headers)
    const authorization = await getAuth(input, init)
    headers.set('authorization', authorization)
    return fetch(input, { ...init, headers })
  }
}
