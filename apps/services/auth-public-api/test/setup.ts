import {
  testServer,
  testServerActivateAuthGuards,
  TestServerOptions,
} from '@island.is/infra-nest-server'
import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { AppModule } from '../src/app/app.module'
import { logger } from '@island.is/logging'

type Options = {
  withAuth?: boolean
  sequalizeConfig?: any
} & Partial<TestServerOptions>

export let app: INestApplication
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

export const setup = async (
  { withAuth = true, sequalizeConfig, ...options }: Options = {
    withAuth: true,
  },
) => {
  if (withAuth) {
    app = await testServerActivateAuthGuards({
      appModule: AppModule,
      ...options,
    })
  } else {
    app = await testServer({
      appModule: AppModule,
      ...options,
    })
  }
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
  // sequelize.options.host = sequalizeConfig.host
  // sequelize.options.username = sequalizeConfig.username
  // sequelize.options.password = sequalizeConfig.password
  // sequelize.options.database = sequalizeConfig.database
  // sequelize.options.port = sequalizeConfig.port
  // sequelize.options.dialect = sequalizeConfig.dialect

  try {
    await sequelize.sync({ logging: false })
  } catch (err) {
    logger.error('Migration error', err)
  }

  return app
}

beforeEach(truncate)

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    // await sequelize.close()
  }
})
