import { Controller, Param, Get, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger'

import {
  GetUserByDiscountCodeParams,
  GetUserRelationsParams,
} from './user.validator'
import { UserService } from './user.service'
import { User } from './user.model'
import { DiscountService } from '../discount'
import { AuthGuard } from '../common'

@ApiTags('Users')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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

@Controller('api/private')
export class PrivateUserController {
  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
  getUserRelations(@Param() params: GetUserRelationsParams): User[] {
    // TODO: implement from thjodskra
    return [{ nationalId: params.nationalId, name: 'Darri Steinn Konráðsson' }]
  }
}
