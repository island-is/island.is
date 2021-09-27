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
  server?: Partial<TestServerOptions>
}

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
      })
    }),
  )
}

export const setup = async (
  { withAuth, server }: Options = { withAuth: true },
) => {
  if (withAuth) {
    app = await testServerActivateAuthGuards({
      appModule: AppModule,
      ...server,
    })
  } else {
    app = await testServer({
      appModule: AppModule,
      ...server,
    })
  }
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  try {
    await sequelize.sync()
  } catch (err) {
    logger.error('Migration error', err)
  }

  return app
}

beforeEach(truncate)

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
