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
  NotImplementedException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import {
  CreateDiscountCodeParams,
  CreateExplicitDiscountCodeParams,
  CreateNewDiscountCodeBody,
  GetCurrentDiscountByNationalIdParams,
  NewDiscountViewModel,
} from './dto'
import { NewDiscountService } from './newDiscount.service'
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
export class PublicNewDiscountController {
  constructor(private readonly discountService: NewDiscountService) {}

  @Get('newDiscounts/:discountCode/user')
  @ApiOkResponse({ type: AirlineUser })
  async getUserByDiscountCode(
    @Param() params: GetUserByDiscountCodeParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<AirlineUser> {
    const discount = await this.discountService.getDiscountByCode(
      auth,
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
export class PrivateNewDiscountController {
  constructor(
    private readonly discountService: NewDiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Get('users/:nationalId/newDiscounts/current')
  @ApiOkResponse({ type: NewDiscountViewModel })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  async getCurrentDiscountByNationalId(
    @Param() params: GetCurrentDiscountByNationalIdParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<NewDiscountViewModel | null> {
    const discount = await this.discountService.getDiscountCodeForUser(
      auth,
      params.nationalId,
    )
    if (!discount) {
      return null
    }
    return new NewDiscountViewModel(discount)
  }

  @Post('users/:nationalId/newDiscounts')
  @ApiOkResponse({ type: NewDiscountViewModel })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
    @Body() body: CreateNewDiscountCodeBody,
    @CurrentUser() auth: AuthUser,
  ): Promise<NewDiscountViewModel> {
    const user = await this.userService.getUserInfoByNationalId(
      params.nationalId,
      auth,
    )
    if (!user) {
      throw new NotFoundException(`User<${params.nationalId}> not found`)
    }

    const newDiscount = await this.discountService.createNewDiscountCode(
      user,
      params.nationalId,
      body.origin,
      body.destination,
      body.isRoundTrip,
    )
    if (!newDiscount) {
      throw new NotImplementedException(`Could not create discount`)
    }

    return new NewDiscountViewModel(newDiscount)
  }
}

@ApiTags('Admin')
@Controller('api/private')
@Scopes(AirDiscountSchemeScope.admin)
@UseGuards(IdsUserGuard, ScopesGuard)
export class PrivateNewDiscountAdminController {
  constructor(
    private readonly discountService: NewDiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

  @Post('users/createExplicitNewDiscountCode')
  @ApiOkResponse({ type: NewDiscountViewModel })
  @ApiBearerAuth()
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @Scopes(AirDiscountSchemeScope.admin)
  async createExplicitDiscountCode(
    @Body() body: CreateExplicitDiscountCodeParams,
    @CurrentUser() auth: AuthUser,
  ): Promise<NewDiscountViewModel> {
    const discount = await this.discountService.createNewExplicitDiscountCode(
      auth,
      body.nationalId,
      body.origin,
      body.destination,
      body.isRoundTrip,
    )
    if (!discount) {
      throw new NotImplementedException(`Could not create explicit discount`)
    }

    return new NewDiscountViewModel(discount)
  }
}
