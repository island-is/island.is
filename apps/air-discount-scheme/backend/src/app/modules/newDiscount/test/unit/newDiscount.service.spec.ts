import { Test } from '@nestjs/testing'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import {
  NewDiscountService,
} from '../../newDiscount.service'
import { createTestUser } from '../../../../../../test/createTestUser'
import { getModelToken } from '@nestjs/sequelize'
import {
  NewDiscount,
  DiscountedFlight,
  DiscountedFlightLeg,
  AirDiscount,
} from '../../newDiscount.model'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  NationalRegistryService,
} from '../../../nationalRegistry'
import { UserService } from '../../../user/user.service'
import { FlightService } from '../../../flight'

function getAuthUser(nationalId: string): AuthUser {
  return {
    nationalId,
    authorization: '',
    client: '',
    scope: [AirDiscountSchemeScope.default],
  }
}

describe('DiscountService', () => {
  let newDiscountService: NewDiscountService
  let nationalRegistryService: NationalRegistryService
  let discountModel: NewDiscount

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NewDiscountService,
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
          provide: getModelToken(NewDiscount),
          useClass: jest.fn(() => ({
            findOne: () => ({}),
            update: () => ({}),
            create: () => ({}),
          })),
        },
        {
          provide: getModelToken(AirDiscount),
          useClass: jest.fn(() => ({
            update: () => ({}),
            create: () => ({}),
          })),
        },

        {
          provide: getModelToken(DiscountedFlight),
          useClass: jest.fn(() => ({
            update: () => ({}),
            create: () => ({}),
          })),
        },

        {
          provide: getModelToken(DiscountedFlightLeg),
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

    newDiscountService = moduleRef.get<NewDiscountService>(NewDiscountService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
    discountModel = moduleRef.get<NewDiscount>(getModelToken(NewDiscount))
  })

  describe('createFlightLegs', () => {
    it('should return one flight leg if returning flight is false', () => {
      const result = newDiscountService.createFlightLegs('GRY', 'RKV', false)
      expect(result).toEqual([
        {
          origin: 'GRY',
          destination: 'RKV',
        },
      ])
      expect(result.length).toBe(1)
    })

    it('should return two flight legs if returning flight is true', () => {
      const result = newDiscountService.createFlightLegs('GRY', 'RKV', true)
      expect(result).toEqual([
        {
          origin: 'GRY',
          destination: 'RKV',
        },
        {
          origin: 'RKV',
          destination: 'GRY',
        },
      ])
      expect(result.length).toBe(2)
    })
  })

  describe('generateAirDiscountCode', () => {
    it('should return an object with a non connection discount code and explicit true', () => {
      const result = newDiscountService.generateAirDiscountCode(
        false,
        () => 'ABCDEFG',
        '12-12-12',
        true,
      )
      expect(result).toEqual({
        code: 'ABCDEFG',
        validUntil: '12-12-12',
        active: true,
        explicit: true,
        isConnectionCode: false,
      })
    })
    it('should return an object with a connection discount code and explicit true', () => {
      const result = newDiscountService.generateAirDiscountCode(
        true,
        () => 'ABCDEFG',
        '12-12-12',
        true,
      )
      expect(result).toEqual({
        code: 'ABCDEFG',
        validUntil: '12-12-12',
        active: true,
        explicit: true,
        isConnectionCode: true,
      })
    })
    it('should return an object with a non connection discount code and explicit false', () => {
      const result = newDiscountService.generateAirDiscountCode(
        false,
        () => 'ABCDEFG',
        '12-12-12',
      )
      expect(result).toEqual({
        code: 'ABCDEFG',
        validUntil: '12-12-12',
        active: true,
        explicit: false,
        isConnectionCode: false,
      })
    })
    it('should return an object with a connection discount code and explicit false', () => {
      const result = newDiscountService.generateAirDiscountCode(
        true,
        () => 'ABCDEFG',
        '12-12-12',
      )
      expect(result).toEqual({
        code: 'ABCDEFG',
        validUntil: '12-12-12',
        active: true,
        explicit: false,
        isConnectionCode: true,
      })
    })
  })

  describe('getDiscountFlightsFromCreateDiscountParams', () => {
    it('should return an array of one flight if origin is Reykjavik and destination is Akureyri', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'RKV',
          'AEY',
          false,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'RKV',
              destination: 'AEY',
            },
          ],
        },
      ])
    })

    it('should return an array of one flight if origin is Akureyri and destination is Reykjavik', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'AEY',
          'RKV',
          false,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'RKV',
            },
          ],
        },
      ])
    })
    it('should return an array of one flight with two flightlegs if origin is Reykjavik and destination is Akureyri and returning flight is true', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'RKV',
          'AEY',
          true,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'RKV',
              destination: 'AEY',
            },
            {
              origin: 'AEY',
              destination: 'RKV',
            },
          ],
        },
      ])
    })
    it('should return an array of one flight with two flightlegs if origin is Akureyri and destination is Reykjavik and returning flight is true', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'AEY',
          'RKV',
          true,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'RKV',
            },
            {
              origin: 'RKV',
              destination: 'AEY',
            },
          ],
        },
      ])
    })
    it('should return an array of two flights, with one flightleg each, if origin is Vopnafjordur and destination is Reykjavik and not returning flight', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'VPN',
          'RKV',
          false,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: true,
          flightLegs: [
            {
              origin: 'VPN',
              destination: 'AEY',
            },
          ],
        },
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'RKV',
            },
          ],
        },
      ])
    })
    it('should return an array of two flights, with one flightleg each, if origin is Reykjavik and destination is Vopnafjordur and not returning flight', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'RKV',
          'VPN',
          false,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'RKV',
              destination: 'AEY',
            },
          ],
        },
        {
          isConnectionFlight: true,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'VPN',
            },
          ],
        },
      ])
    })
    it('should return an empty array if Reykjavik is not in origin, nor destination', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'AEY',
          'VPN',
          false,
        )
      expect(result).toEqual([])
    })
    it('should return an array with one flight and if Reykjavik is not in origin, nor destination and explicit is true', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'AEY',
          'VPN',
          false,
          true,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'VPN',
            },
          ],
        },
      ])
    })

    it('should return an array of two flights, with two flightlegs each, if origin is Reykjavik and destination is Vopnafjordur and returning flight is true', () => {
      const result =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'RKV',
          'VPN',
          true,
        )
      expect(result).toEqual([
        {
          isConnectionFlight: false,
          flightLegs: [
            {
              origin: 'RKV',
              destination: 'AEY',
            },
            {
              origin: 'AEY',
              destination: 'RKV',
            },
          ],
        },
        {
          isConnectionFlight: true,
          flightLegs: [
            {
              origin: 'AEY',
              destination: 'VPN',
            },
            {
              origin: 'VPN',
              destination: 'AEY',
            },
          ],
        },
      ])
    })
  })

  describe('createDiscountFlights', () => {
    it('should create a discount for flights', async () => {
      const flights =
        newDiscountService.getDiscountFlightsFromCreateDiscountParams(
          'RKV',
          'VPN',
          true,
        )

      const results = await newDiscountService.createDiscountFlights(flights)
      results.forEach((result) => {
        expect(result).toHaveProperty('discount')
      })
      expect(results.length).toBe(flights.length)
    })
  })

  describe('createDiscountCode', () => {
    it('should create a discount and cache it', async () => {
      const nationalId = '1234567890'
      const createCodeSpyu = jest.spyOn(discountModel as any, 'create')

      await newDiscountService.createNewDiscountCode(
        createTestUser(),
        nationalId,
        'GRY',
        'RKV',
        true,
      )
      expect(createCodeSpyu).toHaveBeenCalledTimes(1)
    })
  })

  describe('createExplicitDiscountCode', () => {
    it('should call create function on discount model', async () => {
      const employeeId = '1010303019'
      const customerId = '1010302399'
      const createCodeSpyu = jest.spyOn(discountModel as any, 'create')

      await newDiscountService.createNewExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        'GRY',
        'RKV',
        true,
      )
      expect(createCodeSpyu).toHaveBeenCalledTimes(1)
    })

    it('should not create a discount if user not found', async () => {
      const employeeId = '1010303019'
      const customerId = '1010305499'
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))
      const createCodeSpyu = jest.spyOn(discountModel as any, 'create')

      await newDiscountService.createNewExplicitDiscountCode(
        getAuthUser(employeeId),
        customerId,
        'GRY',
        'RKV',
        true,
      )
      expect(createCodeSpyu).toHaveBeenCalledTimes(0)
    })
  })
  describe('getDiscountCodeForUser', () => {
    it('should return existingDiscount if discount and user is found', async () => {
      const customerId = '0101302399'
      jest.spyOn(discountModel as any, 'findOne').mockImplementation(() =>
        Promise.resolve({
          nationalId: customerId,
          active: true,
        }),
      )
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(createTestUser()))

      const result = await newDiscountService.getDiscountCodeForUser(
        getAuthUser(customerId),
        customerId,
      )
      expect(result?.user.nationalId).toBe(customerId)
      expect(result?.nationalId).toBe(customerId)
    })

    it('should return null if user is not found', async () => {
      const customerId = '0101302399'
      jest.spyOn(discountModel as any, 'findOne').mockImplementation(() =>
        Promise.resolve({
          nationalId: customerId,
          active: true,
        }),
      )
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await newDiscountService.getDiscountCodeForUser(
        getAuthUser(customerId),
        customerId,
      )
      expect(result).toBe(null)
    })
    it('should return null if discount is not found', async () => {
      const customerId = '0101302399'
      jest
        .spyOn(discountModel as any, 'findOne')
        .mockImplementation(() => Promise.resolve(null))
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(createTestUser()))

      const result = await newDiscountService.getDiscountCodeForUser(
        getAuthUser(customerId),
        customerId,
      )
      expect(result).toBe(null)
    })
  })
  describe('getDiscountCodeByCode', () => {
    it('should return existingDiscount if discount is found and user', async () => {
      const customerId = '0101302399'
      const code = 'ABCDEFG'
      jest.spyOn(discountModel as any, 'findOne').mockImplementation(() =>
        Promise.resolve({
          nationalId: customerId,
          active: true,
          discountedFlights: [
            {
              discount: {
                code,
              },
            },
            {
              discount: {
                code: 'HIJKLMN',
              },
            },
          ],
        }),
      )
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(createTestUser()))

      const result = await newDiscountService.getDiscountByCode(
        getAuthUser(customerId),
        code,
      )
      expect(result?.user.nationalId).toBe(customerId)
      expect(result?.nationalId).toBe(customerId)
      expect(
        result?.discountedFlights.find((f) => f.discount.code === code),
      ).toStrictEqual({ discount: { code } })
    })

    it('should return discount without user if user is not found', async () => {
      const customerId = '0101304399'
      const code = 'ABCDEFG'
      jest.spyOn(discountModel as any, 'findOne').mockImplementation(() =>
        Promise.resolve({
          nationalId: customerId,
          active: true,
          discountedFlights: [
            {
              discount: {
                code,
              },
            },
            {
              discount: {
                code: 'HIJKLMN',
              },
            },
          ],
        }),
      )
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await newDiscountService.getDiscountByCode(
        getAuthUser(customerId),
        code,
      )
      expect(result?.user).toBe(undefined)
      expect(result?.nationalId).toBe(customerId)
      expect(
        result?.discountedFlights.find((f) => f.discount.code === code),
      ).toStrictEqual({ discount: { code } })
    })
    it('should return null if discount is not found', async () => {
      const customerId = '0101302399'
      const code = 'ABCDEFG'
      jest
        .spyOn(discountModel as any, 'findOne')
        .mockImplementation(() => Promise.resolve(null))
      jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(createTestUser()))

      const result = await newDiscountService.getDiscountByCode(
        getAuthUser(customerId),
        code,
      )
      expect(result).toBe(null)
    })
  })
})
