import {
  Get,
  HttpCode,
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Inject,
  forwardRef,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger'

import { FlightLegFund } from '@island.is/air-discount-scheme/types'
import { Flight } from './flight.model'
import { FlightService } from './flight.service'
import {
  CreateFlightParams,
  DeleteFlightParams,
  GetFlightLegFundsParams,
} from './flight.validator'
import { FlightLimitExceeded } from './flight.error'
import { FlightDto } from './dto/flight.dto'
import { DiscountService } from '../discount'
import { AuthGuard } from '../common'

@ApiTags('Flights')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicFlightController {
  constructor(
    private readonly flightService: FlightService,
    @Inject(forwardRef(() => DiscountService))
    private readonly discountService: DiscountService,
  ) {}

  @Post('discounts/:discountCode/flights')
  @ApiCreatedResponse({ type: Flight })
  async create(
    @Param() params: CreateFlightParams,
    @Body() flight: FlightDto,
  ): Promise<Flight> {
    const nationalId = await this.discountService.validateDiscount(
      params.discountCode,
    )
    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsByNationalId(nationalId)
    if (flightLegsLeft < flight.flightLegs.length) {
      throw new FlightLimitExceeded()
    }
    await this.discountService.useDiscount(params.discountCode)
    return this.flightService.create(flight, nationalId)
  }

  @Delete('flights/:flightId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(@Param() params: DeleteFlightParams): Promise<void> {
    await this.flightService.delete(params.flightId)
  }
}

@Controller('api/private')
export class PrivateFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('users/:nationalId/flights/funds')
  @ApiExcludeEndpoint()
  getFlightLegFunds(
    @Param() params: GetFlightLegFundsParams,
  ): Promise<FlightLegFund> {
    return this.flightService.countFlightLegsByNationalId(params.nationalId)
  }

  @Get('flights')
  @ApiExcludeEndpoint()
  get(): Promise<Flight[]> {
    return this.flightService.findAll()
  }
}
