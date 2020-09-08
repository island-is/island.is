import { Test } from '@nestjs/testing'

import { AirlineUser, User } from '../../user.model'
import { UserService } from '../../user.service'
import { FlightService } from '../../../flight'
import { NationalRegistryService } from '../../../nationalRegistry'

const user: User = {
  nationalId: '1326487905',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  address: 'Bessastaðir 1',
  postalcode: 225,
  city: 'Álftanes',
  fund: {
    credit: 2,
    used: 2,
    total: 2,
  },
}

describe('UserService', () => {
  let userService: UserService
  let flightService: FlightService
  let nationalRegistryService: NationalRegistryService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countFlightLegsByNationalId: () => ({}),
            isADSPostalCode: () => ({}),
          })),
        },
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
      ],
    }).compile()

    userService = moduleRef.get<UserService>(UserService)
    flightService = moduleRef.get<FlightService>(FlightService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
  })

  describe('getAirlineUserInfoByNationalId', () => {
    it('should return user with masked nationalId', async () => {
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = true

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getAirlineUserInfoByNationalId(
        user.nationalId,
      )

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId)
      expect(countFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(isADSPostalCodeSpy).toHaveBeenCalledWith(user.postalcode)
      expect(result).toEqual({
        nationalId: '132648xxx5',
        firstName: user.firstName,
        gender: user.gender,
        lastName: user.lastName,
        middleName: user.middleName,
        fund: user.fund,
      })
    })
  })

  describe('getUserInfoByNationalId', () => {
    it('should return user with correct postal code with credit', async () => {
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = true

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getUserInfoByNationalId(user.nationalId)

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId)
      expect(countFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
        user.nationalId,
      )
      expect(isADSPostalCodeSpy).toHaveBeenCalledWith(user.postalcode)
      expect(result).toEqual(user)
    })

    it('should return user with incorrect postal code with no credit', async () => {
      const flightLegs = {
        unused: user.fund.credit,
        used: user.fund.used,
        total: user.fund.total,
      }
      const isValidPostalCode = false

      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const countFlightLegsByNationalIdSpy = jest
        .spyOn(flightService, 'countFlightLegsByNationalId')
        .mockImplementation(() => Promise.resolve(flightLegs))
      const isADSPostalCodeSpy = jest
        .spyOn(flightService, 'isADSPostalCode')
        .mockImplementation(() => isValidPostalCode)

      const result = await userService.getUserInfoByNationalId(user.nationalId)

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId)
      expect(countFlightLegsByNationalIdSpy).toHaveBeenCalledWith(
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
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))

      const result = await userService.getUserInfoByNationalId(user.nationalId)

      expect(getUserSpy).toHaveBeenCalledWith(user.nationalId)
      expect(result).toBe(null)
    })
  })
})
