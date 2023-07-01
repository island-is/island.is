import {
  Controller,
  Param,
  Post,
  Get,
  NotFoundException,
  Inject,
  forwardRef,
  UseGuards,
  BadRequestException,
  Body,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Discount } from './discount.model'
import {
  CreateDiscountCodeParams,
  CreateExplicitDiscountCodeParams,
  GetCurrentDiscountByNationalIdParams,
} from './dto'
import { DiscountService } from './discount.service'
import { FlightService } from '../flight'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { UserService } from '../user/user.service'
import { AuthGuard } from '../common'
import { GetUserByDiscountCodeParams } from '../user/dto'
import { AirlineUser } from '../user/user.model'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

@ApiTags('Users')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicDiscountController {
  constructor(private readonly discountService: DiscountService) {}

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

    if (!discount.user) {
      throw new NotFoundException(`User<${discount.nationalId}> not found`)
    }

    // Constructor masks nationalId
    const airlineUser = new AirlineUser(discount.user, discount.user.fund)

    // TODO: remove once addressed externally
    if (airlineUser.gender === 'x') {
      airlineUser.gender = 'hvk'
    }
    return airlineUser
  }
}

@ApiTags('Users')
@Controller('api/private')
@Scopes(AirDiscountSchemeScope.default)
@UseGuards(IdsUserGuard, ScopesGuard)
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Get('users/:nationalId/discounts/current')
  @ApiOkResponse({ type: Discount })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  async getCurrentDiscountByNationalId(
    @Param() params: GetCurrentDiscountByNationalIdParams,
  ): Promise<Discount | null> {
    return this.discountService.getDiscountByNationalId(params.nationalId)
  }

  @Post('users/:nationalId/discounts')
  @ApiOkResponse({ type: Discount })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<Discount> {
    const user = await this.userService.getUserInfoByNationalId(
      params.nationalId,
      auth,
    )
    if (!user) {
      throw new NotFoundException(`User<${params.nationalId}> not found`)
    }

    const unConnectedFlights =
      await this.flightService.findThisYearsConnectableFlightsByNationalId(
        params.nationalId,
      )

    return this.discountService.createDiscountCode(
      user,
      params.nationalId,
      unConnectedFlights,
    )
  }
}

@ApiTags('Admin')
@Controller('api/private')
@Scopes(AirDiscountSchemeScope.admin)
@UseGuards(IdsUserGuard, ScopesGuard)
export class PrivateDiscountAdminController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

  @Post('users/createExplicitDiscountCode')
  @ApiOkResponse({ type: Discount })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @Scopes(AirDiscountSchemeScope.admin)
  async createExplicitDiscountCode(
    @Body() body: CreateExplicitDiscountCodeParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<Discount> {
    const unConnectedFlights =
      await this.flightService.findThisYearsConnectableFlightsByNationalId(
        body.nationalId,
      )

    const discount = await this.discountService.createExplicitDiscountCode(
      auth,
      body.nationalId,
      body.postalcode,
      auth.nationalId,
      body.comment,
      body.numberOfDaysUntilExpiration,
      unConnectedFlights,
    )

    if (!discount) {
      throw new Error(`Could not create explicit discount`)
    }

    return discount
  }
}
