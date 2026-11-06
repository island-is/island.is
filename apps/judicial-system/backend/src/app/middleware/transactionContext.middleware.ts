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

/**
 * How far the request's transaction has got towards being finished.
 *
 * `settling` exists so that claiming a transaction and finishing with it are
 * distinguishable. Committing is not instantaneous, and both settlers - the
 * interceptor on the success path and the `close` handler on the way out - test
 * this before acting. A single boolean would make them agree only on
 * "finished", leaving the length of the commit as a window in which the close
 * handler saw an unfinished transaction and rolled back what was already
 * committing. Whoever settles claims it first, so the states are exclusive by
 * construction rather than by timing.
 *
 * `committed` is the stretch between a successful commit and the end of the
 * after commit callbacks. The work is durable, so a callback registered now -
 * typically by another callback, announcing what it did - can still run, and
 * does, after the ones already registered. `settled` is the end: a failed
 * commit, a rollback, or a drain that has finished.
 */
export type TransactionSettlement =
  | 'open'
  | 'settling'
  | 'committed'
  | 'settled'

export interface TransactionContext {
  /**
   * The transaction owned by this request, once something has asked for one,
   * held as the promise that opens it rather than as the transaction itself.
   * Two concurrent callers therefore share one transaction instead of leaking
   * a second one that nothing will ever settle, and a request that ends while
   * the transaction is still opening still has something to settle.
   */
  transaction: Promise<Transaction> | null
  /** Whether the transaction is open, being settled, or finished. */
  settlement: TransactionSettlement
  /**
   * Whether the response has ended. The close handler is the request's last
   * settler and has fired by then, so a transaction opened from here on would
   * be one nothing ever rolls back; `getOrCreateTransaction` refuses to open
   * it.
   */
  responseClosed: boolean
  /** Callbacks to run after a successful commit, in registration order. */
  afterCommit: AfterCommitCallback[]
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

  // Once the request's transaction has been claimed, both settlers are spent:
  // the close handler does not fire twice and the interceptor returns early.
  // Opening another one here would hand back a transaction that nothing will
  // ever commit or roll back, holding its row locks until the connection is
  // reaped - the leak this whole mechanism exists to prevent. Refusing is the
  // only safe answer, and it is a programming error rather than a request the
  // caller can recover from.
  if (context.settlement !== 'open') {
    throw new InternalServerErrorException(
      `The request transaction is already ${context.settlement} and cannot be reopened.`,
    )
  }

  // The same leak from the other side: a request that opened no transaction
  // keeps its slot open after the response has ended, so that the interceptor
  // can still run the callbacks of a request the client aborted late, but the
  // close handler that would roll back a transaction opened now has already
  // fired.
  if (context.responseClosed) {
    throw new InternalServerErrorException(
      'The response has already ended and a transaction opened now would never be settled.',
    )
  }

  if (!context.transaction) {
    context.transaction = sequelize.transaction()
  }

  try {
    return await context.transaction
  } catch (error) {
    // Clear the slot on failure, so that a caller which handles the error can
    // try again instead of awaiting the same rejected promise for the rest of
    // the request. Concurrent callers all clear it, which is harmless.
    context.transaction = null

    throw error
  }
}

/**
 * Registers a callback to run after the request's transaction has committed, or
 * on the way out of a successful request that opened none. Use it for side
 * effects that assert that something happened - announcing one before commit
 * risks claiming an outcome the database never accepted.
 *
 * A handler that commits a transaction of its own gets the same guarantee
 * only while it returns right after the commit: the callbacks run on the
 * success path, so work that can fail after a commit would drop them for
 * work the database kept.
 */
export const registerAfterCommit = (callback: AfterCommitCallback) => {
  const context = requireTransactionContext()

  // The interceptor drains the array while the slot is committed, and nothing
  // drains it once the slot is settled or while a commit is in flight: the
  // close handler never drains at all. A callback registered then would sit
  // there until the request's store is discarded, losing the side effect
  // without a trace - the exact outcome this hook exists to prevent. As with
  // reopening a transaction, it is a programming error rather than a condition
  // the caller can recover from.
  if (context.settlement !== 'open' && context.settlement !== 'committed') {
    throw new InternalServerErrorException(
      `The request transaction is already ${context.settlement}; an after commit callback registered now would never run.`,
    )
  }

  context.afterCommit.push(callback)
}

@Injectable()
export class TransactionContextMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  use(_: Request, res: Response, next: NextFunction) {
    const context: TransactionContext = {
      transaction: null,
      settlement: 'open',
      responseClosed: false,
      afterCommit: [],
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
        // Recorded first, whatever the slot's state: a transaction opened
        // after this point would have no settler.
        context.responseClosed = true

        // Anything but 'open' means the interceptor has this: it is committing
        // right now, in which case rolling back would race its COMMIT on the
        // same transaction, it is running the after commit callbacks, or it
        // has already finished.
        if (context.settlement !== 'open') {
          return
        }

        // A request that opened no transaction keeps its slot open. Its
        // handler may have committed a transaction of its own and returned,
        // with the interceptor still on its way - a route-level interceptor's
        // work runs first - when the client aborted. The work is durable, so
        // the interceptor still runs the callbacks, which is where the
        // announcements of that work are made; settling the slot here would
        // drop them silently. A request that failed instead never reaches the
        // interceptor, and its callbacks are dropped as on any failed request.
        if (!context.transaction) {
          return
        }

        context.settlement = 'settled'

        // The slot holds the opening call, which may still be in flight: a
        // request that ends while its transaction is opening is exactly the
        // case that would otherwise leak one nothing settles. Waiting for it
        // can leave the caller holding a transaction that is rolled back
        // underneath it, which is the right outcome for a request whose
        // response has already ended.
        //
        let transaction: Transaction

        try {
          transaction = await context.transaction
        } catch {
          // An opening call that failed has nothing to roll back, and its
          // error belongs to the caller that asked for the transaction, so it
          // is not reported again here.
          return
        }

        try {
          await transaction.rollback()
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
