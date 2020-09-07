import {
  Controller,
  Param,
  Post,
  Get,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'

import { Discount } from './discount.model'
import {
  CreateDiscountCodeParams,
  GetCurrentDiscountByNationalIdParams,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { NationalRegistryService } from '../nationalRegistry'
import { AuthGuard } from '../common'

@ApiTags('Discounts')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  // TODO THIS SHOULD NOT GO TO PROD
  // THIS IS ONLY FOR AIRLINES TO TEST THE API
  @Post('users/:nationalId/discounts')
  @ApiOkResponse({ type: Discount })
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
