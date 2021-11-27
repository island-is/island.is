import {
  createEnhancedFetch,
  EnhancedFetchOptions,
} from './createEnhancedFetch'
import { Response } from 'node-fetch'
import { SetOptional } from 'type-fest'
import CircuitBreaker from 'opossum'
import { FetchAPI, Request } from './types'
import { caching } from 'cache-manager'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { Auth } from '@island.is/auth-nest-tools'
import { buildCacheControl, CacheControlOptions } from './buildCacheControl'

const fakeResponse = (...args: ConstructorParameters<typeof Response>) =>
  new Response(...args)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const timeout = 500

describe('EnhancedFetch', () => {
  let enhancedFetch: FetchAPI
  let fetch: jest.Mock<ReturnType<FetchAPI>>
  let logger: {
    log: jest.Mock
    info: jest.Mock
    warn: jest.Mock
    error: jest.Mock
  }

  const createTestEnhancedFetch = (
    override?: SetOptional<EnhancedFetchOptions, 'name'>,
  ) =>
    createEnhancedFetch({
      name: 'test',
      fetch,
      timeout,
      // logger: (logger as unknown) as Logger,
      ...override,
      circuitBreaker: override?.circuitBreaker !== false && {
        volumeThreshold: 0,
        ...(override?.circuitBreaker as CircuitBreaker.Options),
      },
    })

  beforeEach(() => {
    fetch = jest.fn(() => Promise.resolve(fakeResponse()))
    logger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    }
    enhancedFetch = createTestEnhancedFetch()
  })

  it('adds request timeout', async () => {
    // Act
    await enhancedFetch('/test')

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({ timeout }),
    )
  })

  it('adds request timeout', async () => {
    // Arrange
    const mockUser = createCurrentUser()

    // Act
    await enhancedFetch('/test', { auth: mockUser })

    // Assert
    expect(fetch).toHaveBeenCalled()
    const request = new Request(fetch.mock.calls[0][0], fetch.mock.calls[0][1])
    expect(request.headers.get('authorization')).toEqual(mockUser.authorization)
  })

  it('logs arbitrary errors', async () => {
    // Arrange
    fetch.mockRejectedValue(new Error('Test error'))

    // Act
    await enhancedFetch('/test').catch(() => null)

    // Assert
    expect(logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        message: expect.stringContaining('Test error'),
        url: '/test',
      }),
    )
  })

  it('logs server response errors', async () => {
    // Arrange
    fetch.mockResolvedValue(
      fakeResponse('Error', {
        status: 500,
        statusText: 'Server Test Error',
      }),
    )

    // Act
    await enhancedFetch('/test').catch(() => null)

    // Assert
    expect(logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        message: expect.stringContaining('Request failed with status code 500'),
        url: '/test',
        status: 500,
        statusText: 'Server Test Error',
      }),
    )
  })

  it('supports response problem spec', async () => {
    // Arrange
    fetch.mockResolvedValue(
      fakeResponse('{"title": "Problem", "type": "my-problem"}', {
        status: 500,
        statusText: 'Server Test Error',
        headers: {
          'Content-Type': 'application/problem+json',
        },
      }),
    )
    const problem = { title: 'Problem', type: 'my-problem' }

    // Act
    const error = await enhancedFetch('/test').catch((error) => error)

    // Assert
    expect(error).toMatchObject({ problem })
    expect(logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ problem }),
    )
  })

  it('can optionally log json body', async () => {
    // Arrange
    enhancedFetch = createTestEnhancedFetch({ logErrorResponseBody: true })
    fetch.mockResolvedValue(
      fakeResponse('{"yo": "error"}', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    // Act
    const error = await enhancedFetch('/test').catch((error) => error)

    // Assert
    expect(error).toMatchObject({ body: { yo: 'error' } })
    expect(logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ body: { yo: 'error' } }),
    )
  })

  it('can optionally log text body', async () => {
    // Arrange
    enhancedFetch = createTestEnhancedFetch({ logErrorResponseBody: true })
    fetch.mockResolvedValue(fakeResponse('My Error', { status: 500 }))

    // Act
    const error = await enhancedFetch('/test').catch((error) => error)

    // Assert
    expect(error).toMatchObject({ body: 'My Error' })
    expect(logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ body: 'My Error' }),
    )
  })

  it('opens circuit after enough 500 errors', async () => {
    // Arrange
    fetch.mockResolvedValue(fakeResponse('Error', { status: 500 }))
    await enhancedFetch('/test').catch(() => null)

    // Act
    const promise = enhancedFetch('/test')

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Breaker is open"`,
    )
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('does not open circuit for 400 responses', async () => {
    // Arrange
    fetch.mockResolvedValue(fakeResponse('Error', { status: 400 }))
    await enhancedFetch('/test').catch(() => null)

    // Act
    const promise = enhancedFetch('/test')

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Request failed with status code 400"`,
    )
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('can be configured to open circuit for 400 errors', async () => {
    // Arrange
    enhancedFetch = createTestEnhancedFetch({ treat400ResponsesAsErrors: true })
    fetch.mockResolvedValue(fakeResponse('Error', { status: 400 }))
    await enhancedFetch('/test').catch(() => null)

    // Act
    const promise = enhancedFetch('/test')

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Breaker is open"`,
    )
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  describe('withCache', () => {
    const mockResponse = (cacheControl?: CacheControlOptions) => {
      let counter = 1
      fetch.mockImplementation(() => {
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
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test')
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('respects server no-store', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ noStore: true })

      // Act
      const response1 = await enhancedFetch('/test')
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('expires responses', async () => {
      // Arrange
      jest.useFakeTimers('modern')
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test')
      jest.advanceTimersByTime(51 * 1000)
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('does not cache authenticated requests', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test', {
        headers: { Authorization: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        headers: { Authorization: 'B' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('caches public authenticated requests', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 50, public: true })

      // Act
      const response1 = await enhancedFetch('/test', {
        headers: { Authorization: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        headers: { Authorization: 'B' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('with shared=false does not share cache when user is missing', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager, shared: false },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test', {
        headers: { Authorization: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        headers: { Authorization: 'B' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      expect(logger.warn).toHaveBeenCalledWith(
        'Fetch (test): Skipped cache since User authentication is missing for private cache. Either configure cache to be shared or pass a valid User authentication to enhanced fetch.',
      )
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('with shared=false does not share cache for different users', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const auth: Auth = {
        authorization: 'something',
        client: 'client',
        scope: [],
      }
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager, shared: false },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test', {
        auth: { ...auth, nationalId: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        auth: { ...auth, nationalId: 'B' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('with shared=false caches based on nationalId users', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const auth: Auth = {
        authorization: 'something',
        client: 'client',
        scope: [],
      }
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager, shared: false },
      })
      mockResponse({ maxAge: 50 })

      // Act
      const response1 = await enhancedFetch('/test', {
        auth: { ...auth, nationalId: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        auth: { ...auth, nationalId: 'A', authorization: 'newtoken' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('does not get stale if not error during stale-if-error', async () => {
      // Arrange
      jest.useFakeTimers('modern')
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 50, staleIfError: 100 })

      // Act
      const response1 = await enhancedFetch('/test')
      jest.advanceTimersByTime(51 * 1000)
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('gets stale if http error during stale-if-error', async () => {
      // Arrange
      jest.useFakeTimers('modern')
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      fetch
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
      const response1 = await enhancedFetch('/test')
      jest.advanceTimersByTime(51 * 1000)
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('gets stale if network error during stale-if-error', async () => {
      // Arrange
      jest.useFakeTimers('modern')
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      fetch
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
      const response1 = await enhancedFetch('/test')
      jest.advanceTimersByTime(51 * 1000)
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('returns stale while revalidate during stale-while-revalidate', async () => {
      // Arrange
      jest.useRealTimers()
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: { cacheManager },
      })
      mockResponse({ maxAge: 1, staleWhileRevalidate: 100 })

      // Act. Unfortunately can't use fake timers since the revalidate runs in an un-awaited promise.
      await enhancedFetch('/test')

      // Wait until stale.
      await sleep(1000)
      const response1 = await enhancedFetch('/test')

      // Wait until revalidated.
      await sleep(10)
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('cache-control can be overridden', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        },
      })
      mockResponse()

      // Act
      const response1 = await enhancedFetch('/test')
      const response2 = await enhancedFetch('/test')

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('does not override cache control for user responses', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        },
      })
      mockResponse()

      // Act
      const response1 = await enhancedFetch('/test', {
        headers: { authorization: 'A' },
      })
      const response2 = await enhancedFetch('/test', {
        headers: { authorization: 'B' },
      })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('does not override cache control for error responses', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        logErrorResponseBody: true,
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        },
      })
      fetch
        .mockResolvedValueOnce(fakeResponse('Response 1', { status: 500 }))
        .mockResolvedValueOnce(fakeResponse('Response 2', { status: 500 }))

      // Act
      const response1 = enhancedFetch('/test')
      const response2 = enhancedFetch('/test')

      // Assert
      await expect(response1).rejects.toMatchObject({ body: 'Response 1' })
      await expect(response2).rejects.toMatchObject({ body: 'Response 2' })
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    it('can override cache control for error responses', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        logErrorResponseBody: true,
        circuitBreaker: false,
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
          overrideForErrors: true,
        },
      })
      fetch
        .mockResolvedValueOnce(fakeResponse('Response 1', { status: 500 }))
        .mockResolvedValueOnce(fakeResponse('Response 2', { status: 500 }))

      // Act and Assert
      const response1 = enhancedFetch('/test')
      await expect(response1).rejects.toMatchObject({ body: 'Response 1' })

      const response2 = enhancedFetch('/test')
      await expect(response2).rejects.toMatchObject({ body: 'Response 1' })
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('does not override cache control for POST requests', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        },
      })
      mockResponse()

      // Act
      const response1 = await enhancedFetch('/test', { method: 'POST' })
      const response2 = await enhancedFetch('/test', { method: 'POST' })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })

    it('can override cache control for POST requests', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
          overrideForAllMethods: true,
        },
      })
      mockResponse()

      // Act
      const response1 = await enhancedFetch('/test', { method: 'POST' })
      const response2 = await enhancedFetch('/test', { method: 'POST' })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 1')
    })

    it('does not mix up GET and POST requests', async () => {
      // Arrange
      const cacheManager = caching({ store: 'memory', ttl: 0 })
      const enhancedFetch = createTestEnhancedFetch({
        cache: {
          cacheManager,
          overrideCacheControl: buildCacheControl({ maxAge: 50 }),
        },
      })
      mockResponse()

      // Act
      const response1 = await enhancedFetch('/test', { method: 'GET' })
      const response2 = await enhancedFetch('/test', { method: 'POST' })

      // Assert
      expect(fetch).toHaveBeenCalledTimes(2)
      await expect(response1.text()).resolves.toEqual('Response 1')
      await expect(response2.text()).resolves.toEqual('Response 2')
    })
  })
})
