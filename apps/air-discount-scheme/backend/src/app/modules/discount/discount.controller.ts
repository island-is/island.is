import { Controller, Param, Post, Inject, forwardRef } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Discount } from './discount.model'
import { CreateDiscountCodeParams } from './discount.validator'
import { DiscountService } from './discount.service'
import { DiscountLimitExceeded } from './discount.error'

@ApiTags('Discounts')
@Controller('public')
export class PublicDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // TODO THIS SHOULD NOT GO TO PROD
  // THIS IS ONLY FOR AIRLINES TO TEST THE API
  @Post('users/:nationalId/discounts')
  @ApiOkResponse({ type: Discount })
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    return this.discountService.createDiscountCode(params.nationalId)
  }
}

@Controller('private')
export class PrivateDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('users/:nationalId/discounts')
  @ApiExcludeEndpoint()
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    // TODO check if there are any flight legs left
    return this.discountService.createDiscountCode(params.nationalId)
  }
}
