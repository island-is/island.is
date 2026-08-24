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
  // the response so that the test can end the request afterwards.
  const givenARequest = async (work: () => Promise<void> | void) => {
    const res = createResponse()

    // The middleware calls next() synchronously inside its ALS store, so the
    // promise work() returns is available as soon as use() has returned.
    let result: Promise<void> | undefined

    middleware.use(
      {} as Request,
      res as unknown as Response,
      (() => {
        result = Promise.resolve(work())
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
          settled: false,
          afterCommit: [],
          creating: null,
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
        expect(getTransactionContext()?.transaction).toBe(transaction)
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

    it('should collect after commit callbacks in registration order', async () => {
      const first = async () => undefined
      const second = async () => undefined

      await givenARequest(() => {
        registerAfterCommit(first)
        registerAfterCommit(second)

        expect(getTransactionContext()?.afterCommit).toEqual([first, second])
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
        // only has to respect the flag.
        const context = getTransactionContext()

        if (context) {
          context.settled = true
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
