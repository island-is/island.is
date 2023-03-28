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

import { ApplicationsResolver } from './applications.resolver'
import { ApplicationsService } from './applications.service'
import { ApplicationType } from '../models/applicationType'
import { ConfigType } from '@island.is/nest/config'
import { LOGGER_PROVIDER } from '@island.is/logging'

const createMockAdminApi = () => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meClientsControllerCreate: jest
    .fn()
    .mockResolvedValue({ clientId: 'test-client-id' }),
})

const mockAdminDevApi = createMockAdminApi()
const mockAdminStagingApi = createMockAdminApi()
const mockAdminProdApi = createMockAdminApi()

@Module({
  imports: [
    AuthAdminApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
  controllers: [],
  providers: [ApplicationsResolver, ApplicationsService],
  exports: [ApplicationsResolver],
})
class TestModule {}

describe('ApplicationsService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with multiple environments', () => {
    let app: TestApp
    let applicationsService: ApplicationsService

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

      applicationsService = app.get(ApplicationsService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should create application in all environments', async function () {
      const createClientsInput = {
        applicationId: 'test-application-id',
        applicationType: ApplicationType.Web,
        environments: [
          Environment.Development,
          Environment.Staging,
          Environment.Production,
        ],
        displayName: 'Test Application',
        tenantId: 'test-tenant-id',
      }

      const response = await applicationsService.createApplication(
        createClientsInput,
        currentUser,
      )

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminProdApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          applicationId: 'test-client-id',
        },
        { environment: Environment.Staging, applicationId: 'test-client-id' },
        {
          environment: Environment.Production,
          applicationId: 'test-client-id',
        },
      ])
    })

    it('should only create application in development', async function () {
      const createClientsInput = {
        applicationId: 'test-application-id',
        applicationType: ApplicationType.Web,
        environments: [Environment.Development],
        displayName: 'Test Application',
        tenantId: 'test-tenant-id',
      }

      const response = await applicationsService.createApplication(
        createClientsInput,
        currentUser,
      )

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerCreate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meClientsControllerCreate).toBeCalledTimes(0)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          applicationId: 'test-client-id',
        },
      ])
    })
  })

  describe('with no available environment', () => {
    it('logs error', async () => {
      const mockLogger = {
        error: jest.fn(),
      }

      const authAdminClientConfig: ConfigType<
        typeof AuthAdminApiClientConfig
      > = {
        basePaths: {},
        isConfigured: true,
      }

      await testServer({
        appModule: TestModule,
        override: (builder) =>
          builder
            .overrideProvider(LOGGER_PROVIDER)
            .useValue(mockLogger)
            .overrideProvider(AuthAdminApiClientConfig.KEY)
            .useValue(authAdminClientConfig),
      })

      expect(mockLogger.error).toBeCalledTimes(1)
      expect(mockLogger.error).toBeCalledWith(
        'No admin api clients configured, at least one configured api is required.',
      )
    })
  })
})
