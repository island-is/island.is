import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'

import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type, CanActivate } from '@nestjs/common'

import { testServer, TestServerOptions } from '@island.is/infra-nest-server'

import { JwtAuthGuard } from '../src/app/modules/auth'
import { AppModule } from '../src/app'

const noGuard: CanActivate = { canActivate: jest.fn(() => true) }

let app: INestApplication
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
    override: (builder) =>
      builder.overrideGuard(JwtAuthGuard).useValue(noGuard),
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  // Need to use sequelize-cli becuase sequelize.sync does not work for our models
  execSync('yarn nx run judicial-system-api:migrate')
  // await sequelize.sync()

  return app
}

beforeAll(() => truncate())

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
