import {
  createEnhancedFetch,
  EnhancedFetchAPI,
  EnhancedFetchOptions,
  Request,
} from '@island.is/clients/middlewares'
import { Logger } from '@island.is/logging'
import CircuitBreaker from 'opossum'
import { SetOptional } from 'type-fest'
import { Response, FetchAPI as NodeFetchAPI } from '../src/lib/nodeFetch'
import { TokenResponse, TokenType } from '../src/lib/withAutoAuth'

export interface EnhancedFetchTestEnv {
  enhancedFetch: EnhancedFetchAPI
  fetch: jest.Mock<ReturnType<NodeFetchAPI>>
  authFetch: jest.Mock<ReturnType<NodeFetchAPI>>
  logger: {
    log: jest.Mock
    info: jest.Mock
    warn: jest.Mock
    error: jest.Mock
  }
}

export const fakeAuthentication = 'Bearer TestToken'

export const fakeResponse = (...args: ConstructorParameters<typeof Response>) =>
  new Response(...args)

export const fakeAuthResponse = (override?: Partial<TokenResponse>) => {
  const response: TokenResponse = {
    expires_in: 60,
    scope: 'testScope',
    token_type: fakeAuthentication.split(' ')[0],
    access_token: fakeAuthentication.split(' ')[1],
    issued_token_type: TokenType.accessToken,
    ...override,
  }
  return new Response(JSON.stringify(response))
}

export const setupTestEnv = (
  override?: SetOptional<EnhancedFetchOptions, 'name'>,
): EnhancedFetchTestEnv => {
  const fetch = jest.fn<Promise<Response>, Parameters<NodeFetchAPI>>(() =>
    Promise.resolve(fakeResponse()),
  )
  const authFetch = jest.fn<Promise<Response>, Parameters<NodeFetchAPI>>(() =>
    Promise.resolve(fakeAuthResponse()),
  )
  const logger = {
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }

  const dynamicFetch: NodeFetchAPI = (input, init) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof Request
        ? input.url
        : input.href
    if (
      override?.autoAuth?.issuer &&
      url.startsWith(override?.autoAuth?.issuer)
    ) {
      return authFetch(input, init)
    }
    return fetch(input, init)
  }

  const enhancedFetch = createEnhancedFetch({
    name: 'test',
    fetch: dynamicFetch,
    logger: (logger as unknown) as Logger,
    ...override,
    circuitBreaker: override?.circuitBreaker !== false && {
      volumeThreshold: 0,
      ...(override?.circuitBreaker as CircuitBreaker.Options),
    },
  })

  return {
    enhancedFetch,
    fetch,
    authFetch,
    logger,
  }
}
