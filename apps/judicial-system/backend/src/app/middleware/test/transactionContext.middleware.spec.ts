import type { NextFunction, Request, Response } from 'express'
import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import { InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import {
  getOrCreateTransaction,
  getTransactionContext,
  registerAfterCommit,
  TransactionContextMiddleware,
} from '../transactionContext.middleware'

const createTransaction = () =>
  ({
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  } as unknown as Transaction & { rollback: jest.Mock; commit: jest.Mock })

const createResponse = () => {
  const listeners: Record<string, () => Promise<void> | void> = {}

  return {
    on: (event: string, listener: () => Promise<void> | void) => {
      listeners[event] = listener
    },
    emit: async (event: string) => await listeners[event]?.(),
  }
}

describe('TransactionContextMiddleware', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const middleware = new TransactionContextMiddleware(logger)

  // Runs work inside a request that the middleware has wrapped, and hands back
  // the response so that the test can end the request afterwards. work also
  // receives the response, for the cases that have to end it from inside the
  // request's own context rather than after it.
  const givenARequest = async (
    work: (res: ReturnType<typeof createResponse>) => Promise<void> | void,
  ) => {
    const res = createResponse()

    // The middleware calls next() synchronously inside its ALS store, so the
    // promise work() returns is available as soon as use() has returned.
    let result: Promise<void> | undefined

    middleware.use(
      {} as Request,
      res as unknown as Response,
      (() => {
        result = Promise.resolve(work(res))
      }) as NextFunction,
    )

    await result

    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('outside a request', () => {
    it('should have no slot', () => {
      expect(getTransactionContext()).toBeUndefined()
    })

    it('should refuse to open a transaction or register a callback', async () => {
      const sequelize = { transaction: jest.fn() } as unknown as Sequelize

      await expect(getOrCreateTransaction(sequelize)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      )
      expect(() => registerAfterCommit(async () => undefined)).toThrow(
        InternalServerErrorException,
      )
      expect(sequelize.transaction).not.toHaveBeenCalled()
    })
  })

  describe('inside a request', () => {
    it('should expose an empty slot', async () => {
      await givenARequest(() => {
        expect(getTransactionContext()).toEqual({
          transaction: null,
          settlement: 'open',
          afterCommit: [],
        })
      })
    })

    it('should open one transaction and reuse it', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      await givenARequest(async () => {
        const first = await getOrCreateTransaction(sequelize)
        const second = await getOrCreateTransaction(sequelize)

        expect(first).toBe(transaction)
        expect(second).toBe(transaction)
        await expect(getTransactionContext()?.transaction).resolves.toBe(
          transaction,
        )
        expect(sequelize.transaction).toHaveBeenCalledTimes(1)
      })
    })

    it('should open one transaction for concurrent callers', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      await givenARequest(async () => {
        const transactions = await Promise.all([
          getOrCreateTransaction(sequelize),
          getOrCreateTransaction(sequelize),
        ])

        expect(transactions).toEqual([transaction, transaction])
        expect(sequelize.transaction).toHaveBeenCalledTimes(1)
      })
    })

    it('should not let a caller retry a failed open after the response closed', async () => {
      const error = new Error('Some error')
      const transaction = createTransaction()
      let failToOpen: (error: Error) => void = () => undefined
      const sequelize = {
        transaction: jest
          .fn()
          .mockReturnValueOnce(
            new Promise<Transaction>((_, reject) => {
              failToOpen = reject
            }),
          )
          .mockResolvedValueOnce(transaction),
      } as unknown as Sequelize

      // The response ends while the transaction is still opening, and the open
      // then fails. The close handler has settled the slot and will not fire
      // again, so the caller handling that rejection must not be handed a
      // second transaction - nothing would be left to settle it.
      await givenARequest(async (res) => {
        const opening = getOrCreateTransaction(sequelize)

        const closed = res.emit('close')

        failToOpen(error)

        await closed
        await expect(opening).rejects.toBe(error)

        await expect(getOrCreateTransaction(sequelize)).rejects.toBeInstanceOf(
          InternalServerErrorException,
        )
      })

      expect(sequelize.transaction).toHaveBeenCalledTimes(1)
    })

    it('should let a caller retry after a failed transaction open', async () => {
      const error = new Error('Some error')
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest
          .fn()
          .mockRejectedValueOnce(error)
          .mockResolvedValueOnce(transaction),
      } as unknown as Sequelize

      await givenARequest(async () => {
        await expect(getOrCreateTransaction(sequelize)).rejects.toBe(error)

        // The rejected promise must not stay in the slot, or every later
        // caller in this request awaits the same failure.
        await expect(getOrCreateTransaction(sequelize)).resolves.toBe(
          transaction,
        )
      })
    })

    it('should refuse to open a transaction once the slot is settled', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      await givenARequest(async () => {
        const context = getTransactionContext()

        // Both settlers are spent by this point, so a transaction opened now
        // would be one nothing ever commits or rolls back.
        if (context) {
          context.settlement = 'settled'
        }

        await expect(getOrCreateTransaction(sequelize)).rejects.toBeInstanceOf(
          InternalServerErrorException,
        )
        expect(sequelize.transaction).not.toHaveBeenCalled()
      })
    })

    it('should refuse to reopen a transaction while the slot is being settled', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)

        const context = getTransactionContext()

        if (context) {
          context.settlement = 'settling'
        }

        await expect(getOrCreateTransaction(sequelize)).rejects.toBeInstanceOf(
          InternalServerErrorException,
        )
        expect(sequelize.transaction).toHaveBeenCalledTimes(1)
      })
    })

    it('should collect after commit callbacks in registration order', async () => {
      const first = async () => undefined
      const second = async () => undefined

      await givenARequest(() => {
        registerAfterCommit(first)
        registerAfterCommit(second)

        expect(getTransactionContext()?.afterCommit).toEqual([first, second])
      })
    })

    it('should refuse to register an after commit callback while the slot is being settled', async () => {
      await givenARequest(() => {
        const context = getTransactionContext()

        if (context) {
          context.settlement = 'settling'
        }

        expect(() => registerAfterCommit(async () => undefined)).toThrow(
          InternalServerErrorException,
        )
        expect(context?.afterCommit).toEqual([])
      })
    })

    it('should refuse to register an after commit callback once the slot is settled', async () => {
      await givenARequest(() => {
        const context = getTransactionContext()

        // The interceptor settles the slot before it drains the callbacks, and
        // the close handler never drains them at all, so a callback registered
        // now would be one nothing ever runs.
        if (context) {
          context.settlement = 'settled'
        }

        expect(() => registerAfterCommit(async () => undefined)).toThrow(
          InternalServerErrorException,
        )
        expect(context?.afterCommit).toEqual([])
      })
    })
  })

  describe('when the response ends', () => {
    it('should roll back an open transaction', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      const res = await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)
      })

      await res.emit('close')

      expect(transaction.rollback).toHaveBeenCalledTimes(1)
    })

    it('should not roll back a settled transaction', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      const res = await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)

        // The interceptor settles the slot it already holds; the middleware
        // only has to respect the state.
        const context = getTransactionContext()

        if (context) {
          context.settlement = 'settled'
        }
      })

      await res.emit('close')

      expect(transaction.rollback).not.toHaveBeenCalled()
    })

    it('should not roll back a transaction that is being settled', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      const res = await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)

        // What the interceptor looks like mid-commit: it has claimed the slot
        // but COMMIT has not come back yet. Rolling back here would race it on
        // the same transaction.
        const context = getTransactionContext()

        if (context) {
          context.settlement = 'settling'
        }
      })

      await res.emit('close')

      expect(transaction.rollback).not.toHaveBeenCalled()
    })

    it('should not roll back twice', async () => {
      const transaction = createTransaction()
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      const res = await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)
      })

      await res.emit('close')
      await res.emit('close')

      expect(transaction.rollback).toHaveBeenCalledTimes(1)
    })

    it('should do nothing when no transaction was opened', async () => {
      const res = await givenARequest(() => undefined)

      await expect(res.emit('close')).resolves.toBeUndefined()
    })

    it('should roll back a transaction that is still opening', async () => {
      const transaction = createTransaction()
      let openTransaction: (transaction: Transaction) => void = () => undefined
      const sequelize = {
        transaction: jest.fn().mockReturnValue(
          new Promise<Transaction>((resolve) => {
            openTransaction = resolve
          }),
        ),
      } as unknown as Sequelize

      // The request asks for a transaction and the response ends before the
      // database has handed one over - the case that would otherwise leave an
      // open transaction nothing ever settles.
      let opening: Promise<Transaction> | undefined

      const res = await givenARequest(() => {
        opening = getOrCreateTransaction(sequelize)
      })

      const closed = res.emit('close')

      openTransaction(transaction)

      await closed

      expect(transaction.rollback).toHaveBeenCalledTimes(1)
      await expect(opening).resolves.toBe(transaction)
    })

    it('should not report a failure to open as a failure to roll back', async () => {
      const error = new Error('Some error')
      let failToOpen: (error: Error) => void = () => undefined
      const sequelize = {
        transaction: jest.fn().mockReturnValue(
          new Promise<Transaction>((_, reject) => {
            failToOpen = reject
          }),
        ),
      } as unknown as Sequelize

      let opening: Promise<Transaction> | undefined

      const res = await givenARequest(() => {
        opening = getOrCreateTransaction(sequelize)
      })

      const closed = res.emit('close')

      failToOpen(error)

      await closed

      // Nothing was opened, so there is nothing to roll back, and the error
      // belongs to the caller that asked for the transaction.
      await expect(opening).rejects.toBe(error)
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should log a failed rollback rather than throw', async () => {
      const error = new Error('Some error')
      const transaction = createTransaction()
      transaction.rollback.mockRejectedValueOnce(error)
      const sequelize = {
        transaction: jest.fn().mockResolvedValue(transaction),
      } as unknown as Sequelize

      const res = await givenARequest(async () => {
        await getOrCreateTransaction(sequelize)
      })

      await expect(res.emit('close')).resolves.toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to roll back request transaction',
        { error },
      )
    })
  })
})
