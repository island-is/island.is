import {
  createEnhancedFetch,
  EnhancedFetchOptions,

} from './createEnhancedFetch'
import { Logger } from 'winston'
import { Response } from 'node-fetch'
import { SetOptional } from 'type-fest'
import CircuitBreaker from 'opossum'
import { FetchAPI } from './types';

const fakeResponse = (...args: ConstructorParameters<typeof Response>) =>
  new Response(...args)

const timeout = 500

describe('EnhancedFetch', () => {
  let enhancedFetch: FetchAPI
  let fetch: jest.Mock<ReturnType<FetchAPI>>
  let logger: { log: jest.Mock; error: jest.Mock }

  const createTestEnhancedFetch = (
    override?: SetOptional<EnhancedFetchOptions, 'name'>,
  ) =>
    createEnhancedFetch({
      name: 'test',
      fetch,
      timeout,
      logger: (logger as unknown) as Logger,
      ...override,
      circuitBreaker: {
        volumeThreshold: 0,
        ...(override?.circuitBreaker as CircuitBreaker.Options),
      },
    })

  beforeEach(() => {
    fetch = jest.fn(() => Promise.resolve(fakeResponse()))
    logger = {
      log: jest.fn(),
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
})
