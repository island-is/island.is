import { getConnectionToken, SequelizeModuleOptions } from '@nestjs/sequelize'
import { Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Dialect } from 'sequelize'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

import { getOptions } from '@island.is/nest/sequelize'

import { TestApp } from '../testServer'

type Database = Extract<Dialect, 'postgres' | 'sqlite'>

const dialect: Record<string, Database> = {
  Postgres: 'postgres',
  SQLite: 'sqlite',
}

interface UseDatabase {
  type: Database
  provider: any
  skipTruncate?: boolean
}

const sharedConfig: SequelizeModuleOptions = {
  ...getOptions(),
  synchronize: false,
}

const config: Record<Database, SequelizeModuleOptions> = {
  sqlite: {
    dialect: dialect.SQLite,
    database: ':memory:',
    ...sharedConfig,
  },
  postgres: {
    dialect: dialect.Postgres,
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
    ...sharedConfig,
  },
}

export const truncate = async (sequelize: Sequelize) => {
  if (!sequelize) {
    return
  }

  await Promise.all(
    Object.values(sequelize.models).map((model) => {
      if (model.tableName.toLowerCase() === 'sequelize') {
        return null
      }

      return model.destroy({
        where: {},
        cascade: true,
        truncate: true,
        force: true,
        logging: false,
      })
    }),
  )
}

/**
 * Jest logs error.stack, but Sequelize errors are overriding the stack trace to be cleaner. But this cleaner stack
 * trace unfortunately does not include the original error message.
 *
 * UPGRADE WARNING:
 * Can remove after upgrading to Sequelize with this issue fixed:
 * https://github.com/sequelize/sequelize/issues/14807#issuecomment-1220528562
 */
const monkeyPatchSequelizeErrorsForJest = (instance: Sequelize) => {
  if (typeof jest === 'undefined') {
    return
  }
  const origQueryFunc = instance.query
  instance.query = function (this: Sequelize, ...args: any[]) {
    return origQueryFunc.apply(this, args as any).catch(async (err) => {
      if (typeof err.stack === 'string') {
        const stackLines = err.stack.split('\n')
        if (stackLines[0] === 'Error: ') {
          err.stack = `${stackLines[0]}${err.message}\n${stackLines
            .slice(1)
            .join('\n')}`
        }
      }
      throw err
    }) as any // Cast to any to hide that it's a promise. Otherwise jest will show this code as the root cause of the error
  } as typeof origQueryFunc
}

export default ({ type, provider, skipTruncate = false }: UseDatabase) => ({
  override: (builder: TestingModuleBuilder) =>
    builder.overrideProvider(provider).useValue({
      createSequelizeOptions() {
        return config[type]
      },
    }),
  extend: async (app: TestApp) => {
    const sequelize: Sequelize = await app.resolve(
      getConnectionToken() as Type<Sequelize>,
    )
    monkeyPatchSequelizeErrorsForJest(sequelize)

    try {
      if (!skipTruncate) {
        await truncate(sequelize)
      }
    } catch (e) {
      // ignore
    }

    await sequelize.sync({ logging: false, force: true }).catch((e) => {
      console.log(e)
    })

    return async () => {
      if (sequelize?.options.dialect === dialect.Postgres) {
        // need to return await due to a Bluebird promise
        return await sequelize.close()
      }
    }
  },
})
