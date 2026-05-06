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
import { LanguageService } from './language.service'
import { LanguageResolver } from './language.resolver'

const englishDev = {
  isoKey: 'en',
  description: 'English',
  englishDescription: 'English',
}
const englishStaging = { ...englishDev, description: 'English (staging)' }
const englishProd = { ...englishDev, description: 'English (prod)' }
const icelandic = {
  isoKey: 'is',
  description: 'Íslenska',
  englishDescription: 'Icelandic',
}

const createMockAdminApi = (languages: typeof englishDev[]) => ({
  withMiddleware: jest.fn().mockReturnThis(),
  meLanguagesControllerFindAndCountAllRaw: jest
    .fn()
    .mockResolvedValue(
      createMockApiResponse({ rows: languages, count: languages.length }),
    ),
  meLanguagesControllerFindOneRaw: jest
    .fn()
    .mockImplementation(({ isoKey }) =>
      createMockApiResponse(languages.find((l) => l.isoKey === isoKey)),
    ),
  meLanguagesControllerCreateRaw: jest
    .fn()
    .mockImplementation(({ languageDTO }) =>
      createMockApiResponse(languageDTO),
    ),
  meLanguagesControllerUpdateRaw: jest
    .fn()
    .mockImplementation(({ isoKey, updateLanguageDto }) =>
      createMockApiResponse({
        isoKey,
        description: updateLanguageDto.description,
        englishDescription: updateLanguageDto.englishDescription,
      }),
    ),
  meLanguagesControllerDeleteRaw: jest
    .fn()
    .mockResolvedValue(createMockApiResponse(undefined)),
  meLanguagesControllerFindAllRaw: jest
    .fn()
    .mockResolvedValue(createMockApiResponse(languages)),
})

const mockAdminDevApi = createMockAdminApi([englishDev, icelandic])
const mockAdminStagingApi = createMockAdminApi([englishStaging])
const mockAdminProdApi = createMockAdminApi([englishProd])

@Module({
  imports: [
    AuthAdminApiClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuthAdminApiClientConfig],
    }),
  ],
  providers: [LanguageResolver, LanguageService],
})
class TestModule {}

describe('LanguageService', () => {
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
    let languageService: LanguageService

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

      languageService = app.get(LanguageService)
    })

    afterAll(async () => {
      await app.cleanUp()
    })

    it('getLanguages populates availableEnvironments per isoKey', async () => {
      const result = await languageService.getLanguages(currentUser, {
        searchString: '',
        page: 1,
        count: 10,
      })

      const enRow = result.rows.find((r) => r.isoKey === 'en')
      expect(enRow?.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])

      const isRow = result.rows.find((r) => r.isoKey === 'is')
      expect(isRow?.availableEnvironments).toEqual([Environment.Development])
    })

    it('getLanguage returns environments[] with one entry per env that has it', async () => {
      const result = await languageService.getLanguage(currentUser, 'en')

      expect(result?.availableEnvironments).toEqual([
        Environment.Development,
        Environment.Staging,
        Environment.Production,
      ])
      expect(result?.environments?.map((e) => e.description)).toEqual([
        'English',
        'English (staging)',
        'English (prod)',
      ])
    })

    it('getLanguage returns null when no env has the row', async () => {
      const result = await languageService.getLanguage(currentUser, 'zz')
      expect(result).toBeNull()
    })

    it('createLanguage only calls the requested environments', async () => {
      const result = await languageService.createLanguage(currentUser, {
        isoKey: 'fr',
        description: 'Français',
        englishDescription: 'French',
        environments: [Environment.Development],
      })

      expect(
        mockAdminDevApi.meLanguagesControllerCreateRaw,
      ).toHaveBeenCalledTimes(1)
      expect(
        mockAdminStagingApi.meLanguagesControllerCreateRaw,
      ).not.toHaveBeenCalled()
      expect(
        mockAdminProdApi.meLanguagesControllerCreateRaw,
      ).not.toHaveBeenCalled()
      expect(result.availableEnvironments).toEqual([Environment.Development])
    })

    it('createLanguage surfaces per-env failures via failedEnvironments', async () => {
      mockAdminStagingApi.meLanguagesControllerCreateRaw.mockRejectedValueOnce(
        new Error('boom'),
      )

      const result = await languageService.createLanguage(currentUser, {
        isoKey: 'fr',
        description: 'Français',
        englishDescription: 'French',
        environments: [Environment.Development, Environment.Staging],
      })

      expect(result.availableEnvironments).toEqual([Environment.Development])
      expect(result.failedEnvironments).toEqual([
        { environment: Environment.Staging, message: 'boom' },
      ])
    })

    it('updateLanguage throws when environments is empty', async () => {
      await expect(
        languageService.updateLanguage(currentUser, {
          isoKey: 'en',
          description: 'updated',
          englishDescription: 'updated',
          environments: [],
        }),
      ).rejects.toThrow(/Environments must be specified/)
    })

    it('deleteLanguage reports partial failure', async () => {
      mockAdminStagingApi.meLanguagesControllerDeleteRaw.mockRejectedValueOnce(
        new Error('cannot delete'),
      )

      const result = await languageService.deleteLanguage(
        currentUser,
        'en',
        [Environment.Development, Environment.Staging],
      )

      expect(result.success).toBe(false)
      expect(result.affectedEnvironments).toEqual([Environment.Development])
      expect(result.failedEnvironments).toEqual([
        { environment: Environment.Staging, message: 'cannot delete' },
      ])
    })
  })
})
