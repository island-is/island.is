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
import { ClientCreateScopeDTO } from '@island.is/auth-api-lib'

const mockScopes = {
  scope1: {
    tenantId: '@island.is',
    name: '@island.is/scope',
    displayName: 'Scope display name',
    description: 'Scope description',
  },
}

const createMockAdminApi = (scope: ClientCreateScopeDTO) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meScopesControllerCreate: jest.fn().mockResolvedValue(scope),
})
const mockAdminDevApi = createMockAdminApi(mockScopes.scope1)
const mockAdminStagingApi = createMockAdminApi(mockScopes.scope1)
const mockAdminProdApi = createMockAdminApi(mockScopes.scope1)

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
    mockAdminDevApi.meScopesControllerCreate.mockClear()
    mockAdminStagingApi.meScopesControllerCreate.mockClear()
    mockAdminProdApi.meScopesControllerCreate.mockClear()
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
        ...mockScopes.scope1,
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
          scopeName: mockScopes.scope1.name,
          environment: Environment.Development,
        },
        {
          scopeName: mockScopes.scope1.name,
          environment: Environment.Staging,
        },
        {
          scopeName: mockScopes.scope1.name,
          environment: Environment.Production,
        },
      ])
    })

    it('should create scope for specific tenant for one environment', async () => {
      const scopeResponses = await scopeService.createScope(currentUser, {
        ...mockScopes.scope1,
        environments: [Environment.Production],
      })

      expect(mockAdminDevApi.meScopesControllerCreate).toBeCalledTimes(0)
      expect(mockAdminStagingApi.meScopesControllerCreate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meScopesControllerCreate).toBeCalledTimes(1)
      expect(scopeResponses).toEqual([
        {
          scopeName: mockScopes.scope1.name,
          environment: Environment.Production,
        },
      ])
    })
  })
})
