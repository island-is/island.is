import { Controller, Param, Get, Post } from '@nestjs/common'
import { Discount } from './discount.model'
import {
  GetDiscountByCodeParams,
  CreateDiscountCodeParams,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('discount')
@Controller('public/users')
export class PublicDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get(':nationalId/discounts/:discountCode')
  @ApiOkResponse({ type: Discount })
  async get(@Param() params: GetDiscountByCodeParams): Promise<Discount> {
    return this.discountService.findByDiscountCodeAndNationalId(
      params.discountCode,
      params.nationalId,
    )
  }
}

@Controller('private/users')
export class PrivateDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post(':nationalId/discounts')
  @ApiExcludeEndpoint()
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    return this.discountService.createDiscountCode(params.nationalId)
  }
}
