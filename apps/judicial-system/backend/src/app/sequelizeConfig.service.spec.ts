import type { Transaction } from 'sequelize'
import type { Sequelize } from 'sequelize-typescript'

import type { Logger } from '@island.is/logging'

import {
  getOrCreateTransaction,
  HookedQueryOptions,
  QueryOutsideRequestTransactionError,
} from './middleware'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { runInRequestContext } from './test'

describe('SequelizeConfigService', () => {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger
  const sequelize = {
    transaction: jest.fn().mockResolvedValue({} as Transaction),
  } as unknown as Sequelize
  const query: HookedQueryOptions = { type: 'SELECT' }

  const originalNodeEnv = process.env.NODE_ENV

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV
    } else {
      process.env.NODE_ENV = originalNodeEnv
    }
    jest.clearAllMocks()
  })

  const createBeforeQueryHook = (nodeEnv: string) => {
    process.env.NODE_ENV = nodeEnv

    const hook = new SequelizeConfigService(logger).createSequelizeOptions()
      .hooks?.beforeQuery

    if (!hook) {
      throw new Error('Expected a beforeQuery hook')
    }

    return (options: HookedQueryOptions) =>
      (hook as (options: HookedQueryOptions) => void)(options)
  }

  it('should fail a query outside the request transaction in test', async () => {
    const beforeQuery = createBeforeQueryHook('test')

    await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      expect(() => beforeQuery(query)).toThrow(
        QueryOutsideRequestTransactionError,
      )
    })
  })

  it('should fail a query outside the request transaction in development', async () => {
    const beforeQuery = createBeforeQueryHook('development')

    await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      expect(() => beforeQuery(query)).toThrow(
        QueryOutsideRequestTransactionError,
      )
    })
  })

  // Every deployed environment runs the production image, dev and staging
  // included, so this is the branch dev01 takes.
  it('should report a query outside the request transaction in production', async () => {
    const beforeQuery = createBeforeQueryHook('production')

    await runInRequestContext(async () => {
      await getOrCreateTransaction(sequelize)

      expect(() => beforeQuery(query)).not.toThrow()
    })

    expect(logger.error).toHaveBeenCalledTimes(1)
  })
})
