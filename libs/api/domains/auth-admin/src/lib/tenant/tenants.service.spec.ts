import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
  AuthAdminApiClientConfig,
  TenantDto,
} from '@island.is/clients/auth/admin-api'
import { Environment } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, testServer, useAuth } from '@island.is/testing/nest'

import { AuthAdminModule } from '../auth-admin.module'
import { TenantsPayload } from './dto/tenants.payload'
import { TenantsService } from './tenants.service'
import { LOGGER_PROVIDER } from '@island.is/logging'

const mockTenants = {
  tenant1: {
    name: 'tenant-1',
    displayName: [
      {
        locale: 'is',
        value: 'Tenant 1',
      },
    ],
  },
  tenant2: {
    name: 'tenant-2',
    displayName: [
      {
        locale: 'is',
        value: 'Tenant 2',
      },
    ],
  },
  tenant3: {
    name: 'tenant-3',
    displayName: [
      {
        locale: 'is',
        value: 'Tenant 3',
      },
    ],
  },
}

const createMockAdminApi = (tenants: TenantDto[]) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meTenantsControllerFindAll: jest.fn().mockResolvedValue(tenants),
})
const mockAdminDevApi = createMockAdminApi([
  mockTenants.tenant1,
  mockTenants.tenant2,
  mockTenants.tenant3,
])
const mockAdminStagingApi = createMockAdminApi([
  mockTenants.tenant1,
  mockTenants.tenant2,
])
const mockAdminProdApi = createMockAdminApi([mockTenants.tenant1])

@Module({
  imports: [
    AuthAdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
})
class TestModule {}

describe('TenantsService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId('person'),
  })

  beforeEach(() => {
    mockAdminDevApi.meTenantsControllerFindAll.mockClear()
    mockAdminStagingApi.meTenantsControllerFindAll.mockClear()
    mockAdminProdApi.meTenantsControllerFindAll.mockClear()
  })

  describe('with multiple environments', () => {
    let app: TestApp
    let tenantsService: TenantsService

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

      tenantsService = app.get(TenantsService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('merges tenants', async () => {
      // Act
      const tenants = await tenantsService.getTenants(currentUser)

      // Assert
      expect(mockAdminDevApi.meTenantsControllerFindAll).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meTenantsControllerFindAll).toBeCalledTimes(1)
      expect(mockAdminProdApi.meTenantsControllerFindAll).toBeCalledTimes(1)
      expect(tenants).toEqual({
        totalCount: 3,
        data: [
          {
            id: mockTenants.tenant1.name,
            environments: [
              {
                ...mockTenants.tenant1,
                environment: Environment.Dev,
              },
              {
                ...mockTenants.tenant1,
                environment: Environment.Staging,
              },
              {
                ...mockTenants.tenant1,
                environment: Environment.Prod,
              },
            ],
          },
          {
            id: mockTenants.tenant2.name,
            environments: [
              {
                ...mockTenants.tenant2,
                environment: Environment.Dev,
              },
              {
                ...mockTenants.tenant2,
                environment: Environment.Staging,
              },
            ],
          },
          {
            id: mockTenants.tenant3.name,
            environments: [
              {
                ...mockTenants.tenant3,
                environment: Environment.Dev,
              },
            ],
          },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      } as TenantsPayload)
    })
  })

  describe('with single environment', () => {
    let app: TestApp
    let tenantsService: TenantsService

    beforeAll(async () => {
      app = await testServer({
        appModule: TestModule,
        enableVersioning: true,
        override: (builder) =>
          builder.overrideProvider(AdminDevApi.key).useValue(mockAdminDevApi),
        hooks: [useAuth({ auth: currentUser })],
      })

      tenantsService = app.get(TenantsService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('merges tenants', async () => {
      // Act
      const tenants = await tenantsService.getTenants(currentUser)

      // Assert
      expect(mockAdminDevApi.meTenantsControllerFindAll).toBeCalledTimes(1)
      expect(tenants).toEqual({
        totalCount: 3,
        data: [
          {
            id: mockTenants.tenant1.name,
            environments: [
              {
                ...mockTenants.tenant1,
                environment: Environment.Dev,
              },
            ],
          },
          {
            id: mockTenants.tenant2.name,
            environments: [
              {
                ...mockTenants.tenant2,
                environment: Environment.Dev,
              },
            ],
          },
          {
            id: mockTenants.tenant3.name,
            environments: [
              {
                ...mockTenants.tenant3,
                environment: Environment.Dev,
              },
            ],
          },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      } as TenantsPayload)
    })
  })

  describe('with no environment', () => {
    it('logs error', async () => {
      // Assert
      const mockLogger = {
        error: jest.fn(),
      }

      // Act
      await testServer({
        appModule: TestModule,
        override: (builder) =>
          builder.overrideProvider(LOGGER_PROVIDER).useValue(mockLogger),
      })

      // Assert
      expect(mockLogger.error).toBeCalledTimes(1)
      expect(mockLogger.error).toBeCalledWith(
        'No admin api clients configured, at least one configured api is required.',
      )
    })
  })
})
