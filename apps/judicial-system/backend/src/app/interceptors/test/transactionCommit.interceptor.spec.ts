import { lastValueFrom, of, tap, throwError } from 'rxjs'
import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import { CallHandler, ExecutionContext } from '@nestjs/common'

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

      const { value, settled } = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        const value = await lastValueFrom(interceptor.intercept(context, next))

        return { value, settled: getTransactionContext()?.settled }
      })

      expect(transaction.commit).toHaveBeenCalledTimes(1)
      expect(settled).toBe(true)
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

      const settled = await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)
        registerAfterCommit(callback)

        await expect(
          lastValueFrom(interceptor.intercept(context, next)),
        ).rejects.toBe(error)

        return getTransactionContext()?.settled
      })

      expect(settled).toBe(true)
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
  })
})
