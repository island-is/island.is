import { getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'

import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  EinstaklingarApi,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import {
  ApiScope,
  Client,
  ClientAllowedScope,
  DelegationConfig,
  DelegationsService,
  Language,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { AppModule } from '../src/app/app.module'
import { User } from '@island.is/auth-nest-tools'
import {
  createMockEinstaklingurApi,
  RskProcuringClientMock,
  FeatureFlagServiceMock,
} from './mocks'
import { createApiScope, CreateClient } from './fixtures'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ConfigType } from '@island.is/nest/config'

export interface ScopeSetupOptions {
  name: string
  allowExplicitDelegationGrant?: boolean
}

export interface ClientSetupOptions {
  props: CreateClient
  scopes?: string[]
}

interface SetupOptions {
  user: User
  userName: string
  nationalRegistryUser: Einstaklingsupplysingar
  scopes?: ScopeSetupOptions[]
  client?: ClientSetupOptions
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
  {
    // Test user has access to
    name: '@island.is/scope4',
  },
  {
    // Scope for another org
    name: '@otherorg.is/scope5',
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
  client,
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

  // Add language for translations.
  const languageModel = app.get<typeof Language>(getModelToken(Language))
  await languageModel.create({
    isoKey: 'en',
    description: 'Enska',
    englishDescription: 'English',
  })

  if (client) {
    const clientModel = app.get<typeof Client>(getModelToken(Client))
    await clientModel.create(client.props)

    if (client.scopes) {
      const clientAllowedScopesModel = app.get<typeof ClientAllowedScope>(
        getModelToken(ClientAllowedScope),
      )
      await clientAllowedScopesModel.bulkCreate(
        client.scopes?.map((s) => ({
          scopeName: s,
          clientId: client.props.clientId,
        })),
      )
    }
  }

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
