import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
  AuthAdminApiClientConfig,
  AuthAdminApiClientModule,
  TenantDto,
} from '@island.is/clients/auth/admin-api'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigType } from '@island.is/nest/config'
import { Environment } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, testServer, useAuth } from '@island.is/testing/nest'

import { createMockApiResponse } from '../../../test/utils'
import { TenantsPayload } from './dto/tenants.payload'
import { TenantsService } from './tenants.service'
import { TenantResolver } from './tenant.resolver'
import { TenantEnvironmentResolver } from './tenant-environment.resolver'

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

const createMockAdminApi = (tenants: Omit<TenantDto, 'contactEmail'>[]) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meTenantsControllerFindAllRaw: jest
    .fn()
    .mockResolvedValue(createMockApiResponse(tenants)),
  meTenantsControllerFindByIdRaw: jest
    .fn()
    .mockImplementation(({ tenantId }) => {
      return createMockApiResponse(tenants.find((t) => t.name === tenantId))
    }),
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
    AuthAdminApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
  providers: [TenantResolver, TenantEnvironmentResolver, TenantsService],
})
class TestModule {}

describe('TenantsService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId('person'),
  })

  beforeEach(() => {
    mockAdminDevApi.meTenantsControllerFindAllRaw.mockClear()
    mockAdminStagingApi.meTenantsControllerFindAllRaw.mockClear()
    mockAdminProdApi.meTenantsControllerFindAllRaw.mockClear()
    mockAdminDevApi.meTenantsControllerFindByIdRaw.mockClear()
    mockAdminStagingApi.meTenantsControllerFindByIdRaw.mockClear()
    mockAdminProdApi.meTenantsControllerFindByIdRaw.mockClear()
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

    it('should return single merged tenant for all environments', async () => {
      const tenantName = 'tenant-1'
      const tenants = await tenantsService.getTenantById(
        tenantName,
        currentUser,
      )

      expect(
        mockAdminDevApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminProdApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(tenants).toEqual({
        id: mockTenants.tenant1.name,
        environments: [
          {
            ...mockTenants.tenant1,
            environment: Environment.Development,
          },
          {
            ...mockTenants.tenant1,
            environment: Environment.Staging,
          },
          {
            ...mockTenants.tenant1,
            environment: Environment.Production,
          },
        ],
      })
    })

    it('should return single merged tenant for development environments', async () => {
      const tenantName = 'tenant-3'
      const tenants = await tenantsService.getTenantById(
        tenantName,
        currentUser,
      )

      expect(
        mockAdminDevApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminProdApi.meTenantsControllerFindByIdRaw,
      ).toHaveBeenCalledTimes(1)
      expect(tenants).toEqual({
        id: mockTenants.tenant3.name,
        environments: [
          {
            ...mockTenants.tenant3,
            environment: Environment.Development,
          },
        ],
      })
    })

    it('merges tenants', async () => {
      // Act
      const tenants = await tenantsService.getTenants(currentUser)

      // Assert
      expect(
        mockAdminDevApi.meTenantsControllerFindAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meTenantsControllerFindAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminProdApi.meTenantsControllerFindAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(tenants).toEqual({
        totalCount: 3,
        data: [
          {
            id: mockTenants.tenant1.name,
            environments: [
              {
                ...mockTenants.tenant1,
                environment: Environment.Development,
              },
              {
                ...mockTenants.tenant1,
                environment: Environment.Staging,
              },
              {
                ...mockTenants.tenant1,
                environment: Environment.Production,
              },
            ],
          },
          {
            id: mockTenants.tenant2.name,
            environments: [
              {
                ...mockTenants.tenant2,
                environment: Environment.Development,
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
                environment: Environment.Development,
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
      expect(
        mockAdminDevApi.meTenantsControllerFindAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(tenants).toEqual({
        totalCount: 3,
        data: [
          {
            id: mockTenants.tenant1.name,
            environments: [
              {
                ...mockTenants.tenant1,
                environment: Environment.Development,
              },
            ],
          },
          {
            id: mockTenants.tenant2.name,
            environments: [
              {
                ...mockTenants.tenant2,
                environment: Environment.Development,
              },
            ],
          },
          {
            id: mockTenants.tenant3.name,
            environments: [
              {
                ...mockTenants.tenant3,
                environment: Environment.Development,
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

      const authAdminClientConfig: ConfigType<typeof AuthAdminApiClientConfig> =
        {
          basePaths: {},
          isConfigured: true,
        }

      // Act
      await testServer({
        appModule: TestModule,
        override: (builder) =>
          builder
            .overrideProvider(LOGGER_PROVIDER)
            .useValue(mockLogger)
            .overrideProvider(AuthAdminApiClientConfig.KEY)
            .useValue(authAdminClientConfig),
      })

      // Assert
      expect(mockLogger.error).toHaveBeenCalledTimes(1)
      expect(mockLogger.error).toHaveBeenCalledWith(
        'No admin api clients configured, at least one configured api is required.',
      )
    })
  })
})
