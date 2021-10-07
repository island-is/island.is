import { getConnectionToken, SequelizeModuleOptions } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { Dialect } from 'sequelize/types'
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'

type Database = Extract<Dialect, 'postgres' | 'sqlite'>

const Dialect: Record<string, Database> = {
  Postgres: 'postgres',
  SQLite: 'sqlite',
}

interface UseDatabase {
  type: Database
  provider: any
  skipTruncate?: boolean
}

const sharedConfig: SequelizeModuleOptions = {
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
  },
  dialectOptions: {
    useUTC: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
  autoLoadModels: true,
  synchronize: true,
}

const config: Record<Database, SequelizeModuleOptions> = {
  sqlite: {
    dialect: Dialect.SQLite,
    database: ':memory:',
    ...sharedConfig,
  },
  postgres: {
    dialect: Dialect.Postgres,
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: 'localhost',
    port: 5433,
    ...sharedConfig,
  },
}

let sequelize: Sequelize

export const truncate = async () => {
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

export default ({ type, provider, skipTruncate = false }: UseDatabase) => ({
  override: (builder: TestingModuleBuilder) =>
    builder.overrideProvider(provider).useValue({
      createSequelizeOptions() {
        return config[type]
      },
    }),
  extend: async (app: INestApplication) => {
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

    try {
      if (!skipTruncate) {
        await truncate()
      }
    } catch (e) {
      // ignore
    }

    try {
      await sequelize.sync({ logging: false, force: true })
    } catch (err) {
      console.log('Sync error', err)
    }

    return app
  },
})

afterAll(async () => {
  if (sequelize) {
    try {
      await sequelize.close()
    } catch {}
  }
})
