/**
 * Need to mock timers before importing cache-manager since they cache it.
 * Also need to advance timers by 10ms to avoid cache-manager's 0-based logic.
 */
jest.useFakeTimers()
jest.advanceTimersByTime(10)

import { caching } from 'cache-manager'

import { Auth } from '@island.is/auth-nest-tools'
import { buildCacheControl, CacheControlOptions } from './buildCacheControl'
import { sleep } from '@island.is/shared/utils'

import {
  EnhancedFetchTestEnv,
  fakeResponse,
  setupTestEnv,
} from '../../../test/setup'
import { defaultCacheKeyWithHeader } from './withCache'

const testUrl = 'http://localhost/test'

describe('EnhancedFetch#withCache', () => {
  let env: EnhancedFetchTestEnv

  const mockResponse = (cacheControl?: CacheControlOptions) => {
    let counter = 1
    env.fetch.mockImplementation(() => {
      const requestNumber = counter++
      return Promise.resolve(
        fakeResponse(
          `Response ${requestNumber}`,
          cacheControl && {
            headers: {
              'cache-control': buildCacheControl(cacheControl),
            },
          },
        ),
      )
    })
  }

  it('cache respects server max-age', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=50',
    )
  })

  it('caches 404 responses', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=50',
    )
  })

  it('respects server no-store', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ noStore: true })

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; stored=?0',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; stored=?0',
    )
  })

  it('expires responses', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    jest.advanceTimersByTime(51 * 1000)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
  })

  it('does not cache authenticated requests', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'B' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; stored=?0',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; stored=?0',
    )
  })

  it('caches public authenticated requests', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50, public: true })

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'B' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=50',
    )
  })

  it('with shared=false does not share cache when user is missing', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager, shared: false },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      headers: { Authorization: 'B' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    expect(env.logger.warn).toHaveBeenCalledWith(
      'Fetch (test): Skipped cache since User authentication is missing for private cache. Either configure cache to be shared or pass a valid User authentication to enhanced fetch.',
    )
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
  })

  it('with shared=false does not share cache for different users', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    const auth: Auth = {
      authorization: 'something',
      client: 'client',
      scope: [],
    }
    env = setupTestEnv({
      cache: { cacheManager, shared: false },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      auth: { ...auth, nationalId: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      auth: { ...auth, nationalId: 'B' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
  })

  it('with shared=false caches based on nationalId users', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    const auth: Auth = {
      authorization: 'something',
      client: 'client',
      scope: [],
    }
    env = setupTestEnv({
      cache: { cacheManager, shared: false },
    })
    mockResponse({ maxAge: 50 })

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      auth: { ...auth, nationalId: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      auth: { ...auth, nationalId: 'A', authorization: 'newtoken' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=50',
    )
  })

  it('does not get stale if not error during stale-if-error', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 50, staleIfError: 100 })

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    jest.advanceTimersByTime(51 * 1000)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=stale; ttl=50; stored',
    )
  })

  it('gets stale if http error during stale-if-error', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    env.fetch
      .mockResolvedValueOnce(
        fakeResponse('Response 1', {
          headers: {
            'cache-control': buildCacheControl({
              maxAge: 50,
              staleIfError: 100,
            }),
          },
        }),
      )
      .mockResolvedValueOnce(fakeResponse('Response 2', { status: 500 }))

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    jest.advanceTimersByTime(51 * 1000)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=-1',
    )
  })

  it('gets stale if network error during stale-if-error', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    env.fetch
      .mockResolvedValueOnce(
        fakeResponse('Response 1', {
          headers: {
            'cache-control': buildCacheControl({
              maxAge: 50,
              staleIfError: 100,
            }),
          },
        }),
      )
      .mockRejectedValue(new Error('Failed to fetch'))

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    jest.advanceTimersByTime(51 * 1000)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; fwd=miss; ttl=50; stored',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=-1',
    )
  })

  it('returns stale while revalidate during stale-while-revalidate', async () => {
    // Arrange
    jest.useRealTimers()
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: { cacheManager },
    })
    mockResponse({ maxAge: 1, staleWhileRevalidate: 100 })

    // Act. Unfortunately can't use fake timers since the revalidate runs in an un-awaited promise.
    await env.enhancedFetch(testUrl)

    // Wait until stale.
    await sleep(2000)
    const response1 = await env.enhancedFetch(testUrl)

    // Wait until revalidated.
    await sleep(10)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=-1',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=1',
    )
  })

  it('cache-control can be overridden', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    mockResponse()

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
  })

  it('does not override cache control for user responses', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    mockResponse()

    // Act
    const response1 = await env.enhancedFetch(testUrl, {
      headers: { authorization: 'A' },
    })
    const response2 = await env.enhancedFetch(testUrl, {
      headers: { authorization: 'B' },
    })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
  })

  it('does not override cache control for error responses', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      logErrorResponseBody: true,
      circuitBreaker: false,
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    env.fetch
      .mockResolvedValueOnce(fakeResponse('Response 1', { status: 500 }))
      .mockResolvedValueOnce(fakeResponse('Response 2', { status: 500 }))

    // Act
    const response1 = env.enhancedFetch(testUrl)

    // Assert
    await expect(response1).rejects.toMatchObject({ body: 'Response 1' })

    // Act
    const response2 = env.enhancedFetch(testUrl)

    // Assert
    await expect(response2).rejects.toMatchObject({ body: 'Response 2' })
    expect(env.fetch).toHaveBeenCalledTimes(2)
  })

  it('does not override cache control for POST requests', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    mockResponse()

    // Act
    const response1 = await env.enhancedFetch(testUrl, { method: 'POST' })
    const response2 = await env.enhancedFetch(testUrl, { method: 'POST' })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
  })

  it('can override cache control for POST requests', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        overrideForPost: true,
      },
    })
    mockResponse()

    // Act
    const response1 = await env.enhancedFetch(testUrl, { method: 'POST' })
    const response2 = await env.enhancedFetch(testUrl, { method: 'POST' })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
  })

  it('does not mix up GET and POST requests', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    mockResponse()

    // Act
    const response1 = await env.enhancedFetch(testUrl, { method: 'GET' })
    const response2 = await env.enhancedFetch(testUrl, { method: 'POST' })

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
  })

  it('caches 404 error responses', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      logErrorResponseBody: true,
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    env.fetch
      .mockResolvedValueOnce(fakeResponse('Response 1', { status: 404 }))
      .mockResolvedValueOnce(fakeResponse('Response 2', { status: 404 }))

    // Act
    const response1 = env.enhancedFetch(testUrl)

    // Assert
    await expect(response1).rejects.toMatchObject({ body: 'Response 1' })

    // Act
    const response2 = env.enhancedFetch(testUrl)

    // Assert
    await expect(response2).rejects.toMatchObject({ body: 'Response 1' })
    expect(env.fetch).toHaveBeenCalledTimes(1)
  })

  it('supports empty response bodies', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    env.fetch
      .mockResolvedValueOnce(fakeResponse(''))
      .mockResolvedValueOnce(fakeResponse(''))

    // Act
    const response1 = await env.enhancedFetch(testUrl)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(1)
    await expect(response1.text()).resolves.toEqual('')
    await expect(response2.text()).resolves.toEqual('')
  })

  it('supports 304 responses', async () => {
    // Arrange
    jest.useRealTimers()
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({
      cache: {
        cacheManager,
        overrideCacheControl: buildCacheControl({
          maxAge: 1,
          staleWhileRevalidate: 100,
        }),
      },
    })
    env.fetch
      .mockResolvedValueOnce(fakeResponse('Response 1'))
      .mockResolvedValueOnce(fakeResponse('', { status: 304 }))

    // Act. Unfortunately can't use fake timers since the revalidate runs in an un-awaited promise.
    await env.enhancedFetch(testUrl)

    // Wait until stale.
    await sleep(2000)
    const response1 = await env.enhancedFetch(testUrl)

    // Wait until revalidated.
    await sleep(10)
    const response2 = await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 1')
    expect(response1.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=-1',
    )
    expect(response2.headers.get('cache-status')).toEqual(
      'EnhancedFetch; hit; ttl=1',
    )
  })

  it('supports cache key with header value', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    const headerParamName = 'X-Param-National-Id'
    const env1 = setupTestEnv({
      cache: {
        cacheManager,
        cacheKey: defaultCacheKeyWithHeader(headerParamName),
        overrideCacheControl: buildCacheControl({ maxAge: 50 }),
      },
    })
    env1.fetch.mockResolvedValueOnce(fakeResponse('Response 1'))
    env1.fetch.mockResolvedValueOnce(fakeResponse('Response 2'))

    // Act
    const response1 = await env1.enhancedFetch(testUrl, {
      headers: { [headerParamName]: 'A' },
    })
    const response2 = await env1.enhancedFetch(testUrl, {
      headers: { [headerParamName]: 'B' },
    })

    // Assert
    expect(env1.fetch).toHaveBeenCalledTimes(2)
    await expect(response1.text()).resolves.toEqual('Response 1')
    await expect(response2.text()).resolves.toEqual('Response 2')
  })

  // REGRESSION TEST: Passed in headers were deleted when combining Cache with Auth or AutoAuth.
  it('keeps all passed in headers', async () => {
    // Arrange
    const cacheManager = await caching('memory', { ttl: 0 })
    env = setupTestEnv({ cache: { cacheManager } })
    mockResponse()
    const expectedHeaders = { 'X-Test': ['Test'], authorization: ['Test auth'] }

    // Act
    await env.enhancedFetch(testUrl, {
      headers: { 'X-Test': 'Test' },
      auth: { authorization: 'Test auth', scope: [], client: '' },
    })

    // Assert
    const actualHeaders = env.fetch.mock.calls[0][0].headers.raw()
    expect(actualHeaders).toMatchObject(expectedHeaders)
  })
})
