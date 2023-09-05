import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import {
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
  AuthAdminApiClientConfig,
  AuthAdminApiClientModule,
  ClientType,
  RefreshTokenExpiration,
} from '@island.is/clients/auth/admin-api'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigType } from '@island.is/nest/config'
import { Environment } from '@island.is/shared/types'
import {
  createCurrentUser,
  createNationalId,
} from '@island.is/testing/fixtures'
import { TestApp, testServer, useAuth } from '@island.is/testing/nest'

import { CreateClientType } from '../models/client-type.enum'
import { ClientsResolver } from './clients.resolver'
import { ClientsService } from './clients.service'
import { CreateClientInput } from './dto/create-client.input'
import { PatchClientInput } from './dto/patch-client.input'
import { AdminClientDto } from '@island.is/auth-api-lib'
import { PublishClientInput } from './dto/publish-client.input'
import { RotateSecretInput } from './dto/rotate-secret.input'
import { ClientSecret } from './models/client-secret.model'

const baseResponse: AdminClientDto = {
  clientId: 'test-client-id',
  tenantId: 'test-tenant-id',
  clientType: ClientType.web,
  displayName: [
    { locale: 'is', value: 'Test client' },
    { locale: 'en', value: 'Test client' },
  ],
  absoluteRefreshTokenLifetime: 3600,
  redirectUris: ['https://test.island.is'],
  postLogoutRedirectUris: ['https://test.island.is'],
  refreshTokenExpiration: RefreshTokenExpiration.Absolute,
  slidingRefreshTokenLifetime: 3600,
  supportsCustomDelegation: true,
  supportsLegalGuardians: true,
  supportsProcuringHolders: true,
  supportsPersonalRepresentatives: true,
  promptDelegations: true,
  requireApiScopes: true,
  requireConsent: true,
  allowOfflineAccess: true,
  requirePkce: true,
  supportTokenExchange: true,
  accessTokenLifetime: 3600,
  customClaims: [{ type: 'string', value: 'test' }],
}

const secretResponse: ClientSecret = {
  clientId: baseResponse.clientId,
  secretId: 'secret-id',
  decryptedValue: 'secret-value',
}

const createMockAdminApi = () => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meClientsControllerUpdate: jest.fn().mockImplementation((data) => {
    const { adminPatchClientDto } = data
    return {
      ...baseResponse,
      ...adminPatchClientDto,
    }
  }),
  meClientsControllerFindByTenantIdAndClientId: jest
    .fn()
    .mockResolvedValue(baseResponse),
  meClientsControllerCreate: jest.fn().mockResolvedValue(baseResponse),
  meClientSecretsControllerCreate: jest.fn().mockImplementation((data) => {
    const { clientId } = data
    return {
      ...secretResponse,
      clientId,
    }
  }),
  meClientSecretsControllerFindAll: jest.fn().mockResolvedValue([
    { ...secretResponse, secretId: '1' },
    { ...secretResponse, secretId: '2' },
  ]),
  meClientSecretsControllerDelete: jest.fn(),
  meTenantsControllerFindById: jest.fn().mockResolvedValue({
    id: 'test-tenant-id',
    name: 'Test tenant',
    contactEmail: 'test@test.is',
  }),
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
        clientType: CreateClientType.web,
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
        clientType: CreateClientType.web,
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

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledWith({
        adminCreateClientDto: {
          clientId: 'test-application-id',
          clientType: CreateClientType.web,
          clientName: 'Test Application',
          contactEmail: 'test@test.is',
        },
        tenantId: 'test-tenant-id',
      })

      expect(response).toEqual([
        {
          environment: Environment.Development,
          clientId: 'test-client-id',
        },
      ])
    })

    it('should publish the client from Staging to Development', async function () {
      const publishClientInput: PublishClientInput = {
        clientId: 'test-client-id',
        tenantId: 'test-tenant-id',
        sourceEnvironment: Environment.Staging,
        targetEnvironment: Environment.Development,
      }

      const response = await clientsService.publishClient(
        currentUser,
        publishClientInput,
      )

      expect(mockAdminDevApi.meClientsControllerCreate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerCreate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meClientsControllerCreate).toBeCalledTimes(0)

      expect(
        mockAdminDevApi.meClientsControllerFindByTenantIdAndClientId,
      ).toBeCalledTimes(0)
      expect(
        mockAdminStagingApi.meClientsControllerFindByTenantIdAndClientId,
      ).toBeCalledTimes(1)
      expect(
        mockAdminProdApi.meClientsControllerFindByTenantIdAndClientId,
      ).toBeCalledTimes(0)

      expect(response).toEqual({
        ...baseResponse,
        id: 'test-client-id#development',
        environment: Environment.Development,
      })
    })

    it('should throw an error because no value was provided', async function () {
      const patchClientsInput: PatchClientInput = {
        clientId: 'test-application-id',
        tenantId: 'test-tenant-id',
        environments: [
          Environment.Development,
          Environment.Staging,
          Environment.Production,
        ],
      }

      // act
      const actPromise = clientsService.patchClient(
        currentUser,
        patchClientsInput,
      )
      // assert
      await expect(actPromise).rejects.toThrow('Nothing provided to update')
    })

    it('should update the postLogoutRedirectUris for all environments', async function () {
      const patchClientsInput: PatchClientInput = {
        clientId: 'test-application-id',
        tenantId: 'test-tenant-id',
        environments: [
          Environment.Development,
          Environment.Staging,
          Environment.Production,
        ],
        postLogoutRedirectUris: [
          'https://test.island.is',
          'https://test2.island.is',
        ],
      }

      const response = await clientsService.patchClient(
        currentUser,
        patchClientsInput,
      )

      expect(mockAdminDevApi.meClientsControllerUpdate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerUpdate).toBeCalledTimes(1)
      expect(mockAdminProdApi.meClientsControllerUpdate).toBeCalledTimes(1)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          ...baseResponse,
          id: `${
            baseResponse.clientId
          }#${Environment.Development.toLowerCase()}`,
          postLogoutRedirectUris: [
            'https://test.island.is',
            'https://test2.island.is',
          ],
        },
        {
          environment: Environment.Staging,
          ...baseResponse,
          id: `${baseResponse.clientId}#${Environment.Staging.toLowerCase()}`,
          postLogoutRedirectUris: [
            'https://test.island.is',
            'https://test2.island.is',
          ],
        },
        {
          environment: Environment.Production,
          ...baseResponse,
          id: `${
            baseResponse.clientId
          }#${Environment.Production.toLowerCase()}`,
          postLogoutRedirectUris: [
            'https://test.island.is',
            'https://test2.island.is',
          ],
        },
      ])
    })

    it('should update the postLogoutRedirectUris for all Development only', async function () {
      const patchClientsInput: PatchClientInput = {
        clientId: 'test-application-id',
        tenantId: 'test-tenant-id',
        environments: [Environment.Development],
        postLogoutRedirectUris: [
          'https://test.island.is',
          'https://test2.island.is',
        ],
      }

      const response = await clientsService.patchClient(
        currentUser,
        patchClientsInput,
      )

      expect(mockAdminDevApi.meClientsControllerUpdate).toBeCalledTimes(1)
      expect(mockAdminStagingApi.meClientsControllerUpdate).toBeCalledTimes(0)
      expect(mockAdminProdApi.meClientsControllerUpdate).toBeCalledTimes(0)
      expect(response).toEqual([
        {
          environment: Environment.Development,
          ...baseResponse,
          id: `${
            baseResponse.clientId
          }#${Environment.Development.toLowerCase()}`,
          postLogoutRedirectUris: [
            'https://test.island.is',
            'https://test2.island.is',
          ],
        },
      ])
    })

    it('should only rotate secret in a single target environment', async function () {
      // Arrange
      const rotateSecretInput: RotateSecretInput = {
        clientId: 'test-application-id',
        tenantId: 'test-tenant-id',
        environment: Environment.Development,
      }

      // Act
      const response = await clientsService.rotateSecret(
        currentUser,
        rotateSecretInput,
      )

      // Assert
      expect(mockAdminDevApi.meClientSecretsControllerCreate).toBeCalledTimes(1)
      expect(
        mockAdminStagingApi.meClientSecretsControllerCreate,
      ).toBeCalledTimes(0)
      expect(mockAdminProdApi.meClientSecretsControllerCreate).toBeCalledTimes(
        0,
      )
      expect(response).toEqual({
        ...secretResponse,
        clientId: rotateSecretInput.clientId,
      })
    })

    it('should revoke old secrets and create new secret in a single environment', async function () {
      // Arrange
      const rotateSecretInput: RotateSecretInput = {
        clientId: 'test-application-id',
        tenantId: 'test-tenant-id',
        environment: Environment.Development,
        revokeOldSecrets: true,
      }

      // Act
      const response = await clientsService.rotateSecret(
        currentUser,
        rotateSecretInput,
      )

      // Assert
      expect.assertions(12)
      expect(mockAdminDevApi.meClientSecretsControllerFindAll).toBeCalledTimes(
        1,
      )
      expect(mockAdminDevApi.meClientSecretsControllerDelete).toBeCalledTimes(2)
      expect(mockAdminDevApi.meClientSecretsControllerDelete).nthCalledWith(1, {
        clientId: rotateSecretInput.clientId,
        tenantId: rotateSecretInput.tenantId,
        secretId: '1',
      })
      expect(mockAdminDevApi.meClientSecretsControllerDelete).nthCalledWith(2, {
        clientId: rotateSecretInput.clientId,
        tenantId: rotateSecretInput.tenantId,
        secretId: '2',
      })
      expect(mockAdminDevApi.meClientSecretsControllerCreate).toBeCalledTimes(1)
      ;[mockAdminStagingApi, mockAdminProdApi].map((api) => {
        expect(api.meClientSecretsControllerFindAll).toBeCalledTimes(0)
        expect(api.meClientSecretsControllerDelete).toBeCalledTimes(0)
        expect(api.meClientSecretsControllerCreate).toBeCalledTimes(0)
      })

      expect(response).toEqual({
        ...secretResponse,
        clientId: rotateSecretInput.clientId,
      })
    })
  })

  describe('with no available environment', () => {
    it('logs error', async () => {
      const mockLogger = {
        error: jest.fn(),
      }

      const authAdminClientConfig: ConfigType<typeof AuthAdminApiClientConfig> =
        {
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
