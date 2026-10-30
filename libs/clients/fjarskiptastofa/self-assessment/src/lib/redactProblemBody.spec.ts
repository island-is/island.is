import type { Logger } from '@island.is/logging'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { redactProblemBody } from './redactProblemBody'

const fakeLogger = () =>
  ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  } as unknown as Logger)

describe('redactProblemBody', () => {
  it('should drop the problem field from a log entry', () => {
    const logger = fakeLogger()

    redactProblemBody(logger).log('warn', {
      message: 'Fetch failure',
      problem: { title: 'Validation error', errors: { remark: ['too long'] } },
    })

    expect(logger.log).toHaveBeenCalledWith('warn', {
      message: 'Fetch failure',
      problem: undefined,
    })
  })

  it('should leave the rest of the logger alone', () => {
    const logger = fakeLogger()

    redactProblemBody(logger).error('Something else')

    expect(logger.error).toHaveBeenCalledWith('Something else')
  })

  // The leak this guards against: enhanced fetch logs the thrown FetchError,
  // which carries the parsed problem+json body even with response body logging
  // turned off.
  it('should keep a problem+json error response out of the logs', async () => {
    const logger = fakeLogger()
    const enhancedFetch = createEnhancedFetch({
      name: 'test',
      logger: redactProblemBody(logger),
      logErrorResponseBody: false,
      circuitBreaker: false,
      fetch: jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: 'Validation error',
            errors: { 'assessmentResponses[0].remark': ['secret remark'] },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/problem+json' },
          },
        ),
      ) as never,
    })

    await enhancedFetch('http://localhost/submit').catch(() => null)

    expect(logger.log).toHaveBeenCalledWith(
      'warn',
      expect.objectContaining({ problem: undefined }),
    )
    expect(JSON.stringify((logger.log as jest.Mock).mock.calls)).not.toContain(
      'secret remark',
    )
  })
})
