import { Cache as CacheManager } from 'cache-manager'
import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { DiscountService, DISCOUNT_CODE_LENGTH } from '../../discount.service'
import { createTestUser } from '../../../../../../test/createTestUser'
import { getModelToken } from '@nestjs/sequelize'
import { ExplicitCode } from '../../discount.model'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'
import { UserService } from '../../../user/user.service'
import { FlightService } from '../../../flight'
import { Flight } from '../../../flight/flight.model'

function getAuthUser(nationalId: string): AuthUser {
  return {
    nationalId,
    authorization: '',
    client: '',
    scope: [AirDiscountSchemeScope.default],
  }
}

describe('DiscountService', () => {
  let discountService: DiscountService
  let nationalRegistryService: NationalRegistryService
  let cacheManager: CacheManager
  let explicitCodeModel: ExplicitCode

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DiscountService,
        UserService,
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
        {
          provide: CACHE_MANAGER,
          useClass: jest.fn(() => ({
            get: () => ({}),
            set: () => ({}),
            del: () => ({}),
            store: {
              ttl: () => ({}),
            },
          })),
        },
        {
          provide: getModelToken(ExplicitCode),
          useClass: jest.fn(() => ({
            update: () => ({}),
            create: () => ({}),
          })),
        },
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countThisYearsFlightLegsByNationalId: () => 0,
            isADSPostalCode: (code: number) => code > 300, // Very rough approximation
          })),
        },
      ],
    }).compile()

    discountService = moduleRef.get<DiscountService>(DiscountService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)
    explicitCodeModel = moduleRef.get<ExplicitCode>(getModelToken(ExplicitCode))
  })

  describe('createDiscountCode', () => {
    it('should create a discount and cache it', async () => {
      const nationalId = '1234567890'
      const cacheManagerSpy = jest.spyOn(cacheManager, 'set')

      const result = await discountService.createDiscountCode(
        createTestUser(),
        nationalId,
        [],
      )

      const uuid = cacheManagerSpy.mock.calls[0][0]
      expect(cacheManagerSpy.mock.calls[1][1]).toBe(uuid)
      expect(cacheManagerSpy.mock.calls[2][1]).toBe(uuid)

      expect(cacheManagerSpy).toHaveBeenCalledTimes(3)
      expect(result.discountCode).toHaveLength(DISCOUNT_CODE_LENGTH)
    })
  })

  describe('getDiscountByNationalId', () => {
    it('should return discountCode if it is cached', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const ttl = 86400
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ discountCode }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager.store, 'ttl')
        .mockImplementation(() => Promise.resolve(ttl * 1000))

      const result = await discountService.getDiscountByNationalId(nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(cacheManagerTtlSpy).toHaveBeenCalled()
      expect(result).toEqual({
        connectionDiscountCodes: [],
        discountCode,
        nationalId,
        expiresIn: ttl,
      })
    })

    it('should return null if it is not in cache', async () => {
      const nationalId = '1234567890'
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))

      const result = await discountService.getDiscountByNationalId(nationalId)

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })

  describe('getDiscountByDiscountCode', () => {
    it('should return discount if it is cached', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const ttl = 86400
      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ nationalId, discountCode }))
      const cacheManagerTtlSpy = jest
        .spyOn(cacheManager.store, 'ttl')
        .mockImplementation(() => Promise.resolve(ttl * 1000))

      const result = await discountService.getDiscountByDiscountCode(
        discountCode,
      )

      expect(cacheManagerGetSpy).toHaveBeenCalled()
      expect(cacheManagerTtlSpy).toHaveBeenCalled()
      expect(result).toEqual({
        connectionDiscountCodes: [],
        discountCode,
        nationalId,
        expiresIn: ttl,
      })
    })

    it('should return null if it is not in cache', async () => {
      const nationalId = '1234567890'
      const cacheManagerSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve(null))

      const result = await discountService.getDiscountByDiscountCode(nationalId)

      expect(cacheManagerSpy).toHaveBeenCalled()
      expect(result).toBe(null)
    })
  })

  describe('useDiscount', () => {
    it('should delete discount from cache', async () => {
      const flightId = '70de7be1-6b6d-4ec3-8063-be55e241d488'
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const cacheManagerDelSpy = jest.spyOn(cacheManager, 'del')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')
      jest
        .spyOn(cacheManager, 'get')
        .mockImplementation((cachekey: string | Record<string, unknown>) => {
          if (
            typeof cachekey === 'string' &&
            cachekey.includes('explicit_code_lookup')
          ) {
            return Promise.resolve(null)
          }
          return Promise.resolve({})
        })

      await discountService.useDiscount(
        discountCode,
        nationalId,
        flightId,
        false,
      )

      expect(cacheManagerDelSpy).toHaveBeenCalledTimes(1)
      expect(cacheManagerSetSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('createExplicitDiscount', () => {
    const employeeId = '1010303019'
    const customerId = '1010302399'
    const postalCode = 600
    const comment = 'This is a comment'
    const unConnectedFlights: Flight[] = []
    const numberOfDaysUntilExpiration = 1

    it('should create an explicit discount and cache it', async () => {
      const cacheManagerSpy = jest.spyOn(cacheManager, 'set')

      const result = await discountService.createExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        postalCode,
        employeeId,
        comment,
        numberOfDaysUntilExpiration,
        unConnectedFlights,
      )

      // We're simply tracking the `discount_id_${uuid}` access key to the cache
      // along with the explicit discount code as key
      const uuid = cacheManagerSpy.mock.calls[0][0]
      const discountCode = result?.discountCode
      expect(cacheManagerSpy.mock.calls[1][1]).toBe(uuid)
      expect(cacheManagerSpy.mock.calls[2][1]).toBe(uuid)
      expect(cacheManagerSpy.mock.calls[3][1]).toBe(discountCode)
      expect(cacheManagerSpy.mock.calls[4][1]).toBe(discountCode)

      // 3 calls in discount code creation
      // 2 calls for flagging discount as explicit in the cache
      expect(cacheManagerSpy).toHaveBeenCalledTimes(5)
      expect(discountCode).toHaveLength(DISCOUNT_CODE_LENGTH)
    })
    it('should create a record in the database', async () => {
      const explicitCodeSpy = jest.spyOn(explicitCodeModel as any, 'create')

      await discountService.createExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        postalCode,
        employeeId,
        comment,
        numberOfDaysUntilExpiration,
        unConnectedFlights,
      )
      expect(explicitCodeSpy).toBeCalledTimes(1)
    })
    it('should not create a discount for an invalid national id', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await discountService.createExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        postalCode,
        employeeId,
        comment,
        numberOfDaysUntilExpiration,
        unConnectedFlights,
      )
      expect(result).toBe(null)
    })

    it('should override postalcodes', async () => {
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation((): Promise<NationalRegistryUser> => {
          return Promise.resolve({
            address: '',
            city: '',
            firstName: '',
            gender: 'kk',
            lastName: '',
            middleName: '',
            nationalId: customerId,
            postalcode: 100, // This shall be overridden
          })
        })

      const result = await discountService.createExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        postalCode,
        employeeId,
        comment,
        numberOfDaysUntilExpiration,
        unConnectedFlights,
      )

      expect(result?.user?.postalcode).toBe(600)
    })
  })

  describe('reactivateDiscount', () => {
    it('should delete discount from cache', async () => {
      const flightId = '70de7be1-6b6d-4ec3-8063-be55e241d488'
      const cacheManagerDelSpy = jest.spyOn(cacheManager, 'del')
      const cacheManagerSetSpy = jest.spyOn(cacheManager, 'set')

      await discountService.reactivateDiscount(flightId)

      expect(cacheManagerDelSpy).toHaveBeenCalledTimes(1)
      expect(cacheManagerSetSpy).toHaveBeenCalledTimes(3)
    })
  })
})
