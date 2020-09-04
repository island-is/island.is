import { Test } from '@nestjs/testing'
import { HttpModule, HttpService, CACHE_MANAGER } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { CacheManager } from 'cache-manager'
import { of } from 'rxjs'

import { environment } from '../../../../../environments'
import {
  NationalRegistryService,
  CACHE_KEY,
  ONE_MONTH,
} from '../../nationalRegistry.service'
import {
  NationalRegistryGeneralLookupResponse,
  NationalRegistryFamilyLookupResponse,
  NationalRegistryUser,
} from '../../nationalRegistry.types'

const { nationalRegistry } = environment

const nationalRegistryGeneralLookupResponse: NationalRegistryGeneralLookupResponse = {
  source: 'Þjóðskrá',
  ssn: '1326487905',
  name: 'Jón Gunnar Jónsson',
  gender: 'kk',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
  lastmodified: '2011-10-05T14:48:00.000Z',
  charged: true,
  error: '',
}

const nationalRegistryFamilyLookupResponse: NationalRegistryFamilyLookupResponse = {
  source: 'Þjóðskrá',
  familyssn: '1326487905',
  results: [
    {
      name: 'Jón Gunnar Jónsson',
      ssn: '1326487905',
      address: 'Bessastaðir 1',
      postalcode: 225,
      towncode: 1300,
      city: 'Álftanes',
    },
  ],
}

const axiosGeneralLookupResponse: AxiosResponse = {
  data: [nationalRegistryGeneralLookupResponse],
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

const axiosFamilyLookupResponse: AxiosResponse = {
  data: [nationalRegistryFamilyLookupResponse],
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

const user: NationalRegistryUser = {
  nationalId: '1326487905',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
}

const family: string[] = [user.nationalId]

describe('NationalRegistryService', () => {
  let nationalRegistryService: NationalRegistryService
  let httpService: HttpService
  let cacheManager: CacheManager

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        NationalRegistryService,
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
          })),
        },
      ],
    }).compile()

    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    httpService = moduleRef.get<HttpService>(HttpService)
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)
  })

  describe('getUser', () => {
    it('should fetch user from the nationalregistry and cache it', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosGeneralLookupResponse))
      const cacheManagerSetSpy = jest
        .spyOn(cacheManager, 'set')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_user`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/general-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_user`,
        { user },
        { ttl: ONE_MONTH },
      )
      expect(result).toEqual(user)
    })

    it('should fetch user from cache', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ user }))
      const httpServiceSpy = jest.spyOn(httpService, 'get')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      const result = await nationalRegistryService.getUser(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_user`,
      )
      expect(httpServiceSpy).not.toHaveBeenCalled()
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()
      expect(result).toEqual(user)
    })

    it('should return null if nationalRegistry throws an error', async () => {
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() =>
          of({
            ...axiosGeneralLookupResponse,
            data: [
              {
                ...axiosGeneralLookupResponse.data[0],
                error: 'Wow an error occurred',
              },
            ],
          }),
        )
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      const result = await nationalRegistryService.getUser(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_user`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/general-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()
      expect(result).toEqual(null)
    })
  })

  describe('getFamily', () => {
    it('should fetch family from the nationalregistry and cache it', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))
      const httpServiceSpy = jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosFamilyLookupResponse))
      const cacheManagerSetSpy = jest
        .spyOn(cacheManager, 'set')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getFamily(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_family`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/family-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_family`,
        { family },
        { ttl: ONE_MONTH },
      )
      expect(result).toEqual(family)
    })

    it('should fetch family from cache', async () => {
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ family }))
      const httpServiceSpy = jest.spyOn(httpService, 'get')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      const result = await nationalRegistryService.getFamily(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}_family`,
      )
      expect(httpServiceSpy).not.toHaveBeenCalled()
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()
      expect(result).toEqual(family)
    })
  })
})
