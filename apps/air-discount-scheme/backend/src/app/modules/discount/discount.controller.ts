import { Controller, Param, Post, Get, NotFoundException } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

import { Discount } from './discount.model'
import {
  CreateDiscountCodeParams,
  GetCurrentDiscountByNationalIdParams,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { NationalRegistryService } from '../nationalRegistry'

@Controller('api/private')
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Get('users/:nationalId/discounts/current')
  @ApiExcludeEndpoint()
  getCurrentDiscountByNationalId(
    @Param() params: GetCurrentDiscountByNationalIdParams,
  ): Promise<Discount> {
    return this.discountService.getDiscountByNationalId(params.nationalId)
  }

  @Post('users/:nationalId/discounts')
  @ApiExcludeEndpoint()
  async createDiscountCode(
    @Param() params: CreateDiscountCodeParams,
  ): Promise<Discount> {
    const user = await this.nationalRegistryService.getUser(params.nationalId)
    if (!user) {
      throw new NotFoundException(`User<${params.nationalId}> not found`)
    }

    return this.discountService.createDiscountCode(params.nationalId)
  }
}
