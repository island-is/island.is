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
import { TranslationService } from './translation.service'
import { TranslationResolver } from './translation.resolver'

const translationDev = {
  language: 'en',
  className: 'client',
  property: 'displayName',
  key: 'island.is-1',
  value: 'Hello (dev)',
}
const translationStaging = { ...translationDev, value: 'Hello (staging)' }
const translationProd = { ...translationDev, value: 'Hello (prod)' }

const otherTranslation = {
  language: 'is',
  className: 'scope',
  property: 'displayName',
  key: 'profile',
  value: 'Notandasnið',
}

const createMockAdminApi = (translations: typeof translationDev[]) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meTranslationsControllerFindAndCountAllRaw: jest
    .fn()
    .mockResolvedValue(
      createMockApiResponse({
        rows: translations,
        count: translations.length,
      }),
    ),
  meTranslationsControllerFindOneRaw: jest
    .fn()
    .mockImplementation(({ language, className, property, key }) => {
      const found = translations.find(
        (t) =>
          t.language === language &&
          t.className === className &&
          t.property === property &&
          t.key === key,
      )
      return createMockApiResponse(found)
    }),
  meTranslationsControllerCreateRaw: jest
    .fn()
    .mockImplementation(({ translationDTO }) =>
      createMockApiResponse(translationDTO),
    ),
  meTranslationsControllerUpdateRaw: jest
    .fn()
    .mockImplementation(
      ({ language, className, property, key, updateTranslationDto }) =>
        createMockApiResponse({
          language,
          className,
          property,
          key,
          value: updateTranslationDto.value,
        }),
    ),
  meTranslationsControllerDeleteRaw: jest
    .fn()
    .mockResolvedValue(createMockApiResponse(undefined)),
  meLanguagesControllerFindAllRaw: jest.fn().mockResolvedValue(
    createMockApiResponse([
      { isoKey: 'en', description: 'English', englishDescription: 'English' },
    ]),
  ),
})

const mockAdminDevApi = createMockAdminApi([translationDev, otherTranslation])
const mockAdminStagingApi = createMockAdminApi([translationStaging])
const mockAdminProdApi = createMockAdminApi([translationProd])

@Module({
  imports: [
    AuthAdminApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
  providers: [TranslationResolver, TranslationService],
})
class TestModule {}

describe('TranslationService', () => {
  const currentUser = createCurrentUser({
    nationalId: createNationalId('person'),
  })

  beforeEach(() => {
    Object.values(mockAdminDevApi).forEach(
      (m) => typeof m === 'function' && (m as jest.Mock).mockClear(),
    )
    Object.values(mockAdminStagingApi).forEach(
      (m) => typeof m === 'function' && (m as jest.Mock).mockClear(),
    )
    Object.values(mockAdminProdApi).forEach(
      (m) => typeof m === 'function' && (m as jest.Mock).mockClear(),
    )
  })

  describe('with multiple environments', () => {
    let app: TestApp
    let translationService: TranslationService

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

      translationService = app.get(TranslationService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('getTranslations populates availableEnvironments per composite key', async () => {
      const result = await translationService.getTranslations(currentUser, {
        searchString: '',
        page: 1,
        count: 10,
      })

      expect(
        mockAdminDevApi.meTranslationsControllerFindAndCountAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meTranslationsControllerFindAndCountAllRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminProdApi.meTranslationsControllerFindAndCountAllRaw,
      ).toHaveBeenCalledTimes(1)

      const sharedRow = result.rows.find(
        (r) => r.key === translationDev.key && r.className === 'client',
      )
      expect(sharedRow?.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])

      const devOnlyRow = result.rows.find((r) => r.className === 'scope')
      expect(devOnlyRow?.availableEnvironments).toEqual([
        Environment.Development,
      ])
    })

    it('getTranslation returns one environments[] entry per env that has the row', async () => {
      const result = await translationService.getTranslation(currentUser, {
        language: translationDev.language,
        className: translationDev.className,
        property: translationDev.property,
        key: translationDev.key,
      })

      expect(result?.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])
      expect(result?.environments).toHaveLength(3)
      expect(
        result?.environments?.map((e) => [e.environment, e.value]),
      ).toEqual([
        [Environment.Development, 'Hello (dev)'],
        [Environment.Staging, 'Hello (staging)'],
        [Environment.Production, 'Hello (prod)'],
      ])
    })

    it('getTranslation returns null when no env has the row', async () => {
      const result = await translationService.getTranslation(currentUser, {
        language: 'en',
        className: 'client',
        property: 'displayName',
        key: 'does-not-exist',
      })

      expect(result).toBeNull()
    })

    it('createTranslation only calls the requested environments', async () => {
      const result = await translationService.createTranslation(currentUser, {
        language: 'en',
        className: 'client',
        property: 'displayName',
        key: 'new-key',
        value: 'Created',
        environments: [Environment.Development, Environment.Staging],
      })

      expect(
        mockAdminDevApi.meTranslationsControllerCreateRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meTranslationsControllerCreateRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminProdApi.meTranslationsControllerCreateRaw,
      ).not.toHaveBeenCalled()
      expect(result.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
      ])
    })

    it('createTranslation surfaces per-env failures via failedEnvironments', async () => {
      mockAdminStagingApi.meTranslationsControllerCreateRaw.mockRejectedValueOnce(
        new Error('boom'),
      )

      const result = await translationService.createTranslation(currentUser, {
        language: 'en',
        className: 'client',
        property: 'displayName',
        key: 'new-key',
        value: 'Created',
        environments: [Environment.Development, Environment.Staging],
      })

      expect(result.availableEnvironments).toEqual([Environment.Development])
      expect(result.failedEnvironments).toEqual([
        { environment: Environment.Staging, message: 'boom' },
      ])
    })

    it('updateTranslation throws when environments is empty', async () => {
      await expect(
        translationService.updateTranslation(currentUser, {
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: 'island.is-1',
          value: 'updated',
          environments: [],
        }),
      ).rejects.toThrow(/Environments must be specified/)
    })

    it('deleteTranslation returns success when all targeted envs succeed', async () => {
      const result = await translationService.deleteTranslation(
        currentUser,
        {
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: 'island.is-1',
        },
        [Environment.Development, Environment.Staging],
      )

      expect(result.success).toBe(true)
      expect(result.affectedEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
      ])
      expect(
        mockAdminProdApi.meTranslationsControllerDeleteRaw,
      ).not.toHaveBeenCalled()
    })

    it('deleteTranslation reports partial failure', async () => {
      mockAdminStagingApi.meTranslationsControllerDeleteRaw.mockRejectedValueOnce(
        new Error('cannot delete'),
      )

      const result = await translationService.deleteTranslation(
        currentUser,
        {
          language: 'en',
          className: 'client',
          property: 'displayName',
          key: 'island.is-1',
        },
        [Environment.Development, Environment.Staging],
      )

      expect(result.success).toBe(false)
      expect(result.affectedEnvironments).toEqual([Environment.Development])
      expect(result.failedEnvironments).toEqual([
        { environment: Environment.Staging, message: 'cannot delete' },
      ])
    })

    it('getLanguagesForDropdown returns the first reachable env list', async () => {
      const result = await translationService.getLanguagesForDropdown(
        currentUser,
      )

      expect(result).toEqual([
        { isoKey: 'en', description: 'English', englishDescription: 'English' },
      ])
    })
  })
})
