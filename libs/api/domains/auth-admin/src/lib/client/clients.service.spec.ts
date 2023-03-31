import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
  AuthAdminApiClientConfig,
  AuthAdminApiClientModule,
} from '@island.is/clients/auth/admin-api'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigType } from '@island.is/nest/config'
import { Environment } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, testServer, useAuth } from '@island.is/testing/nest'

import { ClientType } from '../models/client-type.enum'
import { ClientsResolver } from './clients.resolver'
import { ClientsService } from './clients.service'
import { CreateClientInput } from './dto/create-client.input'

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
  providers: [ClientsResolver, ClientsService],
  exports: [ClientsResolver],
})
class TestModule {}

describe('ClientsService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with multiple environments', () => {
    let app: TestApp
    let clientsService: ClientsService

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

      clientsService = app.get(ClientsService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('should create application in all environments', async function () {
      const createClientsInput: CreateClientInput = {
        clientId: 'test-application-id',
        clientType: ClientType.web,
        environments: [
          Environment.Development,
          Environment.Staging,
          Environment.Production,
        ],
        displayName: 'Test Application',
        tenantId: 'test-tenant-id',
      }

      const response = await clientsService.createClient(
        currentUser,
        createClientsInput,
      )

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminProdApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          clientId: 'test-client-id',
        },
        { environment: Environment.Staging, clientId: 'test-client-id' },
        {
          environment: Environment.Production,
          clientId: 'test-client-id',
        },
      ])
    })

    it('should only create application in development', async function () {
      const createClientsInput: CreateClientInput = {
        clientId: 'test-application-id',
        clientType: ClientType.web,
        environments: [Environment.Development],
        displayName: 'Test Application',
        tenantId: 'test-tenant-id',
      }

      const response = await clientsService.createClient(
        currentUser,
        createClientsInput,
      )

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerCreate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meClientsControllerCreate).toBeCalledTimes(0)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          clientId: 'test-client-id',
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
