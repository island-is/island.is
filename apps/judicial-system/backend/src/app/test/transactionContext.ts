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

  // The middleware calls next() synchronously inside its ALS store, so the
  // promise work() returns is available as soon as use() has returned.
  let result: Promise<T> | undefined

  middleware.use({} as Request, response, (() => {
    result = work()
  }) as NextFunction)

  if (!result) {
    throw new Error('TransactionContextMiddleware did not call next()')
  }

  return await result
}
