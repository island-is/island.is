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

import { GetUserByDiscountCodeParams, GetUserRelationsParams } from './dto'
import { UserService } from './user.service'
import { AirlineUser, User } from './user.model'
import { DiscountService } from '../discount'
import { FlightService } from '../flight'
import { AuthGuard } from '../common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

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
  @ApiOkResponse({ type: AirlineUser })
  async getUserByDiscountCode(
    @Param() params: GetUserByDiscountCodeParams,
  ): Promise<AirlineUser> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )
    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    const user = await this.userService.getAirlineUserInfoByNationalId(
      discount.nationalId,
    )
    if (!user) {
      throw new NotFoundException(`User<${discount.nationalId}> not found`)
    }
    return user
  }
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
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
    @CurrentUser() authUser: AuthUser,
  ): Promise<User[]> {
    if (params.nationalId !== authUser.nationalId) {
      throw new BadRequestException(
        '[/relations] Request parameters do not correspond with user authentication.',
      )
    }
    const relations = [
      authUser.nationalId,
      ...(await this.userService.getRelations(authUser)),
    ]

    const userAndRelatives = await this.userService.getMultipleUsersByNationalIdArray(
      relations,
      authUser,
    )

    return userAndRelatives
  }
}
