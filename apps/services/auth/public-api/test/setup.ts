import { getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'
import { uuid } from 'uuidv4'

import {
  ApiScopeGroup,
  DelegationConfig,
  Domain,
  Language,
  NamesService,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { User } from '@island.is/auth-nest-tools'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { ConfigType } from '@island.is/nest/config'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import {
  createApiScopeGroup,
  CreateClient,
  createDomain,
  FixtureFactory,
} from '@island.is/services/auth/testing'
import { AuthDelegationType } from '@island.is/shared/types'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'

import { AppModule } from '../src/app/app.module'
import {
  CompanyRegistryClientServiceMock,
  createMockEinstaklingurApi,
  FeatureFlagServiceMock,
  RskProcuringClientMock,
} from './mocks'

export interface ScopeSetupOptions {
  name: string
  allowExplicitDelegationGrant?: boolean
  order?: number
  groupId?: string
  supportedDelegationTypes?: AuthDelegationType[]
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

export const delegationTypes = [
  AuthDelegationType.Custom,
  AuthDelegationType.LegalGuardian,
  AuthDelegationType.LegalGuardianMinor,
  AuthDelegationType.ProcurationHolder,
  AuthDelegationType.PersonalRepresentative,
  AuthDelegationType.GeneralMandate,
]

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
    supportedDelegationTypes: delegationTypes,
  },
  {
    // Test user does not have access to
    name: '@island.is/scope1',
    supportedDelegationTypes: delegationTypes,
  },
  {
    // Not allowed for delegations
    name: '@island.is/scope2',
    supportedDelegationTypes: delegationTypes.filter(
      (dt) => dt !== AuthDelegationType.Custom,
    ),
  },
  {
    // Only allowed for companies, one level deep
    name: '@island.is/scope3',
    supportedDelegationTypes: delegationTypes,
  },
  {
    // Test user has access to
    name: '@island.is/scope4',
    supportedDelegationTypes: delegationTypes,
  },
  {
    // Scope for another org
    name: '@otherorg.is/scope5',
    supportedDelegationTypes: delegationTypes,
  },
  {
    // Only allowed for legal guardian, one level deep
    name: '@island.is/scope6',
    supportedDelegationTypes: delegationTypes,
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
        .overrideProvider(CompanyRegistryClientService)
        .useValue(CompanyRegistryClientServiceMock)
        .overrideProvider(DelegationConfig.KEY)
        .useValue(delegationConfig)
        .overrideProvider(FeatureFlagService)
        .useValue(FeatureFlagServiceMock),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
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

  const factory = new FixtureFactory(app)

  // Add scopes in the "system" to use for delegation setup
  await Promise.all(
    scopes.map((scope) =>
      factory.createApiScope({
        ...scope,
        domainName: domain.name,
      }),
    ),
  )

  // Add language for translations.
  const languageModel = app.get<typeof Language>(getModelToken(Language))
  await languageModel.create({
    isoKey: 'en',
    description: 'Enska',
    englishDescription: 'English',
  })

  if (client) {
    await factory.createClient({
      ...client.props,
      allowedScopes: client.scopes?.map((s) => ({
        clientId: client.props.clientId,
        scopeName: s,
      })),
    })
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
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  return testServer({
    appModule: AppModule,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })
}
