import { Problem } from '@island.is/shared/problem'
import { Logger } from '@island.is/logging'
import { ProblemError } from './ProblemError'
import { CreateRequest, setup } from './test/setup'
import { BYPASS_ERROR_FILTER_URLS } from './base-problem.filter'
import { HttpStatus, ServiceUnavailableException } from '@nestjs/common'

describe('BaseProblemFilter', () => {
  describe('default logging', () => {
    let request: CreateRequest
    let handler: jest.Mock
    let logger: Logger
    let errorLog: jest.SpyInstance
    let infoLog: jest.SpyInstance
    beforeAll(async () => {
      ;[request, handler, logger] = await setup({
        handler: () => {
          const error = new Error('500+ error')
          ;(error as ProblemError).problem = {
            status: 500,
          } as Problem
          throw error
        },
      })
      errorLog = jest.spyOn(logger, 'error').mockImplementation(() => logger)
      infoLog = jest.spyOn(logger, 'info').mockImplementation(() => logger)
    })

    beforeEach(() => {
      errorLog.mockClear()
      infoLog.mockClear()
    })

    it('logs 500+ errors', async () => {
      // Act
      await request()

      // Assert
      expect(infoLog).not.toHaveBeenCalled()
      expect(errorLog).toHaveBeenCalled()
      expect(errorLog.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: 500+ error]`,
      )
    })

    it('logs no 500- errors', async () => {
      // Arrange
      handler.mockImplementation(() => {
        const error = new Error('500- error')
        ;(error as ProblemError).problem = { status: 400 } as Problem
        throw error
      })

      // Act
      await request()

      // Assert
      expect(infoLog).not.toHaveBeenCalled()
      expect(errorLog).not.toHaveBeenCalled()
    })
  })

  describe('with logAllErrors', () => {
    let request: CreateRequest
    let handler: jest.Mock
    let logger: Logger
    let errorLog: jest.SpyInstance
    let infoLog: jest.SpyInstance
    beforeAll(async () => {
      ;[request, handler, logger] = await setup({
        problemOptions: { logAllErrors: true },
        handler: () => {
          const error = new Error('500+ error')
          ;(error as ProblemError).problem = {
            status: 500,
          } as Problem
          throw error
        },
      })
      errorLog = jest.spyOn(logger, 'error').mockImplementation(() => logger)
      infoLog = jest.spyOn(logger, 'info').mockImplementation(() => logger)
    })

    beforeEach(() => {
      errorLog.mockClear()
      infoLog.mockClear()
    })

    it('logs 500+ errors', async () => {
      // Act
      await request()

      // Assert
      expect(infoLog).not.toHaveBeenCalled()
      expect(errorLog).toHaveBeenCalled()
      expect(errorLog.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: 500+ error]`,
      )
    })

    it('logs no 500- errors', async () => {
      // Arrange
      handler.mockImplementation(() => {
        const error = new Error('500- error')
        ;(error as ProblemError).problem = { status: 400 } as Problem
        throw error
      })

      // Act
      await request()

      // Assert
      expect(infoLog).toHaveBeenCalled()
      expect(infoLog.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: 500- error]`,
      )
      expect(errorLog).not.toHaveBeenCalled()
    })
  })

  describe('bypass error filter', () => {
    BYPASS_ERROR_FILTER_URLS.forEach((url) => {
      it(`for whitelisted url ${url} should respect status code and not transform to ProblemJSON`, async () => {
        // Arrange
        const payload = { status: 'error' }
        const [request] = await setup({
          restRoute: url,
          handler: () => {
            throw new ServiceUnavailableException(payload)
          },
        })

        // Act
        const response = await request()

        // Assert
        expect(response.status).toBe(HttpStatus.SERVICE_UNAVAILABLE)
        expect(response.body).toMatchObject(payload)
      })
    })
  })
})
