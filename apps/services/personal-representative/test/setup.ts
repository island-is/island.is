import { testServer, useDatabase, TestApp } from '@island.is/testing/nest'
import { Sequelize } from 'sequelize-typescript'
import { AppModule } from '../src/app/app.module'
import type { Type } from '@nestjs/common'
import { logger } from '@island.is/logging'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'

export let app: TestApp
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

// needed for generic error validation
expect.extend({
  anyOf(value: any, classTypes: any[]) {
    const types = classTypes.map((type) => type.name).join(', ')
    const message = `expected to be any of type: ${types}`
    for (let i = 0; i < classTypes.length; i++) {
      if (value.constructor === classTypes[i]) {
        return {
          pass: true,
          message: () => message,
        }
      }
    }

    return {
      pass: false,
      message: () => message,
    }
  },
})

export const setup = async () => {
  app = await testServer<AppModule>({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

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
