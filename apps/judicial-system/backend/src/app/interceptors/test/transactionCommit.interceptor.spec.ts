import { lastValueFrom, of, tap, throwError } from 'rxjs'
import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import {
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import {
  getOrCreateTransaction,
  getTransactionContext,
  registerAfterCommit,
} from '../../middleware'
import { runInRequestContext } from '../../test'
import { TransactionCommitInterceptor } from '../transactionCommit.interceptor'

describe('TransactionCommitInterceptor', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const interceptor = new TransactionCommitInterceptor(logger)
  const context = {} as ExecutionContext

  let transaction: Transaction & { commit: jest.Mock; rollback: jest.Mock }
  let sequelize: Sequelize

  beforeEach(() => {
    jest.clearAllMocks()

    transaction = {
      commit: jest.fn().mockResolvedValue(undefined),
      rollback: jest.fn().mockResolvedValue(undefined),
    } as unknown as Transaction & { commit: jest.Mock; rollback: jest.Mock }
    sequelize = {
      transaction: jest.fn().mockResolvedValue(transaction),
    } as unknown as Sequelize
  })

  describe('a transaction was opened', () => {
    it('should commit it, settle the slot and forward the value', async () => {
      const next: CallHandler = { handle: () => of('some value') }

      const { value, settlement } = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        const value = await lastValueFrom(interceptor.intercept(context, next))

        return { value, settlement: getTransactionContext()?.settlement }
      })

      expect(transaction.commit).toHaveBeenCalledTimes(1)
      expect(settlement).toBe('settled')
      expect(value).toBe('some value')
    })

    it('should commit before the value is delivered', async () => {
      const order: string[] = []
      transaction.commit.mockImplementationOnce(async () => {
        order.push('commit')
      })
      const next: CallHandler = { handle: () => of('some value') }

      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        await lastValueFrom(
          interceptor.intercept(context, next).pipe(
            tap(() => {
              order.push('value')
            }),
          ),
        )
      })

      expect(order).toEqual(['commit', 'value'])
    })

    it('should run the after commit callbacks in registration order', async () => {
      const order: string[] = []
      const next: CallHandler = { handle: () => of('some value') }

      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)
        registerAfterCommit(async () => {
          order.push('first')
        })
        registerAfterCommit(async () => {
          order.push('second')
        })

        await lastValueFrom(interceptor.intercept(context, next))
      })

      expect(order).toEqual(['first', 'second'])
    })

    it('should settle the slot, skip the callbacks and rethrow a failed commit', async () => {
      const error = new Error('Some error')
      transaction.commit.mockRejectedValueOnce(error)
      const callback = jest.fn()
      const next: CallHandler = { handle: () => of('some value') }

      const settlement = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)
        registerAfterCommit(callback)

        await expect(
          lastValueFrom(interceptor.intercept(context, next)),
        ).rejects.toBe(error)

        return getTransactionContext()?.settlement
      })

      expect(settlement).toBe('settled')
      expect(callback).not.toHaveBeenCalled()
    })

    it('should log a failed after commit callback rather than fail the request', async () => {
      const error = new Error('Some error')
      const next: CallHandler = { handle: () => of('some value') }

      const value = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)
        registerAfterCommit(async () => {
          throw error
        })

        return await lastValueFrom(interceptor.intercept(context, next))
      })

      expect(value).toBe('some value')
      expect(logger.error).toHaveBeenCalledWith(
        'An after commit callback failed',
        { error },
      )
    })

    it('should refuse a callback that registers another callback, without failing the request', async () => {
      const second = jest.fn()
      const next: CallHandler = { handle: () => of('some value') }

      const value = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)
        registerAfterCommit(async () => {
          // The slot is settled by the time the callbacks are drained, so this
          // registration is refused: the callback would be appended to the
          // array being iterated, and would run in a drain that has already
          // passed the commit it was meant to follow.
          registerAfterCommit(second)
        })

        return await lastValueFrom(interceptor.intercept(context, next))
      })

      expect(second).not.toHaveBeenCalled()
      expect(value).toBe('some value')
      expect(logger.error).toHaveBeenCalledWith(
        'An after commit callback failed',
        { error: expect.any(InternalServerErrorException) },
      )
    })

    it('should claim the slot before committing, so a response that closes mid commit does not roll it back', async () => {
      let finishCommit: () => void = () => undefined
      transaction.commit.mockReturnValueOnce(
        new Promise<void>((resolve) => {
          finishCommit = resolve
        }),
      )
      const next: CallHandler = { handle: () => of('some value') }

      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        const intercepted = lastValueFrom(interceptor.intercept(context, next))

        // Let the interceptor reach the pending commit, then look at the slot
        // the way the middleware's close handler would: a client abort here
        // must find the transaction claimed, not open, or it would roll back a
        // COMMIT that is already in flight.
        await Promise.resolve()

        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(getTransactionContext()?.settlement).toBe('settling')

        finishCommit()

        await intercepted

        expect(getTransactionContext()?.settlement).toBe('settled')
        expect(transaction.rollback).not.toHaveBeenCalled()
      })
    })

    it('should not commit when the handler failed', async () => {
      const error = new Error('Some error')
      const next: CallHandler = { handle: () => throwError(() => error) }

      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        await expect(
          lastValueFrom(interceptor.intercept(context, next)),
        ).rejects.toBe(error)
      })

      expect(transaction.commit).not.toHaveBeenCalled()
    })
  })

  describe('no transaction was opened', () => {
    it('should forward the value untouched', async () => {
      const next: CallHandler = { handle: () => of('some value') }

      const value = await runInRequestContext(
        async () => await lastValueFrom(interceptor.intercept(context, next)),
      )

      expect(sequelize.transaction).not.toHaveBeenCalled()
      expect(value).toBe('some value')
    })

    it('should still run the after commit callbacks', async () => {
      const callback = jest.fn()
      const next: CallHandler = { handle: () => of('some value') }

      await runInRequestContext(async () => {
        registerAfterCommit(callback)

        await lastValueFrom(interceptor.intercept(context, next))
      })

      // There is nothing to wait for, but the request succeeded - dropping the
      // callback would lose the side effect silently.
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
