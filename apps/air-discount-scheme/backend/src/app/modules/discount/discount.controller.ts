import { Controller, Param, Post, Inject, forwardRef } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Discount } from './discount.model'
import { CreateDiscountCodeParams } from './discount.validator'
import { DiscountService } from './discount.service'
import { DiscountLimitExceeded } from './discount.error'
import { FlightService } from '../flight'

@ApiTags('Discounts')
@Controller('public')
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

@Controller('private')
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

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
