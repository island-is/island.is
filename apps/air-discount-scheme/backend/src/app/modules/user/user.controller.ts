import { Controller, Param, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GetUserByDiscountCodeParams } from './user.validator'
import { UserService } from './user.service'
import { User } from './user.model'
import { DiscountService } from '../discount'

@ApiTags('Users')
@Controller('api/public')
export class PublicUserController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly userService: UserService,
  ) {}

  @Get('discounts/:discountCode/user')
  @ApiOkResponse({ type: User })
  async get(@Param() params: GetUserByDiscountCodeParams): Promise<User> {
    const nationalId = await this.discountService.validateDiscount(
      params.discountCode,
    )
    return this.userService.getUserInfoByNationalId(nationalId)
  }
}
