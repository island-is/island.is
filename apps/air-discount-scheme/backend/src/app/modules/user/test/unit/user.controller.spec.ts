import { Test } from '@nestjs/testing'

import { User } from '../../user.model'
import { PublicUserController } from '../../user.controller'
import { UserService } from '../../user.service'
import { DiscountService, Discount } from '../../../discount'

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
    nationalId: '1326487905',
    credit: 0,
    used: 0,
    total: 4,
  },
}

describe('PublicUserController', () => {
  let publicUserController: PublicUserController
  let userService: UserService
  let discountService: DiscountService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PublicUserController],
      providers: [
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            getUserInfoByNationalId: () => ({}),
          })),
        },
        {
          provide: DiscountService,
          useClass: jest.fn(() => ({
            getDiscountByDiscountCode: () => ({}),
          })),
        },
      ],
    }).compile()

    userService = moduleRef.get<UserService>(UserService)
    discountService = moduleRef.get<DiscountService>(DiscountService)
    publicUserController = moduleRef.get<PublicUserController>(
      PublicUserController,
    )
  })

  describe('getUserByDiscountCode', () => {
    it('should return a user', async () => {
      const nationalId = '1326487905'
      const discountCode = 'ABCDEFG'
      const discount = new Discount(discountCode, nationalId, 0)

      const getDiscountByDiscountCodeSpy = jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))
      const getUserInfoByNationalIdSpy = jest
        .spyOn(userService, 'getUserInfoByNationalId')
        .mockImplementation(() => Promise.resolve(user))

      const result = await publicUserController.getUserByDiscountCode({
        discountCode,
      })

      expect(getDiscountByDiscountCodeSpy).toHaveBeenCalledWith(discountCode)
      expect(getUserInfoByNationalIdSpy).toHaveBeenCalledWith(nationalId)
      expect(result).toBe(user)
    })

    it('should return not found error when user does not exist', async () => {
      const nationalId = '1326487905'
      const discountCode = 'ABCDEFG'
      const discount = new Discount(discountCode, nationalId, 0)

      jest
        .spyOn(discountService, 'getDiscountByDiscountCode')
        .mockImplementation(() => Promise.resolve(discount))
      jest
        .spyOn(userService, 'getUserInfoByNationalId')
        .mockImplementation(() => Promise.resolve(null))

      try {
        await publicUserController.getUserByDiscountCode({ discountCode })
        expect('This should not happen').toEqual('')
      } catch (e) {
        expect(e.response).toEqual({
          statusCode: 404,
          error: 'Not Found',
          message: `User<${nationalId}> not found`,
        })
      }
    })
  })
})
