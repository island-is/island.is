import {
  Controller,
  Param,
  Post,
  Get,
  Inject,
  forwardRef,
  UseGuards,
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
  GetDiscountByNationalIdParams,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { DiscountLimitExceeded } from './discount.error'
import { FlightService } from '../flight'
import { AuthGuard } from '../common'

@ApiTags('Discounts')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

  // TODO THIS SHOULD NOT GO TO PROD
  // THIS IS ONLY FOR AIRLINES TO TEST THE API
  @Post('users/:nationalId/discounts')
  @ApiOkResponse({ type: Discount })
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    const flightLegsLeft = await this.flightService.countFlightLegsLeftByNationalId(
      params.nationalId,
    )
    if (flightLegsLeft <= 0) {
      throw new DiscountLimitExceeded()
    }
    return this.discountService.createDiscountCode(params.nationalId)
  }
}

@Controller('api/private')
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

  @Get('users/:nationalId/discounts')
  @ApiOkResponse({ type: Discount })
  async getDiscountByNationalId(
    @Param() params: GetDiscountByNationalIdParams,
  ): Promise<Discount[]> {
    const discount = await this.discountService.getDiscountByNationalId(
      params.nationalId,
    )
    if (!discount) {
      return []
    }
    return [discount]
  }

  @Post('users/:nationalId/discounts')
  @ApiExcludeEndpoint()
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    const flightLegsLeft = await this.flightService.countFlightLegsLeftByNationalId(
      params.nationalId,
    )
    if (flightLegsLeft <= 0) {
      throw new DiscountLimitExceeded()
    }
    return this.discountService.createDiscountCode(params.nationalId)
  }
}
