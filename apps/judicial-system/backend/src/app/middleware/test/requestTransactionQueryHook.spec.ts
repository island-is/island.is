import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import type { Logger } from '@island.is/logging'

import { runInRequestContext } from '../../test'
import {
  createRequestTransactionQueryHook,
  HookedQueryOptions,
  QueryOutsideRequestTransactionError,
} from '../requestTransactionQueryHook'
import {
  getOrCreateTransaction,
  getTransactionContext,
} from '../transactionContext.middleware'

describe('createRequestTransactionQueryHook', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const strictHook = createRequestTransactionQueryHook({
    logger,
    strict: true,
  })
  const reportingHook = createRequestTransactionQueryHook({
    logger,
    strict: false,
  })

  const transaction = {} as Transaction
  const sequelize = {
    transaction: jest.fn().mockResolvedValue(transaction),
  } as unknown as Sequelize

  const findOnUser: HookedQueryOptions = {
    type: 'SELECT',
    model: { name: 'User' } as HookedQueryOptions['model'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('while the request transaction is open', () => {
    it('should refuse a query that carries no transaction', async () => {
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        expect(() => strictHook(findOnUser)).toThrow(
          QueryOutsideRequestTransactionError,
        )
        expect(() => strictHook(findOnUser)).toThrow(
          'A SELECT query on User ran outside the open request transaction',
        )
      })

      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should report a query that carries no transaction when not strict', async () => {
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        expect(() => reportingHook(findOnUser)).not.toThrow()
      })

      expect(logger.error).toHaveBeenCalledTimes(1)
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          'A SELECT query on User ran outside the open request transaction',
        ),
        { queryType: 'SELECT', model: 'User' },
      )
    })

    it('should describe a raw query without a model', async () => {
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        expect(() => strictHook({ type: 'RAW' })).toThrow(
          'A RAW query on no model ran outside the open request transaction',
        )
      })
    })

    it('should let a query on the request transaction through', async () => {
      await runInRequestContext(async () => {
        const requestTransaction = await getOrCreateTransaction(sequelize)

        expect(() =>
          strictHook({ ...findOnUser, transaction: requestTransaction }),
        ).not.toThrow()
      })

      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should let a query on another transaction through', async () => {
      // A handler opening a transaction of its own on a locked route is the
      // self-deadlock CaseExistsForUpdateGuard documents, and is left to that
      // rule: the hook only catches a query with no transaction at all.
      await runInRequestContext(async () => {
        await getOrCreateTransaction(sequelize)

        expect(() =>
          strictHook({ ...findOnUser, transaction: {} as Transaction }),
        ).not.toThrow()
      })

      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should catch a query while the transaction is still opening', async () => {
      // The slot holds the opening call as soon as something has asked for a
      // transaction, so a query racing the open is caught too - the row lock
      // is about to be taken on the connection the open is acquiring.
      await runInRequestContext(async () => {
        const opening = getOrCreateTransaction(sequelize)

        expect(() => strictHook(findOnUser)).toThrow(
          QueryOutsideRequestTransactionError,
        )

        await opening
      })
    })
  })

  describe('when no request transaction holds a lock', () => {
    it('should do nothing outside a request', () => {
      expect(() => strictHook(findOnUser)).not.toThrow()
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('should do nothing on a request that opened no transaction', async () => {
      await runInRequestContext(async () => {
        expect(() => strictHook(findOnUser)).not.toThrow()
      })

      expect(logger.error).not.toHaveBeenCalled()
    })

    it.each(['settling', 'committed', 'settled'] as const)(
      'should do nothing once the transaction is %s',
      async (settlement) => {
        // The after commit callbacks run with the slot committed and the row
        // lock released, so a query there needs no transaction.
        await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          const context = getTransactionContext()
          if (!context) {
            throw new Error('Expected a transaction context')
          }
          context.settlement = settlement

          expect(() => strictHook(findOnUser)).not.toThrow()
        })

        expect(logger.error).not.toHaveBeenCalled()
      },
    )
  })
})
