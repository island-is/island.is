import type { Logger } from '@nestjs/common'

import { retry } from './retry'

jest.useFakeTimers()

describe('retry function', () => {
  const mockLogger: Logger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
  } as unknown as Logger

  beforeEach(() => {
    jest.clearAllMocks()
  })

  type MockResponse<T> = T | Error

  function createMockFn<T>(
    responses: MockResponse<T>[],
  ): jest.Mock<Promise<T>> {
    const mockFn = jest.fn<Promise<T>, []>()

    responses.forEach((response) => {
      if (response instanceof Error) {
        mockFn.mockRejectedValueOnce(response)
      } else {
        mockFn.mockResolvedValueOnce(response)
      }
    })

    return mockFn
  }

  it('resolves immediately if successful', async () => {
    const mockFn = createMockFn<string>(['success'])

    const resultPromise = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 1000,
      logger: mockLogger,
    })
    jest.runAllTimers()

    await expect(resultPromise).resolves.toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockLogger.warn).not.toHaveBeenCalled()
  })

  it('retries once on failure then succeeds', async () => {
    const mockFn = createMockFn<string>([
      new Error('Temporary error'),
      'success',
    ])

    const resultPromise = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 1000,
      logger: mockLogger,
    })

    jest.advanceTimersByTime(1000)
    await Promise.resolve()

    await expect(resultPromise).resolves.toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockLogger.warn).toHaveBeenCalledTimes(1)
  })

  it('fails after max retries exceeded', async () => {
    const mockFn = createMockFn<string>([
      new Error('Error 1'),
      new Error('Error 2'),
      new Error('Final Error'),
    ])

    const resultPromise = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 1000,
      logger: mockLogger,
    })

    jest.runAllTimers()

    await expect(resultPromise).rejects.toThrow('Final Error')
    expect(mockFn).toHaveBeenCalledTimes(3)
    expect(mockLogger.warn).toHaveBeenCalledTimes(2)
    expect(mockLogger.error).toHaveBeenCalledTimes(1)
  })

  it('does not retry if shouldRetryOnError returns false', async () => {
    const mockFn = createMockFn<string>([new Error('400 Bad Request')])

    const resultPromise = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 1000,
      shouldRetryOnError: (error: Error) => !error.message.includes('400'),
      logger: mockLogger,
    })

    jest.runAllTimers()

    await expect(resultPromise).rejects.toThrow('400 Bad Request')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockLogger.warn).not.toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledTimes(1)
  })

  it('properly waits between retries and respects retry delay', async () => {
    const mockFn = createMockFn<string>([
      new Error('Error 1'),
      new Error('Error 2'),
      'success',
    ])

    const resultPromise = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 1000,
      logger: mockLogger,
    })

    expect(mockFn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    expect(mockFn).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(1000)
    await Promise.resolve()
    expect(mockFn).toHaveBeenCalledTimes(3)

    await expect(resultPromise).resolves.toBe('success')
    expect(mockLogger.warn).toHaveBeenCalledTimes(2)
  })
})
