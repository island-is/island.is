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
  GetCurrentDiscountByNationalIdParams,
} from './discount.validator'
import { DiscountService } from './discount.service'
import { DiscountLimitExceeded } from './discount.error'
import { AuthGuard } from '../common'

@ApiTags('Discounts')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
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

@Controller('api/private')
export class PrivateDiscountController {
  constructor(private readonly discountService: DiscountService) {}

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
    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsByNationalId(params.nationalId)
    if (flightLegsLeft <= 0) {
      throw new DiscountLimitExceeded()
    }
    return this.discountService.createDiscountCode(params.nationalId)
  }
}
