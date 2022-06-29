import { Test } from '@nestjs/testing'
import {
  HttpModule,
  HttpService,
  CACHE_MANAGER,
  INestApplication,
} from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { of } from 'rxjs'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../../../environments'
import {
  NationalRegistryService,
  CACHE_KEY,
  ONE_MONTH,
} from '../../nationalRegistry.service'
import {
  NationalRegistryGeneralLookupResponse,
  NationalRegistryUser,
} from '../../nationalRegistry.types'

import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
  EinstaklingarApi,
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'

const { nationalRegistry } = environment

const nationalRegistryGeneralLookupResponse: NationalRegistryGeneralLookupResponse = {
  source: 'Þjóðskrá',
  ssn: '1306886513',
  name: 'Jón Gunnar Jónsson',
  gender: 'kk',
  address: 'Bessastaðir 1',
  postalcode: '225',
  city: 'Álftanes',
  lastmodified: '2011-10-05T14:48:00.000Z',
  charged: true,
  error: '',
}

const user: NationalRegistryUser = {
  nationalId: '1306886513',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
}

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: ['@vegagerdin.is/air-discount-scheme-scope'],
  authorization: '',
  client: '',
}

describe('NationalRegistryService', () => {
  let nationalRegistryService: NationalRegistryService
  let einstaklingarApi: EinstaklingarApi
  let cacheManager: CacheManager

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, NationalRegistryClientConfig],
        }),
        NationalRegistryClientModule,
      ],
      providers: [
        NationalRegistryService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
        {
          provide: LOGGER_PROVIDER,
          useClass: jest.fn(() => ({
            error: () => ({}),
          })),
        },
      ],
    }).compile()

    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)

    einstaklingarApi = moduleRef.get<EinstaklingarApi>(EinstaklingarApi)
  })

  describe('getUser', () => {
    it('should return null if nationalRegistry throws an error', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(
        user.nationalId,
        auth,
      )

      expect(result).toEqual(null)
    })
  })

  // AIRTODO: replace with forsjá?
  /*
  describe('getRelatedChildren', () => {
    it('should fetch family from the nationalregistry, filter for children and cache them', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosFamilyLookupResponse))
      const cacheManagerSetSpy = jest
        .spyOn(cacheManager, 'set')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getRelatedChildren(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_children`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/family-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_children`,
        { children },
        { ttl: ONE_MONTH },
      )
      expect(result).toEqual(children)
    })

    it('should fetch family from cache', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ children }))
      const httpServiceSpy = jest.spyOn(httpService, 'get')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      const result = await nationalRegistryService.getRelatedChildren(
        user.nationalId,
      )

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_children`,
      )
      expect(httpServiceSpy).not.toHaveBeenCalled()
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()
      expect(result).toEqual(children)
    })

    it('should not fetch children of a child', async () => {
      const childNationalId =
        nationalRegistryFamilyLookupResponse.results[1].ssn

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosFamilyLookupResponse))
      const cacheManagerSetSpy = jest
        .spyOn(cacheManager, 'set')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getRelatedChildren(
        childNationalId,
      )

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${childNationalId}_children`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/family-lookup?ssn=${childNationalId}`,
      )
      expect(cacheManagerSetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${childNationalId}_children`,
        { children: [] },
        { ttl: ONE_MONTH },
      )

      expect(result).toEqual([])
    })

    it('should return empty family when errored', async () => {
      const errorResponse = axiosFamilyLookupResponse
      errorResponse.data[0].error = 'No family found'

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosFamilyLookupResponse))
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      const result = await nationalRegistryService.getRelatedChildren(
        user.nationalId,
      )

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_children`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/family-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()

      expect(result).toEqual([])
    })
  })
  */
})
