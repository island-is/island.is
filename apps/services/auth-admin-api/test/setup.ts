import { testServer, TestServerOptions } from '@island.is/infra-nest-server'
import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { AppModule } from '../src/app/app.module'
import { execSync } from 'child_process'

export let app: INestApplication
let sequelize: Sequelize

export const truncate = () => {
  if (!sequelize) {
    return
  }

  Promise.all(
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

export const setup = async (options?: Partial<TestServerOptions>) => {
  app = await testServer({
    appModule: AppModule,
    ...options,
  })
  //TODO: find out why this setup does not work for this project
  // sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
  // await sequelize.sync()

  // Populate the database models
  execSync('yarn nx run services-auth-api:migrate')
  // Seed the database
  execSync('yarn nx run services-auth-api:seed')

  return app
}

beforeEach(() => truncate())

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
