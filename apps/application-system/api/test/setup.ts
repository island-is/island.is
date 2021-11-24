import { testServer, TestServerOptions } from '@island.is/infra-nest-server'
import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'
import { AppModule } from '../src/app/app.module'

// Give jest a bit more time when running application-system tests. Jest lazily transforms dynamically imported files.
// In this case, we're using ts-jest (which is slow) and the application system uses dynamic imports for some large
// application templates. So the first time a test imports a large template, it stalls while jest starts transforming
// the template files. Note that jest has a cache for these transforms, so this is mainly an issue on a cold run.
//
// Going forward, the plan is to replace ts-jest with babel-jest, esbuild-jest or swc-jest. We just need to get them
// working correctly with our typescript, decorators and type hints.
jest.setTimeout(10000)

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

export const setup = async (options?: Partial<TestServerOptions>) => {
  app = await testServer({
    appModule: AppModule,
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  await sequelize.sync({ force: true })

  return app
}

beforeEach(truncate)

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
