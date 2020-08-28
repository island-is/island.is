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
  async get(@Param() params: GetUserByDiscountCodeParams): Promise<User> {
    const nationalId = await this.discountService.validateDiscount(
      params.discountCode,
    )
    return this.userService.getUserInfoByNationalId(nationalId)
  }
}

@Controller('api/private')
export class PrivateUserController {
  constructor(private readonly flightService: FlightService) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
  async getUserRelations(
    @Param() params: GetUserRelationsParams,
  ): Promise<User[]> {
    // TODO: implement from thjodskra
    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsByNationalId(params.nationalId)
    return [
      {
        nationalId: params.nationalId,
        firstName: 'Darri',
        middleName: 'Steinn',
        lastName: 'Konráðsson',
        gender: 'm',
        flightLegsLeft,
      },
    ]
  }
}
