import { getModelToken } from '@nestjs/sequelize'
import { TestingModuleBuilder } from '@nestjs/testing'

import {
  ApiScope,
  DelegationsIndexService,
  Domain,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, MockAuthGuard, User } from '@island.is/auth-nest-tools'
import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { SyslumennService, SyslumennDelegationType } from '@island.is/clients/syslumenn'
import { V2MeApi } from '@island.is/clients/user-profile'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  createApiScope,
  createDomain,
  CreateDomain,
} from '@island.is/services/auth/testing'
import {
  createCurrentUser,
  createNationalId,
  createUniqueWords,
} from '@island.is/testing/fixtures'
import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'

import { AppModule } from '../src/app/app.module'

type Scopes = {
  [key: string]: {
    name: string
    domainName: string
  }
}

const domainsSize = 3
const uniqueDomainNames = createUniqueWords(domainsSize)

export const defaultDomains: CreateDomain[] = [...Array(domainsSize)].map(
  (_, index) =>
    createDomain({
      name: uniqueDomainNames[index],
    }),
)

const randomWords = createUniqueWords(2)

export const defaultScopes: Scopes = {
  // Test user has access to this scope
  testUserHasAccess: {
    name: '@identityserver.api/authentication',
    domainName: defaultDomains[0].name,
  },
  scope1: {
    name: randomWords[0],
    domainName: defaultDomains[1].name,
  },
  scope2: {
    name: randomWords[1],
    domainName: defaultDomains[2].name,
  },
}

export const nonExistingLegalRepresentativeNationalId = createNationalId()

class MockNationalRegistryClientService
  implements Partial<NationalRegistryClientService>
{
  getIndividual = jest.fn().mockResolvedValue({})
  getCustodyChildren = jest.fn().mockResolvedValue([])
}

class MockNationalRegistryV3ClientService
  implements Partial<NationalRegistryV3ClientService>
{
  getAllDataIndividual = jest.fn().mockResolvedValue({})
}

class MockUserProfile {
  withMiddleware = () => this
  meUserProfileControllerFindUserProfile = jest.fn().mockResolvedValue({})
}

class MockSyslumennService {
  checkIfDelegationExists = jest.fn(
    (
      _toNationalId: string,
      fromNationalId: string,
      _delegationType: SyslumennDelegationType,
    ) =>
      fromNationalId !== nonExistingLegalRepresentativeNationalId,
  )
}

interface SetupOptions {
  user: User
  scopes?: Scopes
  domains?: CreateDomain[]
  features?: Features[]
}

export const setupWithAuth = async ({
  user,
  scopes = defaultScopes,
  domains = defaultDomains,
  features,
}: SetupOptions): Promise<TestApp> => {
  // Setup app with authentication and database
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    override: (builder: TestingModuleBuilder) =>
      builder
        .overrideProvider(IdsUserGuard)
        .useValue(
          new MockAuthGuard({
            nationalId: user.nationalId,
            scope: user.scope,
          }),
        )
        .overrideProvider(NationalRegistryClientService)
        .useClass(MockNationalRegistryClientService)
        .overrideProvider(NationalRegistryV3ClientService)
        .useClass(MockNationalRegistryV3ClientService)
        .overrideProvider(V2MeApi)
        .useClass(MockUserProfile)
        .overrideProvider(CompanyRegistryClientService)
        .useValue({
          getCompany: jest.fn().mockResolvedValue({}),
        })
        .overrideProvider(RskRelationshipsClient)
        .useValue({
          getIndividualRelationships: jest.fn().mockResolvedValue(null),
        })
        .overrideProvider(SyslumennService)
        .useClass(MockSyslumennService)
        .overrideProvider(FeatureFlagService)
        .useValue({
          getValue: (feature: Features) =>
            !features || features.includes(feature),
        }),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

  // Create domain
  const domainModel = app.get<typeof Domain>(getModelToken(Domain))
  await domainModel.bulkCreate(domains)
  // Create scopes
  const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))
  await apiScopeModel.bulkCreate(Object.values(scopes).map(createApiScope))

  // Mock delegation indexing
  const delegationIndexService = app.get(DelegationsIndexService)
  delegationIndexService.indexDelegations = jest
    .fn()
    .mockImplementation(() => Promise.resolve())

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

  return app
}

export const setupWithoutPermission = async (): Promise<TestApp> => {
  const user = createCurrentUser()
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

  return app
}
