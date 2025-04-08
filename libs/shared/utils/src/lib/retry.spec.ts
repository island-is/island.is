import { retry } from './retry'

describe('retry function', () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }

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

    const result = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 0,
      logger: mockLogger,
    })

    await expect(result).resolves.toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockLogger.warn).not.toHaveBeenCalled()
  })

  it('retries once on failure then succeeds', async () => {
    const mockFn = createMockFn<string>([
      new Error('Temporary error'),
      'success',
    ])

    const result = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 0,
      logger: mockLogger,
    })

    await expect(result).resolves.toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockLogger.warn).toHaveBeenCalledTimes(1)
  })

  it('fails after max retries exceeded', async () => {
    const mockFn = createMockFn<string>([
      new Error('Error 1'),
      new Error('Error 2'),
      new Error('Final Error'),
    ])

    const result = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 0,
      logger: mockLogger,
    })

    await expect(result).rejects.toThrow('Final Error')
    expect(mockFn).toHaveBeenCalledTimes(3)
    expect(mockLogger.warn).toHaveBeenCalledTimes(2)
    expect(mockLogger.error).toHaveBeenCalledTimes(1)
  })

  it('does not retry if shouldRetryOnError returns false', async () => {
    const mockFn = createMockFn<string>([new Error('400 Bad Request')])

    const result = retry(mockFn, {
      maxRetries: 3,
      retryDelayMs: 0,
      shouldRetryOnError: (error: Error) => !error.message.includes('400'),
      logger: mockLogger,
    })

    await expect(result).rejects.toThrow('400 Bad Request')
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockLogger.warn).not.toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledTimes(1)
  })

  it('properly waits between retries and respects retry delay', async () => {
    jest.useFakeTimers()

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

    await jest.runOnlyPendingTimersAsync()
    expect(mockFn).toHaveBeenCalledTimes(2)

    await jest.runOnlyPendingTimersAsync()
    expect(mockFn).toHaveBeenCalledTimes(3)

    await expect(resultPromise).resolves.toBe('success')
    expect(mockLogger.warn).toHaveBeenCalledTimes(2)

    jest.useRealTimers()
  })
})
