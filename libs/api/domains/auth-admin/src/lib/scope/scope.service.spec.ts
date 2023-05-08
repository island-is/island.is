import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
  AuthAdminApiClientConfig,
  AuthAdminApiClientModule,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, testServer, useAuth } from '@island.is/testing/nest'

import { ScopeResolver } from './scope.resolver'
import { ScopeService } from './scope.service'
import { AdminScopeDTO, ClientCreateScopeDTO } from '@island.is/auth-api-lib'

const TENANT_ID = '@island.is'

const mockCreateScopes = {
  scope1: {
    tenantId: TENANT_ID,
    name: '@island.is/scope',
    displayName: 'Scope display name',
    description: 'Scope description',
  },
}

const mockFindAllScopes = (env: Environment) => [
  {
    name: `@island.is/scope:${env}`,
    displayName: `Scope ${env} display name`,
    description: `Scope ${env} display name`,
  },
  {
    name: `@island.is/scope2:${env}`,
    displayName: `Scope 2 ${env} display name`,
    description: `Scope 2 ${env} display name`,
  },
  {
    name: `@island.is/scope3:${env}`,
    displayName: `Scope 3 ${env} display name`,
    description: `Scope 3 ${env} display name`,
  },
]

const createFindAllScopesMock = (environment: Environment) =>
  mockFindAllScopes(environment).map((scope) => ({
    scope,
    environment,
  }))

const createMockAdminApi = (
  createData: ClientCreateScopeDTO,
  findAllData: AdminScopeDTO[],
) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meScopesControllerCreate: jest.fn().mockResolvedValue(createData),
  meScopesControllerFindAll: jest.fn().mockResolvedValue(findAllData),
})

const mockAdminDevApi = createMockAdminApi(
  mockCreateScopes.scope1,
  mockFindAllScopes(Environment.Development),
)
const mockAdminStagingApi = createMockAdminApi(
  mockCreateScopes.scope1,
  mockFindAllScopes(Environment.Staging),
)
const mockAdminProdApi = createMockAdminApi(
  mockCreateScopes.scope1,
  mockFindAllScopes(Environment.Production),
)

@Module({
  imports: [
    AuthAdminApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
  providers: [ScopeResolver, ScopeService],
})
class TestModule {}

describe('ScopeService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId('person'),
  })

  beforeEach(() => {
    // Create
    mockAdminDevApi.meScopesControllerCreate.mockClear()
    mockAdminStagingApi.meScopesControllerCreate.mockClear()
    mockAdminProdApi.meScopesControllerCreate.mockClear()
    // Find all
    mockAdminDevApi.meScopesControllerFindAll.mockClear()
    mockAdminStagingApi.meScopesControllerFindAll.mockClear()
    mockAdminProdApi.meScopesControllerFindAll.mockClear()
  })

  describe('with multiple environments', () => {
    let app: TestApp
    let scopeService: ScopeService

    beforeAll(async () => {
      app = await testServer({
        appModule: TestModule,
        enableVersioning: true,
        override: (builder) =>
          builder
            .overrideProvider(AdminDevApi.key)
            .useValue(mockAdminDevApi)
            .overrideProvider(AdminStagingApi.key)
            .useValue(mockAdminStagingApi)
            .overrideProvider(AdminProdApi.key)
            .useValue(mockAdminProdApi),
        hooks: [useAuth({ auth: currentUser })],
      })

      scopeService = app.get(ScopeService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should create scope for specific tenant for all environments', async () => {
      const scopeResponses = await scopeService.createScope(currentUser, {
        ...mockCreateScopes.scope1,
        environments: [
          Environment.Development,
          Environment.Staging,
          Environment.Production,
        ],
      })

      expect(mockAdminDevApi.meScopesControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meScopesControllerCreate).toBeCalledTimes(1)
      expect(mockAdminProdApi.meScopesControllerCreate).toBeCalledTimes(1)
      expect(scopeResponses).toEqual([
        {
          scopeName: mockCreateScopes.scope1.name,
          environment: Environment.Development,
        },
        {
          scopeName: mockCreateScopes.scope1.name,
          environment: Environment.Staging,
        },
        {
          scopeName: mockCreateScopes.scope1.name,
          environment: Environment.Production,
        },
      ])
    })

    it('should create scope for specific tenant for one environment', async () => {
      const scopeResponses = await scopeService.createScope(currentUser, {
        ...mockCreateScopes.scope1,
        environments: [Environment.Production],
      })

      expect(mockAdminDevApi.meScopesControllerCreate).toBeCalledTimes(0)
      expect(mockAdminStagingApi.meScopesControllerCreate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meScopesControllerCreate).toBeCalledTimes(1)
      expect(scopeResponses).toEqual([
        {
          scopeName: mockCreateScopes.scope1.name,
          environment: Environment.Production,
        },
      ])
    })

    it('should get scopes for specific tenant for all environments', async () => {
      // Arrange
      const mockedScopes = [
        ...createFindAllScopesMock(Environment.Development),
        ...createFindAllScopesMock(Environment.Staging),
        ...createFindAllScopesMock(Environment.Production),
      ]

      // Act
      const scopeResponses = await scopeService.getScopes(
        currentUser,
        TENANT_ID,
      )

      // Assert
      expect(mockAdminDevApi.meScopesControllerFindAll).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meScopesControllerFindAll).toBeCalledTimes(1)
      expect(mockAdminProdApi.meScopesControllerFindAll).toBeCalledTimes(1)

      expect(scopeResponses).toEqual({
        data: mockedScopes,
        totalCount: mockedScopes.length,
        pageInfo: {
          hasNextPage: false,
        },
      })
    })
  })
})
