import {
  EnhancedFetchTestEnv,
  fakeResponse,
  setupTestEnv,
} from '../../test/setup'

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
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(1, 'requests')
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.2xx',
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.ok',
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
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(1, 'requests')
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.3xx',
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.ok',
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
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(1, 'requests')
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.4xx',
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
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
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(1, 'requests')
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.5xx',
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
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
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(1, 'requests')
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      2,
      'requests.network_error',
    )
    expect(env.metricsClient.increment).toHaveBeenNthCalledWith(
      3,
      'requests.error',
    )
  })
})
