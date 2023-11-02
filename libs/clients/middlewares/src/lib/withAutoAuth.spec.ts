/**
 * Need to mock timers before importing cache-manager since they cache it.
 * Also need to advance timers by 10ms to avoid cache-manager's 0-based logic.
 */
jest.useFakeTimers()
jest.advanceTimersByTime(10)

import { caching } from 'cache-manager'

import { createCurrentUser } from '@island.is/testing/fixtures'

import {
  EnhancedFetchTestEnv,
  fakeAuthentication,
  fakeAuthResponse,
  setupTestEnv,
} from '../../test/setup'
import { AuthDelegationType } from '@island.is/shared/types'

const testUrl = 'http://localhost/test'
const issuerUrl = 'http://localhost/issuer'
const clientId = 'client'
const clientSecret = 'secret'
const scope = ['testScope']
const autoAuth = { issuer: issuerUrl, clientId, clientSecret, scope }

describe('EnhancedFetch#withAutoAuth', () => {
  let env: EnhancedFetchTestEnv
  const auth = createCurrentUser()

  it('should request token', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'token' },
    })

    // Act
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
    expect(
      env.authFetch.mock.calls[0][0].body.toString(),
    ).toMatchInlineSnapshot(
      `"grant_type=client_credentials&client_id=client&client_secret=secret&scope=testScope"`,
    )
    expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
  })

  it('should request token when tokenEndpoint is configured', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: {
        ...autoAuth,
        mode: 'token',
        tokenEndpoint: `${autoAuth.issuer}/oauth2/token`,
      },
    })

    // Act
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
    expect(
      env.authFetch.mock.calls[0][0].body.toString(),
    ).toMatchInlineSnapshot(
      `"grant_type=client_credentials&client_id=client&client_secret=secret&scope=testScope"`,
    )
    expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
  })

  it('should cache token', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'token' },
    })

    // Act
    await env.enhancedFetch(testUrl)
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
    expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
    expect(env.fetch.mock.calls[1][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
  })

  it('should not cache token forever', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'token' },
    })
    env.authFetch.mockImplementation(() =>
      Promise.resolve(fakeAuthResponse({ expires_in: 5 })),
    )

    // Act
    await env.enhancedFetch(testUrl)
    jest.advanceTimersByTime(6 * 1000)
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(2)
  })

  it('should request token exchange', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'tokenExchange' },
    })
    const expectedBody = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: 'client',
      client_secret: 'secret',
      scope: 'testScope',
      subject_token: auth.authorization,
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
    }).toString()

    // Act
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
    expect(env.authFetch.mock.calls[0][0].body.toString()).toEqual(expectedBody)
    expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
  })

  it('should not cache token exchange by default', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'tokenExchange' },
    })

    // Act
    await env.enhancedFetch(testUrl, { auth })
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(2)
  })

  it('should cache token exchange in private cache if requested', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      autoAuth: {
        ...autoAuth,
        mode: 'tokenExchange',
        tokenExchange: { useCache: true },
      },
      cache: { cacheManager, shared: false },
    })

    // Act
    await env.enhancedFetch(testUrl, { auth })
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
  })

  it('should not cache token exchange forever', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      autoAuth: {
        ...autoAuth,
        mode: 'tokenExchange',
        tokenExchange: { useCache: true },
      },
      cache: { cacheManager, shared: false },
    })
    env.authFetch.mockImplementation(() =>
      Promise.resolve(fakeAuthResponse({ expires_in: 5 })),
    )

    // Act
    await env.enhancedFetch(testUrl, { auth })
    jest.advanceTimersByTime(6 * 1000)
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(2)
  })

  it('should throw when mode=tokenExchange and no auth', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: { ...autoAuth, mode: 'tokenExchange' },
    })

    // Act
    const promise = env.enhancedFetch(testUrl)

    // Assert
    expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Fetch failure (test): Could not perform token exchange. Auth object was missing."`,
    )
  })

  it('should warn if tokenExchange.useCache and no cache', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: {
        ...autoAuth,
        mode: 'tokenExchange',
        tokenExchange: { useCache: true },
      },
      cache: undefined,
    })

    // Act
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.logger.warn).toHaveBeenCalled()
    expect(env.logger.warn.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Fetch (test): AutoAuth configured to use cache but no cache manager configured."`,
    )
  })

  it('should request token exchange with actor token', async () => {
    // Arrange
    env = setupTestEnv({
      autoAuth: {
        ...autoAuth,
        mode: 'tokenExchange',
        tokenExchange: { requestActorToken: true },
      },
    })
    const expectedBody = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: 'client',
      client_secret: 'secret',
      scope: 'testScope',
      subject_token: auth.authorization,
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      requested_token_type: 'islandis:oauth:token-type:actor-access-token',
    }).toString()

    // Act
    await env.enhancedFetch(testUrl, { auth })

    // Assert
    expect(env.authFetch).toHaveBeenCalledTimes(1)
    expect(env.authFetch.mock.calls[0][0].body.toString()).toEqual(expectedBody)
    expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
      fakeAuthentication,
    )
  })

  describe('when auth has all scopes', () => {
    it('should not request token exchange', async () => {
      // Arrange
      const auth = createCurrentUser({ scope })
      env = setupTestEnv({
        autoAuth: { ...autoAuth, scope, mode: 'tokenExchange' },
      })

      // Act
      await env.enhancedFetch(testUrl, { auth })

      // Assert
      expect(env.authFetch).not.toHaveBeenCalled()
      expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
        auth.authorization,
      )
    })

    it('should request token exchange if alwaysTokenExchange', async () => {
      // Arrange
      const auth = createCurrentUser({ scope })
      env = setupTestEnv({
        autoAuth: {
          ...autoAuth,
          scope,
          mode: 'tokenExchange',
          tokenExchange: { alwaysTokenExchange: true },
        },
      })

      // Act
      await env.enhancedFetch(testUrl, { auth })

      // Assert
      expect(env.authFetch).toHaveBeenCalledTimes(1)
      expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
        fakeAuthentication,
      )
    })

    it('should not request token exchange if requestActorToken and no delegation', async () => {
      // Arrange
      const auth = createCurrentUser({ scope })
      env = setupTestEnv({
        autoAuth: {
          ...autoAuth,
          scope,
          mode: 'tokenExchange',
          tokenExchange: { requestActorToken: true },
        },
      })

      // Act
      await env.enhancedFetch(testUrl, { auth })

      // Assert
      expect(env.authFetch).not.toHaveBeenCalled()
      expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
        auth.authorization,
      )
    })

    it('should request token exchange if requestActorToken and delegation', async () => {
      // Arrange
      const auth = createCurrentUser({ scope })
      auth.delegationType = [AuthDelegationType.Custom]
      auth.actor = {
        nationalId: auth.nationalId,
        scope: [],
      }
      env = setupTestEnv({
        autoAuth: {
          ...autoAuth,
          scope,
          mode: 'tokenExchange',
          tokenExchange: { requestActorToken: true },
        },
      })

      // Act
      await env.enhancedFetch(testUrl, { auth })

      // Assert
      expect(env.authFetch).toHaveBeenCalledTimes(1)
      expect(env.fetch.mock.calls[0][0].headers.get('authorization')).toEqual(
        fakeAuthentication,
      )
    })
  })

  describe('when mode=auto', () => {
    it('should request token when no auth', async () => {
      // Arrange
      env = setupTestEnv({
        autoAuth: { ...autoAuth, mode: 'auto' },
      })

      // Act
      await env.enhancedFetch(testUrl)

      // Assert
      expect(env.authFetch).toHaveBeenCalledTimes(1)
      expect(
        env.authFetch.mock.calls[0][0].body.toString(),
      ).toMatchInlineSnapshot(
        `"grant_type=client_credentials&client_id=client&client_secret=secret&scope=testScope"`,
      )
    })

    it('should request token exchange when auth', async () => {
      // Arrange
      env = setupTestEnv({
        autoAuth: { ...autoAuth, mode: 'auto' },
      })
      const expectedBody = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        client_id: 'client',
        client_secret: 'secret',
        scope: 'testScope',
        subject_token: auth.authorization,
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      }).toString()

      // Act
      await env.enhancedFetch(testUrl, { auth })

      // Assert
      expect(env.authFetch).toHaveBeenCalledTimes(1)
      expect(env.authFetch.mock.calls[0][0].body.toString()).toEqual(
        expectedBody,
      )
    })
  })
})
