import { TestingModuleBuilder } from '@nestjs/testing'

import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
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
  customScopeRules?: ConfigType<typeof DelegationConfig>['customScopeRules']
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder
}

const delegationConfig: ConfigType<typeof DelegationConfig> = {
  userInfoUrl: '',
  customScopeRules: [],
  defaultValidityPeriodInDays: 90,
  isConfigured: true,
}

export const setupWithAuth = ({
  user = createCurrentUser(),
  customScopeRules,
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
          ...(customScopeRules && { customScopeRules }),
        }),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}

export const setupWithoutAuth = (): Promise<TestApp> => {
  return testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
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
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}
