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
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger'

import { Flight, FlightLeg } from './flight.model'
import { FlightService } from './flight.service'
import {
  FlightViewModel,
  CreateFlightBody,
  GetFlightParams,
  GetFlightLegsBody,
  CreateFlightParams,
  GetUserFlightsParams,
  DeleteFlightParams,
  DeleteFlightLegParams,
} from './dto'
import { DiscountService } from '../discount'
import { AuthGuard } from '../common'
import { NationalRegistryService } from '../nationalRegistry'
import { HttpRequest } from '../../app.types'

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
  @ApiCreatedResponse({ type: FlightViewModel })
  async create(
    @Param() params: CreateFlightParams,
    @Body() flight: CreateFlightBody,
    @Req() request: HttpRequest,
  ): Promise<FlightViewModel> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )
    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    const user = await this.nationalRegistryService.getUser(discount.nationalId)
    if (!user) {
      throw new NotFoundException(`User not found`)
    }

    const meetsADSRequirements = this.flightService.isADSPostalCode(
      user.postalcode,
    )
    if (!meetsADSRequirements) {
      throw new ForbiddenException('User postalcode does not meet conditions')
    }

    const {
      unused: flightLegsLeft,
    } = await this.flightService.countFlightLegsByNationalId(
      discount.nationalId,
    )
    if (flightLegsLeft < flight.flightLegs.length) {
      throw new ForbiddenException('Flight leg quota is exceeded')
    }
    const newFlight = await this.flightService.create(
      flight,
      user,
      request.airline,
    )
    await this.discountService.useDiscount(
      params.discountCode,
      discount.nationalId,
      newFlight.id,
    )
    return new FlightViewModel(newFlight)
  }

  @Get('flights/:flightId')
  @ApiOkResponse({ type: FlightViewModel })
  async getFlightById(
    @Param() params: GetFlightParams,
    @Req() request: HttpRequest,
  ): Promise<FlightViewModel> {
    const flight = await this.flightService.findOne(
      params.flightId,
      request.airline,
    )
    if (!flight) {
      throw new NotFoundException(`Flight<${params.flightId}> not found`)
    }
    return new FlightViewModel(flight)
  }

  @Delete('flights/:flightId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(
    @Param() params: DeleteFlightParams,
    @Req() request: HttpRequest,
  ): Promise<void> {
    const flight = await this.flightService.findOne(
      params.flightId,
      request.airline,
    )
    if (!flight) {
      throw new NotFoundException(`Flight<${params.flightId}> not found`)
    }
    await this.discountService.reactivateDiscount(flight.id)
    await this.flightService.delete(flight)
  }

  @Delete('flights/:flightId/flightLegs/:flightLegId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async deleteFlightLeg(
    @Param() params: DeleteFlightLegParams,
    @Req() request: HttpRequest,
  ): Promise<void> {
    const flight = await this.flightService.findOne(
      params.flightId,
      request.airline,
    )
    if (!flight) {
      throw new NotFoundException(`Flight<${params.flightId}> not found`)
    }

    const flightLeg = await flight.flightLegs.find(
      (flightLeg) => flightLeg.id === params.flightLegId,
    )
    if (!flightLeg) {
      throw new NotFoundException(
        `FlightLeg<${params.flightLegId}> not found for Flight<${flight.id}>`,
      )
    }
    await this.flightService.deleteFlightLeg(flightLeg)
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

  @Post('flightLegs')
  @ApiExcludeEndpoint()
  getFlightLegs(@Body() body: GetFlightLegsBody | {}): Promise<FlightLeg[]> {
    return this.flightService.findAllLegsByFilter(body)
  }

  @Get('users/:nationalId/flights')
  @ApiExcludeEndpoint()
  getUserFlights(@Param() params: GetUserFlightsParams): Promise<Flight[]> {
    return this.flightService.findAllByNationalId(params.nationalId)
  }
}
