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
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger'

import IslandisLogin, { VerifyResult } from 'islandis-login'
import { Flight, FlightLeg } from './flight.model'
import { FlightService, REYKJAVIK_FLIGHT_CODES } from './flight.service'
import {
  FlightViewModel,
  CreateFlightBody,
  GetFlightParams,
  GetFlightLegsBody,
  ConfirmInvoiceBody,
  CreateFlightParams,
  GetUserFlightsParams,
  DeleteFlightParams,
  DeleteFlightLegParams,
  CheckFlightParams,
  CheckFlightBody,
  CheckFlightViewModel,
} from './dto'
import { DiscountService } from '../discount'
import { AuthGuard } from '../common'
import { NationalRegistryService } from '../nationalRegistry'
import { HttpRequest } from '../../app.types'
import { Not } from 'sequelize-typescript'

@ApiTags('Flights')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicFlightController {
  constructor(
    private readonly flightService: FlightService,
    @Inject(forwardRef(() => DiscountService))
    private readonly discountService: DiscountService,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  @Get('discounts/:discountCode/checkFlightStatus')
  @ApiResponse({
    status: 200,
    description: 'Input flight is eligible for discount as a connection flight',
  })
  @ApiResponse({
    status: 400,
    description:
      'User does not have any flights that may correspond to connection flight',
  })
  @ApiResponse({ type: CheckFlightViewModel })
  async checkFlightStatus(
    @Param() params: CheckFlightParams,
    @Body() flight: CheckFlightBody,
    @Req() request: HttpRequest,
  ): Promise<CheckFlightViewModel> {
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

    const incomingFlight = {
      ...flight,
      date: new Date(Date.parse(flight.date.toString())),
    }

    const flightOk = await this.flightService.isFlightLegConnectingFlight(
      discount.nationalId,
      incomingFlight as FlightLeg,
    )

    if (flightOk) {
      return new CheckFlightViewModel('200')
    }

    throw new BadRequestException(
      `User does not have any flights that may correspond to a connection flight`,
    )
  }

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

    if (
      new Date(flight.bookingDate).getFullYear().toString() !==
      new Date(Date.now()).getFullYear().toString()
    ) {
      throw new BadRequestException(
        'Flight cannot be booked outside the current year',
      )
    }

    const meetsADSRequirements = this.flightService.isADSPostalCode(
      user.postalcode,
    )
    if (!meetsADSRequirements) {
      throw new ForbiddenException('User postalcode does not meet conditions')
    }

    const {
      unused: flightLegsLeft,
    } = await this.flightService.countThisYearsFlightLegsByNationalId(
      discount.nationalId,
    )
    if (flightLegsLeft < flight.flightLegs.length) {
      throw new ForbiddenException('Flight leg quota is exceeded')
    }

    let connectingFlight = false

    if (flight.flightLegs.length === 1) {
      const incomingLeg = {
        ...flight.flightLegs[0],
        date: new Date(Date.parse(flight.flightLegs[0].date.toString())),
      }

      if (
        !REYKJAVIK_FLIGHT_CODES.includes(incomingLeg.destination) &&
        !REYKJAVIK_FLIGHT_CODES.includes(incomingLeg.origin)
      ) {
        const isConnectingFlight = await this.flightService.isFlightLegConnectingFlight(
          discount.nationalId,
          incomingLeg as FlightLeg, // must have date, destination and origin
        )
        if (!isConnectingFlight) {
          throw new ForbiddenException(
            'User does not meet the requirements for a connecting flight for this flight',
          )
        } else {
          connectingFlight = true
        }
      }
    }

    const newFlight = await this.flightService.create(
      flight,
      user,
      request.airline,
      connectingFlight,
    )
    await this.discountService.useDiscount(
      params.discountCode,
      discount.nationalId,
      newFlight.id,
      connectingFlight,
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

  @Post('flightLegs/confirmInvoice')
  @ApiExcludeEndpoint()
  async confirmInvoice(
    @Body() body: ConfirmInvoiceBody | {},
  ): Promise<FlightLeg[]> {
    let flightLegs = await this.flightService.findAllLegsByFilter(body)
    flightLegs = await this.flightService.finalizeCreditsAndDebits(flightLegs)
    return flightLegs
  }

  @Get('users/:nationalId/flights')
  @ApiExcludeEndpoint()
  getUserFlights(@Param() params: GetUserFlightsParams): Promise<Flight[]> {
    return this.flightService.findThisYearsFlightsByNationalId(
      params.nationalId,
    )
  }
}
