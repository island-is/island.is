import { Test } from '@nestjs/testing'

import { DiscountService } from '../../discount.service'
import { Discount } from '../../discount.model'
import { PrivateDiscountController } from '../../discount.controller'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'
import { FlightService } from '../../../flight'
import { Fund, User } from '@island.is/air-discount-scheme/types'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

function createTestUser(
  postalCode: number = 600,
  fund: Fund = {
    credit: 6,
    total: 6,
    used: 0,
  },
  nationalId: string = '0101302399',
): User {
  return {
    postalcode: postalCode,
    address: 'Testvík 2',
    city: 'Prufuborg',
    firstName: 'Prófi',
    fund: fund,
    gender: 'kk',
    lastName: 'Prófsson',
    middleName: 'Júnitt',
    nationalId: nationalId,
  }
}

const auth: AuthUser = {
  nationalId: '1326487905',
  scope: ['@vegagerdin.is/air-discount-scheme-scope'],
  authorization: '',
  client: '',
}

describe('DiscountController', () => {
  let privateDiscountController: PrivateDiscountController
  let discountService: DiscountService
  let nationalRegistryService: NationalRegistryService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrivateDiscountController,
        {
          provide: DiscountService,
          useClass: jest.fn(() => ({
            getDiscountByNationalId: () => ({}),
            createDiscountCode: () => ({}),
          })),
        },
        {
          provide: NationalRegistryService,
          useClass: jest.fn(() => ({
            getUser: () => ({}),
          })),
        },
        {
          provide: FlightService,
          useClass: jest.fn(() => ({
            countThisYearsConnectedFlightsByNationalId: () => 0,
            findThisYearsConnectableFlightsByNationalId: () => 0,
          })),
        },
      ],
    }).compile()

    privateDiscountController = moduleRef.get<PrivateDiscountController>(
      PrivateDiscountController,
    )
    discountService = moduleRef.get<DiscountService>(DiscountService)
    nationalRegistryService = moduleRef.get<NationalRegistryService>(
      NationalRegistryService,
    )
  })

  describe('getCurrentDiscountByNationalId', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const discount = new Discount(
        createTestUser(),
        discountCode,
        [],
        nationalId,
        0,
      )
      const getDiscountByNationalIdSpy = jest
        .spyOn(discountService, 'getDiscountByNationalId')
        .mockImplementation(() => Promise.resolve(discount))

      const result = await privateDiscountController.getCurrentDiscountByNationalId(
        { nationalId },
      )

      expect(getDiscountByNationalIdSpy).toHaveBeenCalledWith(nationalId)
      expect(result).toEqual(discount)
    })
  })

  describe('createDiscountCode', () => {
    it('should return discount', async () => {
      const nationalId = '1234567890'
      const discountCode = 'ABCDEFG'
      const discount = new Discount(
        createTestUser(),
        discountCode,
        [],
        nationalId,
        0,
      )
      const user: NationalRegistryUser = {
        nationalId,
        firstName: 'Jón',
        gender: 'kk',
        lastName: 'Jónsson',
        middleName: 'Gunnar',
        address: 'Bessastaðir 1',
        postalcode: 225,
        city: 'Álftanes',
      }
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(user))
      const createDiscountCodeSpy = jest
        .spyOn(discountService, 'createDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))

      const result = await privateDiscountController.createDiscountCode(
        {
          nationalId,
        },
        auth,
      )

      expect(getUserSpy).toHaveBeenCalledWith(nationalId)
      expect(createDiscountCodeSpy).toHaveBeenCalledWith(nationalId, 0)
      expect(result).toEqual(discount)
    })

    it('should throw an error because user is not found', async () => {
      const nationalId = '1234567890'
      const getUserSpy = jest
        .spyOn(nationalRegistryService, 'getUser')
        .mockImplementation(() => Promise.resolve(null))
      const createDiscountCodeSpy = jest.spyOn(
        discountService,
        'createDiscountCode',
      )

      try {
        await privateDiscountController.createDiscountCode(
          {
            nationalId,
          },
          auth,
        )
        expect('This should not happen').toEqual('')
      } catch (e) {
        expect(getUserSpy).toHaveBeenCalledWith(nationalId)
        expect(createDiscountCodeSpy).not.toHaveBeenCalled()
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `User<${nationalId}> not found`,
        })
      }
    })
  })
})
