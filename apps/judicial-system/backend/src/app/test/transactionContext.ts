import type { NextFunction, Request, Response } from 'express'

import type { Logger } from '@island.is/logging'

import { TransactionContextMiddleware } from '../middleware'

const silentLogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
} as unknown as Logger

/**
 * Runs `work` inside a request wrapped by `TransactionContextMiddleware`, so
 * that the code under test can reach the request's transaction slot. The
 * response is never ended, so nothing is rolled back on the way out - a test
 * that needs the rollback should drive the middleware itself.
 */
export const runInRequestContext = async <T>(
  work: () => Promise<T>,
): Promise<T> => {
  const middleware = new TransactionContextMiddleware(silentLogger)
  const response = { on: () => undefined } as unknown as Response

  return await new Promise<T>((resolve, reject) => {
    middleware.use({} as Request, response, (() => {
      work().then(resolve, reject)
    }) as NextFunction)
  })
}
