import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

import { logger } from '@island.is/logging'

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

export default async (nestApp: INestApplication) => {
  app = nestApp
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

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
    await sequelize.close()
  }
})
