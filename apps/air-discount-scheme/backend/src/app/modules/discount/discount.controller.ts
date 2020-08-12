import { Controller, Param, Get, Query } from '@nestjs/common'
import { Discount } from './discount.model'
import {
  GetDiscountByCodeParams,
  GetDiscountByCodeQuery,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('discount')
@Controller('public/discount')
export class PublicDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get(':discountCode')
  @ApiOkResponse({ type: Discount })
  async get(
    @Param() params: GetDiscountByCodeParams,
    @Query() query: GetDiscountByCodeQuery,
  ): Promise<Discount> {
    return await this.discountService.findByDiscountCodeAndNationalId(
      params.discountCode,
      query.nationalId,
    )
  }
}

@Controller('private/discount')
export class PrivateDiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @ApiExcludeEndpoint()
  async get(): Promise<string> {
    // TODO setup private routes
    return 'Implement me'
  }
}
