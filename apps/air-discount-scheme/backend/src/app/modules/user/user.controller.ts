import {
  Controller,
  Param,
  Get,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
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
import { FlightService } from '../flight'
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
  async getUserByDiscountCode(
    @Param() params: GetUserByDiscountCodeParams,
  ): Promise<User> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )
    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    const user = await this.userService.getUserInfoByNationalId(
      discount.nationalId,
    )
    if (!user) {
      throw new NotFoundException(`User<${discount.nationalId}> not found`)
    }
    return user
  }
}

@Controller('api/private')
export class PrivateUserController {
  constructor(
    private readonly flightService: FlightService,
    private readonly userService: UserService,
  ) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
  async getUserRelations(
    @Param() params: GetUserRelationsParams,
  ): Promise<User[]> {
    const relations = await this.userService.getRelations(params.nationalId)
    return Promise.all([
      this.userService.getUserInfoByNationalId(params.nationalId),
      ...relations.map((nationalId) =>
        this.userService.getUserInfoByNationalId(nationalId),
      ),
    ])
  }
}
