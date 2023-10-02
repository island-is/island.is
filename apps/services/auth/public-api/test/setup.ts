import { getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'
import { uuid } from 'uuidv4'

import {
  testServer,
  useDatabase,
  useAuth,
  TestApp,
} from '@island.is/testing/nest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  NationalRegistryClientService,
  IndividualDto,
} from '@island.is/clients/national-registry-v2'
import {
  ApiScope,
  ApiScopeGroup,
  Client,
  ClientAllowedScope,
  DelegationConfig,
  Domain,
  Language,
  NamesService,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { AppModule } from '../src/app/app.module'
import { User } from '@island.is/auth-nest-tools'
import {
  createMockEinstaklingurApi,
  RskProcuringClientMock,
  FeatureFlagServiceMock,
} from './mocks'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ConfigType } from '@island.is/nest/config'
import {
  createDomain,
  createApiScopeGroup,
  createApiScope,
  CreateClient,
} from '@island.is/services/auth/testing'

export interface ScopeSetupOptions {
  name: string
  allowExplicitDelegationGrant?: boolean
  order?: number
  groupId?: string
}

export interface ScopeGroupSetupOptions {
  id: string
  order?: number
}

export interface ClientSetupOptions {
  props: CreateClient
  scopes?: string[]
}

interface SetupOptions {
  user: User
  userName: string
  nationalRegistryUser: IndividualDto
  scopes?: ScopeSetupOptions[]
  scopeGroups?: ScopeGroupSetupOptions[]
  client?: ClientSetupOptions
}

export const ScopeGroups: ScopeGroupSetupOptions[] = [
  {
    id: uuid(),
  },
]

export const Scopes: ScopeSetupOptions[] = [
  {
    // Test user has access to
    name: '@island.is/scope0',
    groupId: ScopeGroups[0].id,
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
  {
    // Only allowed for legal guardian, one level deep
    name: '@island.is/scope6',
  },
]

const delegationConfig: ConfigType<typeof DelegationConfig> = {
  isConfigured: true,
  customScopeRules: [
    {
      scopeName: '@island.is/scope3',
      onlyForDelegationType: ['ProcurationHolder'],
    },
    {
      scopeName: '@island.is/scope6',
      onlyForDelegationType: ['LegalGuardian'],
    },
  ],
  userInfoUrl: 'https://localhost:6001/connect/userinfo',
  defaultValidityPeriodInDays: 365,
}

export const setupWithAuth = async ({
  user,
  userName,
  nationalRegistryUser,
  scopes = Scopes,
  scopeGroups = ScopeGroups,
  client,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  const app = await testServer({
    appModule: AppModule,
    override: (builder: TestingModuleBuilder) =>
      builder
        .overrideProvider(NationalRegistryClientService)
        .useValue(createMockEinstaklingurApi(nationalRegistryUser))
        .overrideProvider(RskRelationshipsClient)
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

  // Create domain
  const domainModel = app.get<typeof Domain>(getModelToken(Domain))
  const domain = await domainModel.create(createDomain())

  // Add scope groups to use for delegation setup
  const apiScopeGroupModel = app.get<typeof ApiScopeGroup>(
    getModelToken(ApiScopeGroup),
  )
  await apiScopeGroupModel.bulkCreate(
    scopeGroups.map((scopeGroup) =>
      createApiScopeGroup({
        domainName: domain.name,
        ...scopeGroup,
      }),
    ),
  )

  // Add scopes in the "system" to use for delegation setup
  const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
  await apiScopeModel.bulkCreate(
    scopes.map((scope) => ({
      ...createApiScope(scope),
      domainName: domain.name,
    })),
  )

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
      app.get<NamesService>(NamesService) as any,
      'getUserName',
    )
    .mockImplementation(() => userName)

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> =>
  testServer({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  return testServer({
    appModule: AppModule,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })
}
