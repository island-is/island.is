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
  NationalRegistryResponse,
  NationalRegistryUser,
} from '../../nationalRegistry.types'

const { nationalRegistry } = environment

const nationalRegistryResponse: NationalRegistryResponse = {
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

const axiosResponse: AxiosResponse = {
  data: [nationalRegistryResponse],
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
        .mockImplementation(() => of(axiosResponse))
      const cacheManagerSetSpy = jest
        .spyOn(cacheManager, 'set')
        .mockImplementation(() => Promise.resolve(null))

      const result = await nationalRegistryService.getUser(user.nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/general-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).toHaveBeenCalledWith(
        `${CACHE_KEY}_${user.nationalId}`,
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
        `${CACHE_KEY}_${user.nationalId}`,
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
            ...axiosResponse,
            data: [
              {
                ...axiosResponse.data[0],
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
        `${CACHE_KEY}_${user.nationalId}`,
      )
      expect(httpServiceSpy).toHaveBeenCalledWith(
        `${nationalRegistry.url}/general-lookup?ssn=${user.nationalId}`,
      )
      expect(cacheManagerSetSpy).not.toHaveBeenCalled()
      expect(result).toEqual(null)
    })
  })
})
