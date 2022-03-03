import { getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'

import {
  ApiScope,
  DelegationConfig,
  DelegationsService,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import {
  EinstaklingarApi,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'

import { AppModule } from '../src/app/app.module'

import { createApiScope } from './fixtures'
import {
  createMockEinstaklingurApi,
  FeatureFlagServiceMock,
  RskProcuringClientMock,
} from './mocks'

export interface ScopeSetupOptions {
  name: string
  allowExplicitDelegationGrant?: boolean
}

interface SetupOptions {
  user: User
  userName: string
  nationalRegistryUser: Einstaklingsupplysingar
  scopes?: ScopeSetupOptions[]
}

export const Scopes: ScopeSetupOptions[] = [
  {
    // Test user has access to
    name: '@island.is/scope0',
  },
  {
    // Test user does not have access to
    name: '@island.is/scope1',
  },
  {
    // Not allowed for delegations
    name: '@island.is/scope2',
    allowExplicitDelegationGrant: false,
  },
  {
    // Only allowed for companies, one level deep
    name: '@island.is/scope3',
  },
]

const delegationConfig: ConfigType<typeof DelegationConfig> = {
  isConfigured: true,
  customScopeRules: [
    {
      scopeName: '@island.is/scope3',
      onlyForDelegationType: ['ProcurationHolder'],
    },
  ],
}

export const setupWithAuth = async ({
  user,
  userName,
  nationalRegistryUser,
  scopes = Scopes,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  const app = await testServer({
    appModule: AppModule,
    override: (builder: TestingModuleBuilder) =>
      builder
        .overrideProvider(EinstaklingarApi)
        .useValue(createMockEinstaklingurApi(nationalRegistryUser))
        .overrideProvider(RskProcuringClient)
        .useValue(RskProcuringClientMock)
        .overrideProvider(DelegationConfig.KEY)
        .useValue(delegationConfig)
        .overrideProvider(FeatureFlagService)
        .useValue(FeatureFlagServiceMock),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  // Add scopes in the "system" to use for delegation setup
  const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
  await apiScopeModel.bulkCreate(scopes.map((scope) => createApiScope(scope)))

  // Mock the name of the authentication user
  jest
    .spyOn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      app.get<DelegationsService>(DelegationsService) as any,
      'getUserName',
    )
    .mockImplementation(() => userName)

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

  return app
}

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  const app = await testServer({
    appModule: AppModule,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}
