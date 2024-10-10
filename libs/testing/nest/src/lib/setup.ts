import { Type } from '@nestjs/common'
import { SequelizeOptionsFactory } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'

import { User } from '@island.is/auth-nest-tools'
import { createCurrentUser } from '@island.is/testing/fixtures'

import { TestApp, testServer } from './testServer'
import { useAuth, useDatabase } from './hooks'

interface SetupOptions {
  AppModule: Type<any>
  SequelizeConfigService: Type<SequelizeOptionsFactory>
  user?: User
  dbType?: 'sqlite' | 'postgres'
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
  beforeServerStart?: (app: TestApp) => Promise<void> | undefined
}

export const setupApp = ({
  AppModule,
  SequelizeConfigService,
  user = createCurrentUser(),
  dbType = 'sqlite',
  override = (builder) => builder,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: dbType, provider: SequelizeConfigService }),
    ],
    override: (builder: TestingModuleBuilder) => override(builder),
  })
}

export const setupAppWithoutAuth = async ({
  AppModule,
  SequelizeConfigService,
  dbType = 'sqlite',
  override = (builder) => builder,
  beforeServerStart = undefined,
}: SetupOptions): Promise<TestApp> =>
  testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: dbType, provider: SequelizeConfigService })],
    override: (builder: TestingModuleBuilder) => override(builder),
    beforeServerStart,
  })
