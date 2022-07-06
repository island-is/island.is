import {
  EnhancedFetchTestEnv,
  fakeResponse,
  setupTestEnv,
} from '../../test/setup'
import { serializeCacheStatusHeader } from './withCache/CacheStatus'

const testUrl = 'http://localhost/test'
jest.mock('@island.is/infra-metrics')

describe('EnhancedFetch#withMetrics', () => {
  let env: EnhancedFetchTestEnv

  beforeEach(() => {
    env = setupTestEnv()
  })

  it('should increment 2xx', async () => {
    // Act
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.2xx',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.ok',
      1,
      { cache: 'miss' },
    )
  })

  it('should increment 3xx', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('Redirect', {
        status: 301,
        statusText: 'Redirect',
      }),
    )

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.3xx',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.ok',
      1,
      { cache: 'miss' },
    )
  })

  it('should increment 4xx', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('BadRequest', {
        status: 400,
        statusText: 'Bad Request',
      }),
    )

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.4xx',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
      1,
      { cache: 'miss' },
    )
  })

  it('should increment 5xx', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('Error', {
        status: 500,
        statusText: 'Server Test Error',
      }),
    )

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.5xx',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
      1,
      { cache: 'miss' },
    )
  })

  it('should increment when network error', async () => {
    // Arrange
    env.fetch.mockImplementation(() => {
      throw new Error('Network Error')
    })

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.network_error',
      1,
      { cache: 'miss' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
      1,
      { cache: 'miss' },
    )
  })

  it('should tag cache=hit from cache-status header', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('Result', {
        headers: {
          'cache-status': serializeCacheStatusHeader([
            { cacheName: 'SomeCache', hit: true },
          ]),
        },
      }),
    )

    // Act
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      1,
      'requests',
      1,
      { cache: 'hit' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.2xx',
      1,
      { cache: 'hit' },
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.ok',
      1,
      { cache: 'hit' },
    )
  })
})
