import { AsyncLocalStorage } from 'async_hooks'
import type { NextFunction, Request, Response } from 'express'
import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

export type AfterCommitCallback = () => Promise<void>

export interface TransactionContext {
  /** The transaction owned by this request, once something has asked for one. */
  transaction: Transaction | null
  /** True once the transaction has been committed or rolled back. */
  settled: boolean
  /** Callbacks to run after a successful commit, in registration order. */
  afterCommit: AfterCommitCallback[]
  /**
   * The in-flight `sequelize.transaction()` call, so that two concurrent
   * `getOrCreateTransaction` callers share one transaction instead of leaking
   * a second one that nothing will ever settle.
   */
  creating: Promise<Transaction> | null
}

const transactionStorage = new AsyncLocalStorage<TransactionContext>()

const requireTransactionContext = (): TransactionContext => {
  const context = transactionStorage.getStore()

  if (!context) {
    throw new InternalServerErrorException(
      'Transaction context is not available. Make sure to use TransactionContextMiddleware.',
    )
  }

  return context
}

/**
 * The request's transaction slot, or undefined outside a request. Reading it is
 * deliberately tolerant: on an unflagged route nobody opens a transaction, and
 * that is an answer rather than a failure.
 */
export const getTransactionContext = (): TransactionContext | undefined =>
  transactionStorage.getStore()

/**
 * Opens the request's transaction, or returns the one already open.
 *
 * The caller must not commit or roll it back: `TransactionCommitInterceptor`
 * commits on the success path and `TransactionContextMiddleware` rolls back
 * anything still open when the response ends.
 */
export const getOrCreateTransaction = async (
  sequelize: Sequelize,
): Promise<Transaction> => {
  const context = requireTransactionContext()

  if (context.transaction) {
    return context.transaction
  }

  if (!context.creating) {
    // Clear the slot on failure, so that a caller which handles the error can
    // try again instead of awaiting the same rejected promise for the rest of
    // the request.
    context.creating = sequelize.transaction().catch((error) => {
      context.creating = null

      throw error
    })
  }

  context.transaction = await context.creating

  return context.transaction
}

/**
 * Registers a callback to run after the request's transaction has committed, or
 * on the way out of a successful request that opened none. Use it for side
 * effects that assert that something happened - announcing one before commit
 * risks claiming an outcome the database never accepted.
 */
export const registerAfterCommit = (callback: AfterCommitCallback) => {
  requireTransactionContext().afterCommit.push(callback)
}

@Injectable()
export class TransactionContextMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  use(_: Request, res: Response, next: NextFunction) {
    const context: TransactionContext = {
      transaction: null,
      settled: false,
      afterCommit: [],
      creating: null,
    }

    return transactionStorage.run(context, () => {
      // 'close' rather than 'finish': 'finish' fires only for a response that
      // was sent in full, so a client abort would leak a transaction holding a
      // row lock. Nothing but the interceptor ever commits, so a transaction
      // still open here is by definition one that never succeeded, and rolling
      // it back after the response is harmless.
      //
      // The slot is captured rather than read back from the store, because
      // 'close' can be emitted from the socket rather than from the request's
      // own async context.
      res.on('close', async () => {
        if (!context.transaction || context.settled) {
          return
        }

        context.settled = true

        try {
          await context.transaction.rollback()
        } catch (error) {
          this.logger.error('Failed to roll back request transaction', {
            error,
          })
        }
      })

      return next()
    })
  }
}
