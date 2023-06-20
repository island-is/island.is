import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import groupBy from 'lodash/groupBy'

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
import { AdminScopeDTO, AdminCreateScopeDto } from '@island.is/auth-api-lib'
import { ScopesPayload } from './dto/scopes.payload'
import { Scope } from './models/scope.model'

const TENANT_ID = '@island.is'

const mockCreateScopes = {
  scope1: {
    tenantId: TENANT_ID,
    name: '@island.is/scope',
    displayName: [
      {
        locale: 'is',
        value: 'Scope display name',
      },
    ],
    description: [
      {
        locale: 'is',
        value: 'Scope description',
      },
    ],
  },
}

const createMockedApiScopes = (env: Environment, len = 3) =>
  Array.from({ length: len }).map(
    (_, i) =>
      ({
        name: `@island.is/scope${i + 1}`,
        displayName: [
          {
            locale: 'is',
            value: `Umfang ${i + 1} ${env} samnefni`,
          },
          {
            locale: 'en',
            value: `Scope ${i + 1} ${env} display name`,
          },
        ],
        description: [
          {
            locale: 'is',
            value: `Umfang ${i + 1} ${env} lýsing`,
          },
          {
            locale: 'en',
            value: `Scope ${i + 1} ${env} description`,
          },
        ],
        isAccessControlled: false,
      } as AdminScopeDTO),
  )

const createFindAllScopesMock = (environment: Environment, len = 3) =>
  createMockedApiScopes(environment, len).map((scope) => ({
    ...scope,
    environment,
  }))

const createMockAdminApi = (
  createData: AdminCreateScopeDto,
  findAllData: AdminScopeDTO[],
  findByNameData: AdminScopeDTO,
) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meScopesControllerCreate: jest.fn().mockResolvedValue(createData),
  meScopesControllerFindAllByTenantId: jest.fn().mockResolvedValue(findAllData),
  meScopesControllerFindByTenantIdAndScopeName: jest
    .fn()
    .mockResolvedValue(findByNameData),
})

const mockAdminDevApi = createMockAdminApi(
  mockCreateScopes.scope1,
  createMockedApiScopes(Environment.Development),
  createMockedApiScopes(Environment.Development, 1)[0],
)
const mockAdminStagingApi = createMockAdminApi(
  mockCreateScopes.scope1,
  createMockedApiScopes(Environment.Staging),
  createMockedApiScopes(Environment.Staging, 1)[0],
)
const mockAdminProdApi = createMockAdminApi(
  mockCreateScopes.scope1,
  createMockedApiScopes(Environment.Production),
  createMockedApiScopes(Environment.Production, 1)[0],
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
    mockAdminDevApi.meScopesControllerFindAllByTenantId.mockClear()
    mockAdminStagingApi.meScopesControllerFindAllByTenantId.mockClear()
    mockAdminProdApi.meScopesControllerFindAllByTenantId.mockClear()
    // Find by name
    mockAdminDevApi.meScopesControllerFindByTenantIdAndScopeName.mockClear()
    mockAdminStagingApi.meScopesControllerFindByTenantIdAndScopeName.mockClear()
    mockAdminProdApi.meScopesControllerFindByTenantIdAndScopeName.mockClear()
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
        description: mockCreateScopes.scope1.description[0].value,
        displayName: mockCreateScopes.scope1.displayName[0].value,
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
        description: mockCreateScopes.scope1.description[0].value,
        displayName: mockCreateScopes.scope1.displayName[0].value,
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

      const groupedScopes = groupBy(mockedScopes, 'name')

      const scopeModels: Scope[] = Object.entries(groupedScopes).map(
        ([scopeName, scopes]) => ({
          scopeName,
          environments: scopes.map((scope) => ({
            ...scope,
            isAccessControlled: false,
          })),
        }),
      )

      // Act
      const scopeResponses = await scopeService.getScopes(
        currentUser,
        TENANT_ID,
      )

      // Assert
      expect(
        mockAdminDevApi.meScopesControllerFindAllByTenantId,
      ).toBeCalledTimes(1)
      expect(
        mockAdminStagingApi.meScopesControllerFindAllByTenantId,
      ).toBeCalledTimes(1)
      expect(
        mockAdminProdApi.meScopesControllerFindAllByTenantId,
      ).toBeCalledTimes(1)

      expect(scopeResponses).toEqual({
        data: scopeModels,
        totalCount: scopeModels.length,
        pageInfo: {
          hasNextPage: false,
        },
      } as ScopesPayload)
    })

    it('should get scope by name for specific tenant for all environments', async () => {
      // Arrange
      const mockedScopes = [
        ...createFindAllScopesMock(Environment.Development, 1),
        ...createFindAllScopesMock(Environment.Staging, 1),
        ...createFindAllScopesMock(Environment.Production, 1),
      ]
      const mockedScope = mockedScopes[0]
      const groupedScopes = groupBy(mockedScopes, 'name')
      const environments = Object.entries(groupedScopes)
        .map(([_, scopes]) => scopes)
        .flat()

      // Act
      const scopeResponses = await scopeService.getScope(currentUser, {
        tenantId: TENANT_ID,
        scopeName: mockedScope.name,
      })

      // Assert
      expect(
        mockAdminDevApi.meScopesControllerFindByTenantIdAndScopeName,
      ).toBeCalledTimes(1)
      expect(
        mockAdminStagingApi.meScopesControllerFindByTenantIdAndScopeName,
      ).toBeCalledTimes(1)
      expect(
        mockAdminProdApi.meScopesControllerFindByTenantIdAndScopeName,
      ).toBeCalledTimes(1)
      expect(scopeResponses).toEqual({
        scopeName: mockedScope.name,
        environments: environments,
      } as Scope)
    })
  })
})
