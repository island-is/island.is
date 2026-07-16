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

import { createMockApiResponse } from '../../../test/utils'
import { UserIdentityResolver } from './user-identity.resolver'
import { UserIdentityService } from './user-identity.service'

const claim = (type: string, value: string) => ({
  type,
  value,
  valueType: 'string',
  issuer: 'issuer',
  originalIssuer: 'issuer',
})

const identity1 = (active: boolean) => ({
  subjectId: 'subject-1',
  name: 'Identity One',
  providerName: 'provider',
  providerSubjectId: 'provider-subject-1',
  active,
  claims: [claim('name', 'Identity One')],
})

const identity2 = {
  subjectId: 'subject-2',
  name: 'Identity Two',
  providerName: 'provider',
  providerSubjectId: 'provider-subject-2',
  active: true,
  claims: [claim('name', 'Identity Two')],
}

// 204 ⇒ handle204 resolves to null ⇒ the service skips the environment
const noContentResponse = () =>
  Promise.resolve({
    raw: { status: 204 },
    value: () => Promise.resolve(null),
  })

const createMockAdminApi = () => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meUserIdentitiesControllerFindByNationalIdRaw: jest.fn(),
  meUserIdentitiesControllerFindBySubjectIdRaw: jest.fn(),
  meUserIdentitiesControllerSetActiveRaw: jest.fn(),
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
  providers: [UserIdentityResolver, UserIdentityService],
})
class TestModule {}

describe('UserIdentityService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId('person'),
  })
  const searchNationalId = createNationalId('person')

  let app: TestApp
  let service: UserIdentityService

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

    service = app.get(UserIdentityService)
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  beforeEach(() => {
    for (const api of [
      mockAdminDevApi,
      mockAdminStagingApi,
      mockAdminProdApi,
    ]) {
      api.meUserIdentitiesControllerFindByNationalIdRaw.mockReset()
      api.meUserIdentitiesControllerFindBySubjectIdRaw.mockReset()
      api.meUserIdentitiesControllerSetActiveRaw.mockReset()
    }
  })

  describe('findUserIdentities', () => {
    it('returns an empty list for an empty search string without calling any environment', async () => {
      const result = await service.findUserIdentities(currentUser, {
        searchString: '   ',
      })

      expect(result).toEqual([])
      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindByNationalIdRaw,
      ).not.toHaveBeenCalled()
      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindBySubjectIdRaw,
      ).not.toHaveBeenCalled()
    })

    it('searches by national id in all environments and merges rows by subjectId', async () => {
      mockAdminDevApi.meUserIdentitiesControllerFindByNationalIdRaw.mockReturnValue(
        createMockApiResponse([identity1(true), identity2]),
      )
      mockAdminStagingApi.meUserIdentitiesControllerFindByNationalIdRaw.mockReturnValue(
        createMockApiResponse([identity1(true)]),
      )
      mockAdminProdApi.meUserIdentitiesControllerFindByNationalIdRaw.mockReturnValue(
        createMockApiResponse([identity1(false)]),
      )

      const result = await service.findUserIdentities(currentUser, {
        searchString: searchNationalId,
      })

      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindByNationalIdRaw,
      ).toHaveBeenCalledWith({ xQueryNationalId: searchNationalId })
      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindBySubjectIdRaw,
      ).not.toHaveBeenCalled()

      expect(result).toHaveLength(2)

      const merged = result.find((row) => row.subjectId === 'subject-1')
      expect(merged).toBeDefined()
      expect(merged?.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])
      expect(merged?.activeEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
      ])
      expect(merged?.deactivatedEnvironments).toEqual([Environment.Production])
      // Identical claims across environments are deduplicated in the summary
      expect(merged?.claims).toHaveLength(1)
      expect(merged?.environments).toHaveLength(3)

      const devOnly = result.find((row) => row.subjectId === 'subject-2')
      expect(devOnly?.availableEnvironments).toEqual([Environment.Development])
    })

    it('searches by subject id when the search string is not a valid national id', async () => {
      mockAdminDevApi.meUserIdentitiesControllerFindBySubjectIdRaw.mockReturnValue(
        createMockApiResponse(identity1(true)),
      )
      // Environments without the identity respond with 204 (no content)
      mockAdminStagingApi.meUserIdentitiesControllerFindBySubjectIdRaw.mockReturnValue(
        noContentResponse(),
      )
      mockAdminProdApi.meUserIdentitiesControllerFindBySubjectIdRaw.mockReturnValue(
        noContentResponse(),
      )

      const result = await service.findUserIdentities(currentUser, {
        searchString: 'subject-1',
      })

      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindBySubjectIdRaw,
      ).toHaveBeenCalledWith({ subjectId: 'subject-1' })
      expect(
        mockAdminDevApi.meUserIdentitiesControllerFindByNationalIdRaw,
      ).not.toHaveBeenCalled()

      expect(result).toHaveLength(1)
      expect(result[0].subjectId).toBe('subject-1')
      expect(result[0].availableEnvironments).toEqual([
        Environment.Development,
      ])
    })

    it('still returns results from healthy environments when one environment fails', async () => {
      mockAdminDevApi.meUserIdentitiesControllerFindByNationalIdRaw.mockReturnValue(
        createMockApiResponse([identity1(true)]),
      )
      mockAdminStagingApi.meUserIdentitiesControllerFindByNationalIdRaw.mockRejectedValue(
        new Error('staging is down'),
      )
      mockAdminProdApi.meUserIdentitiesControllerFindByNationalIdRaw.mockReturnValue(
        createMockApiResponse([identity1(true)]),
      )

      const result = await service.findUserIdentities(currentUser, {
        searchString: searchNationalId,
      })

      expect(result).toHaveLength(1)
      expect(result[0].availableEnvironments).toEqual([
        Environment.Development,
        Environment.Production,
      ])
    })
  })

  describe('setActive', () => {
    it('throws when no target environments are provided', async () => {
      await expect(
        service.setActive(currentUser, 'subject-1', false, []),
      ).rejects.toThrow(
        'No target environments provided for user identity update',
      )

      expect(
        mockAdminDevApi.meUserIdentitiesControllerSetActiveRaw,
      ).not.toHaveBeenCalled()
      expect(
        mockAdminStagingApi.meUserIdentitiesControllerSetActiveRaw,
      ).not.toHaveBeenCalled()
      expect(
        mockAdminProdApi.meUserIdentitiesControllerSetActiveRaw,
      ).not.toHaveBeenCalled()
    })

    it('only calls the selected environments and reports success', async () => {
      mockAdminDevApi.meUserIdentitiesControllerSetActiveRaw.mockReturnValue(
        createMockApiResponse(identity1(false)),
      )
      mockAdminStagingApi.meUserIdentitiesControllerSetActiveRaw.mockReturnValue(
        createMockApiResponse(identity1(false)),
      )

      const result = await service.setActive(currentUser, 'subject-1', false, [
        Environment.Development,
        Environment.Staging,
      ])

      expect(result.success).toBe(true)
      expect(result.affectedEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
      ])
      expect(result.failedEnvironments).toBeUndefined()
      expect(
        mockAdminDevApi.meUserIdentitiesControllerSetActiveRaw,
      ).toHaveBeenCalledWith({
        subjectId: 'subject-1',
        activeDTO: { active: false },
      })
      expect(
        mockAdminProdApi.meUserIdentitiesControllerSetActiveRaw,
      ).not.toHaveBeenCalled()
    })

    it('reports partial failure with the failing environments', async () => {
      mockAdminDevApi.meUserIdentitiesControllerSetActiveRaw.mockReturnValue(
        createMockApiResponse(identity1(false)),
      )
      mockAdminStagingApi.meUserIdentitiesControllerSetActiveRaw.mockRejectedValue(
        new Error('staging is down'),
      )

      const result = await service.setActive(currentUser, 'subject-1', false, [
        Environment.Development,
        Environment.Staging,
      ])

      expect(result.success).toBe(false)
      expect(result.affectedEnvironments).toEqual([Environment.Development])
      expect(result.failedEnvironments).toEqual([
        {
          environment: Environment.Staging,
          message: 'staging is down',
        },
      ])
    })

    it('throws when the update fails in every environment', async () => {
      mockAdminDevApi.meUserIdentitiesControllerSetActiveRaw.mockRejectedValue(
        new Error('dev is down'),
      )
      mockAdminStagingApi.meUserIdentitiesControllerSetActiveRaw.mockRejectedValue(
        new Error('staging is down'),
      )

      await expect(
        service.setActive(currentUser, 'subject-1', false, [
          Environment.Development,
          Environment.Staging,
        ]),
      ).rejects.toThrow('Failed to deactivate user identity in all environments')
    })
  })
})
