import {
  Get,
  HttpCode,
  Body,
  Controller,
  Param,
  Post,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger'

import { Flight } from './flight.model'
import { FlightService } from './flight.service'
import {
  GetFlightParams,
  CreateFlightParams,
  GetUserFlightsParams,
  DeleteFlightParams,
  DeleteFlightLegParams,
} from './flight.validator'
import { FlightLimitExceeded } from './flight.error'
import { FlightDto } from './dto/flight.dto'
import { DiscountService } from '../discount'
import { AuthGuard } from '../common'
import { NationalRegistryService } from '../nationalRegistry'

@ApiTags('Flights')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicFlightController {
  constructor(
    private readonly flightService: FlightService,
    private readonly discountService: DiscountService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Post('discounts/:discountCode/flights')
  @ApiCreatedResponse({ type: Flight })
  async create(
    @Param() params: CreateFlightParams,
    @Body() flight: FlightDto,
    @Req() request,
  ): Promise<Flight> {
    const nationalId = await this.discountService.validateDiscount(
      params.discountCode,
    )

    const user = await this.nationalRegistryService.getUser(nationalId)
    if (!user) {
      throw new NotFoundException(`User<${nationalId}> not found`)
    }
    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsByNationalId(nationalId)
    if (flightLegsLeft < flight.flightLegs.length) {
      throw new FlightLimitExceeded()
    }
    await this.discountService.useDiscount(params.discountCode, nationalId)
    return this.flightService.create(flight, nationalId, request.airline)
  }

  @Get('flights/:flightId')
  @ApiOkResponse({ type: Flight })
  async getFlightById(
    @Param() params: GetFlightParams,
    @Req() request,
  ): Promise<Flight> {
    return this.flightService.findOne(params.flightId, request.airline)
  }

  @Delete('flights/:flightId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(
    @Param() params: DeleteFlightParams,
    @Req() request,
  ): Promise<void> {
    const flight = await this.flightService.findOne(
      params.flightId,
      request.airline,
    )
    await this.flightService.delete(flight)
  }

  @Delete('flights/:flightId/flightLegs/:flightLegId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async deleteFlightLeg(
    @Param() params: DeleteFlightLegParams,
    @Req() request,
  ): Promise<void> {
    const flight = await this.flightService.findOne(
      params.flightId,
      request.airline,
    )
    await this.flightService.deleteFlightLeg(flight, params.flightLegId)
  }
}

@Controller('api/private')
export class PrivateFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('flights')
  @ApiExcludeEndpoint()
  get(): Promise<Flight[]> {
    return this.flightService.findAll()
  }

  @Get('users/:nationalId/flights')
  @ApiExcludeEndpoint()
  getUserFlights(@Param() params: GetUserFlightsParams): Promise<Flight[]> {
    return this.flightService.findAllByNationalId(params.nationalId)
  }
}
