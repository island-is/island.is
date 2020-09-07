import { Test } from '@nestjs/testing'

import { DiscountService } from '../../discount.service'
import { Discount } from '../../discount.model'
import { PrivateDiscountController } from '../../discount.controller'
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../../../nationalRegistry'

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
      const discount = new Discount(discountCode, nationalId, 0)
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
      const discount = new Discount(discountCode, nationalId, 0)
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

      const result = await privateDiscountController.createDiscountCode({
        nationalId,
      })

      expect(getUserSpy).toHaveBeenCalledWith(nationalId)
      expect(createDiscountCodeSpy).toHaveBeenCalledWith(nationalId)
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
        await privateDiscountController.createDiscountCode({
          nationalId,
        })
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
