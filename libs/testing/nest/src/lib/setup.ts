import { Type } from '@nestjs/common'
import { SequelizeOptionsFactory } from '@nestjs/sequelize'

import { User } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { TestApp, testServer } from './testServer'
import { useAuth, useDatabase } from './hooks'

interface SetupOptions {
  AppModule: Type<any>
  SequelizeConfigService: Type<SequelizeOptionsFactory>
  user?: User
}

export const setupApp = ({
  AppModule,
  SequelizeConfigService,
  user = createCurrentUser(),
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}

export const setupAppWithoutAuth = async ({
  AppModule,
  SequelizeConfigService,
}: SetupOptions): Promise<TestApp> =>
  testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })
