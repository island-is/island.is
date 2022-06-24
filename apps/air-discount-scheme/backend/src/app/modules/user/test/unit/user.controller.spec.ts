import { Test } from '@nestjs/testing'

import { AirlineUser } from '../../user.model'
import { UserService } from '../../user.service'
import { DiscountService, Discount } from '../../../discount'

const airlineUser: AirlineUser = {
  nationalId: '1326487905',
  firstName: 'Jón',
  gender: 'kk',
  lastName: 'Jónsson',
  middleName: 'Gunnar',
  fund: {
    credit: 0,
    used: 0,
    total: 4,
  },
}

// AIRTODO: go through the controller and determine if tests needed
/*
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
            getAirlineUserInfoByNationalId: () => ({}),
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

  
})

*/
