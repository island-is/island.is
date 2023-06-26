import {
  ApiScope,
  Domain,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { IdsUserGuard, MockAuthGuard, User } from '@island.is/auth-nest-tools'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { createCurrentUser } from '@island.is/testing/fixtures'
import {
  TestApp,
  testServer,
  useAuth,
  useDatabase,
} from '@island.is/testing/nest'
import { TestingModuleBuilder } from '@nestjs/testing'
import { AppModule } from '../src/app/app.module'
import { getModelToken } from '@nestjs/sequelize'
import {
  createDomain,
  createApiScope,
  CreateDomain,
} from '@island.is/services/auth/testing'
import faker from 'faker'

type Scopes = {
  [key: string]: {
    name: string
    domainName: string
  }
}

export const defaultDomains: CreateDomain[] = [createDomain(), createDomain()]

export const defaultScopes: Scopes = {
  // Test user has access to this scope
  testUserHasAccess: {
    name: '@identityserver.api/authentication',
    domainName: defaultDomains[0].name,
  },
  scope1: { name: faker.lorem.word(), domainName: defaultDomains[0].name },
  scope2: { name: faker.lorem.word(), domainName: defaultDomains[1].name },
}

class MockNationalRegistryClientService
  implements Partial<NationalRegistryClientService> {
  getIndividual = jest.fn().mockResolvedValue({})
  getCustodyChildren = jest.fn().mockResolvedValue([])
}

class MockUserProfile {
  withMiddleware = () => this
  userProfileControllerFindOneByNationalId = jest.fn().mockResolvedValue({})
}

interface SetupOptions {
  user: User
  scopes?: Scopes
  domains?: CreateDomain[]
}

export const setupWithAuth = async ({
  user,
  scopes = defaultScopes,
  domains = defaultDomains,
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
        .overrideProvider(UserProfileApi)
        .useClass(MockUserProfile)
        .overrideProvider(CompanyRegistryClientService)
        .useValue({
          getCompany: jest.fn().mockResolvedValue({}),
        })
        .overrideProvider(RskProcuringClient)
        .useValue({
          getSimple: jest.fn().mockResolvedValue(null),
        })
        .overrideProvider(FeatureFlagService)
        .useValue({ getValue: () => true }),
    hooks: [
      useAuth({ auth: user }),
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  // Create domain
  const domainModel = app.get<typeof Domain>(getModelToken(Domain))
  await domainModel.bulkCreate(domains)

  const apiScopeModel = app.get<typeof ApiScope>(getModelToken(ApiScope))

  await apiScopeModel.bulkCreate(
    Object.values(scopes).map((scope) => ({
      ...createApiScope(scope),
    })),
  )

  return app
}

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
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
      useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
    ],
  })

  return app
}
