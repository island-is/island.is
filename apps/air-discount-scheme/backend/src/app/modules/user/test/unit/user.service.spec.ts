import { createNationalId } from '@island.is/testing/fixtures'
import { Cache as CacheManager } from 'cache-manager'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { User } from '../../user.model'
import { UserService } from '../../user.service'
import { FlightService } from '../../../flight'
import { NationalRegistryService } from '../../../nationalRegistry'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { createTestUser } from '../../../../../../test/createTestUser'

function getAuthUser(nationalId: string): AuthUser {
  return {
    nationalId,
    authorization: '',
    client: '',
    scope: [AirDiscountSchemeScope.default],
  }
}

describe('UserService', () => {
  let userService: UserService
  let flightService: FlightService
  let nationalRegistryService: NationalRegistryService
  let cacheManager: CacheManager

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countThisYearsFlightLegsByNationalId: () => 0,
            countThisYearsConnectedFlightsByNationalId: () => 0,
            isADSPostalCode: (postalcode: number) => postalcode > 199,
          })),
        },
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

    userService = moduleRef.get<UserService>(UserService)
    flightService = moduleRef.get<FlightService>(FlightService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    cacheManager = moduleRef.get<CacheManager>(CACHE_MANAGER)
  })

  describe('getUserInfoByNationalId', () => {
    it('should return user with correct postal code with credit', async () => {
      const user = createTestUser()
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = true

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(isADSPostalCodeSpy).toHaveBeenCalledWith(user.postalcode)
      expect(result).toEqual(user)
    })

    it('should return credit for a child who lives outside of the ADS region IFF any custodian lives in the ADS region', async () => {
      const user = createTestUser(
        100,
        {
          credit: 6,
          total: 6,
          used: 0,
        },
        createNationalId('residentChild'),
      )
      const custodians: User[] = [
        createTestUser(100),
        createTestUser(100),
        createTestUser(600),
        createTestUser(100),
      ]
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ custodians }))
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toBeCalledTimes(1)

      expect(result).toEqual(user)
    })

    it('should return credit for a child with postalcode null IFF any custodian lives in the ADS region', async () => {
      const user = createTestUser(
        100,
        {
          credit: 6,
          total: 6,
          used: 0,
        },
        createNationalId('residentChild'),
      )

      // This has been known to happen from the National Registry
      user.postalcode = null as unknown as number

      const custodians: User[] = [
        createTestUser(100),
        createTestUser(100),
        createTestUser(600),
        createTestUser(100),
      ]
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ custodians }))
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toBeCalledTimes(1)

      expect(result).toEqual(user)
    })

    it('should return no credit for a child with postalcode null if postalcode of custodians are also null', async () => {
      const user = createTestUser(
        100,
        {
          credit: 6,
          total: 6,
          used: 0,
        },
        createNationalId('residentChild'),
      )

      // This has been known to happen from the National Registry
      user.postalcode = null as unknown as number

      const custodians: User[] = [
        createTestUser(100),
        createTestUser(100),
        createTestUser(600),
        createTestUser(100),
      ]

      for (const custodian of custodians) {
        // This has been known to happen from the National Registry
        custodian.postalcode = null as unknown as number
      }
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ custodians }))
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toBeCalledTimes(1)

      expect(result).toEqual({
        ...user,
        fund: {
          ...user.fund,
          credit: 0,
        },
      })
    })

    it('should not return credit for a child living outside of the ADS region whose custodians are all outside the region too', async () => {
      const user = createTestUser(
        100,
        {
          credit: 6,
          total: 6,
          used: 0,
        },
        createNationalId('residentChild'),
      )
      const custodians: User[] = [
        createTestUser(100),
        createTestUser(100),
        createTestUser(150),
        createTestUser(100),
      ]
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ custodians }))
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toBeCalledTimes(1)

      expect(result).toEqual({
        ...user,
        fund: {
          ...user.fund,
          credit: 0,
        },
      })
    })

    it('should not return credit for a child living outside of the ADS who has no custodians', async () => {
      const user = createTestUser(
        100,
        {
          credit: 6,
          total: 6,
          used: 0,
        },
        createNationalId('residentChild'),
      )
      const custodians: User[] = []
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }

      const cacheManagerGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockImplementation(() => Promise.resolve({ custodians }))
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(cacheManagerGetSpy).toBeCalledTimes(1)

      expect(result).toEqual({
        ...user,
        fund: {
          ...user.fund,
          credit: 0,
        },
      })
    })

    it('should return user with incorrect postal code with no credit', async () => {
      const user = createTestUser()
      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = false

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(isADSPostalCodeSpy).toHaveBeenCalledWith(user.postalcode)
      expect(result).toEqual({
        ...user,
        fund: {
          ...user.fund,
          credit: 0,
        },
      })
    })

    it('should handle user with postal code null and return no credit', async () => {
      const user = createTestUser()

      // This has been known to happen from the National Registry
      user.postalcode = null as unknown as number

      const auth = getAuthUser(user.nationalId)
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = false

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countThisYearsFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countThisYearsFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(countThisYearsFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(isADSPostalCodeSpy).toHaveBeenCalledWith(user.postalcode)
      expect(result).toEqual({
        ...user,
        fund: {
          ...user.fund,
          credit: 0,
        },
      })
    })

    it('should return null if nationalRegistryService does not return user', async () => {
      const user = createTestUser()
      const auth = getAuthUser(user.nationalId)
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await userService.getUserInfoByNationalId(
        user.nationalId,
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId, auth)
      expect(result).toBe(null)
    })
  })
})
