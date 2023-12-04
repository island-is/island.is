import { TestingModuleBuilder } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { Sequelize } from 'sequelize-typescript'

import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { AppModule } from '../src/app/app.module'
import { User } from '@island.is/auth-nest-tools'
import { FeatureFlagServiceMock } from './mocks/featureFlagService.mock'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ConfigType } from '@island.is/nest/config'

interface SetupOptions {
  user?: User
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
}

const delegationConfig: ConfigType<typeof DelegationConfig> = {
  userInfoUrl: '',
  defaultValidityPeriodInDays: 90,
  isConfigured: true,
}

export const setupWithAuth = ({
  user = createCurrentUser(),
  override = (builder) => builder,
}: SetupOptions = {}): Promise<TestApp> => {
  // Setup app with authentication and database
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    override: (builder: TestingModuleBuilder) =>
      override(builder)
        .overrideProvider(FeatureFlagService)
        .useValue(FeatureFlagServiceMock)
        .overrideProvider(DelegationConfig.KEY)
        .useValue({
          ...delegationConfig,
        }),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })
}

export const setupWithoutAuth = (): Promise<TestApp> => {
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })
}

export const setupWithoutPermission = ({
  user = createCurrentUser(),
}: { user?: User } = {}): Promise<TestApp> => {
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })
}
