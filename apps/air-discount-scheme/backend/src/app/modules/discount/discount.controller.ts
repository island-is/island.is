import {
  Controller,
  Param,
  Post,
  Get,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

import { Discount } from './discount.model'
import {
  CreateDiscountCodeParams,
  GetCurrentDiscountByNationalIdParams,
} from './dto'
import { DiscountService } from './discount.service'
import { NationalRegistryService } from '../nationalRegistry'
import { FlightService } from '../flight'

@Controller('api/private')
export class PrivateDiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly nationalRegistryService: NationalRegistryService,
    @Inject(forwardRef(() => FlightService))
    private readonly flightService: FlightService,
  ) {}

  @Get('users/:nationalId/discounts/current')
  @ApiExcludeEndpoint()
  getCurrentDiscountByNationalId(
    @Param() params: GetCurrentDiscountByNationalIdParams,
  ): Promise<Discount | null> {
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

    const unConnectedFlights = await this.flightService.findThisYearsConnectableFlightsByNationalId(
      params.nationalId,
    )

    return this.discountService.createDiscountCode(
      params.nationalId,
      unConnectedFlights,
    )
  }
}
