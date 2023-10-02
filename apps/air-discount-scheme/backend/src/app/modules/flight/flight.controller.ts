import { Cache as CacheManager } from 'cache-manager'
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
  Inject,
  forwardRef,
} from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger'

import { Flight, FlightLeg } from './flight.model'
import {
  AKUREYRI_FLIGHT_CODES,
  ALLOWED_CONNECTING_FLIGHT_CODES,
  FlightService,
  REYKJAVIK_FLIGHT_CODES,
} from './flight.service'
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
} from './dto'
import { DiscountService } from '../discount'
import { Discount } from '../discount/discount.model'
import { AuthGuard } from '../common'
import type { HttpRequest } from '../../app.types'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

@ApiTags('Flights')
@Controller('api/public')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PublicFlightController {
  constructor(
    private readonly flightService: FlightService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
    @Inject(forwardRef(() => DiscountService))
    private readonly discountService: DiscountService,
  ) {}

  private async validateConnectionFlights(
    discount: Discount,
    discountCode: string,
    flightLegs: FlightLeg[],
  ): Promise<string> {
    const flightLegCount = flightLegs.length
    const connectionDiscountCode =
      this.discountService.filterConnectionDiscountCodes(
        discount.connectionDiscountCodes,
        discountCode,
      )

    if (!connectionDiscountCode) {
      throw new ForbiddenException(
        'The provided discount code is either not intended for connecting flights or is expired',
      )
    }

    const connectingId = connectionDiscountCode.flightId

    // Make sure that all the flightLegs contain valid airports and valid airports only
    // Note: at this point, none of the flightLegs contain Reykjavík
    const ALLOWED_FLIGHT_CODES = [
      ...AKUREYRI_FLIGHT_CODES,
      ...ALLOWED_CONNECTING_FLIGHT_CODES,
    ]
    for (const flightLeg of flightLegs) {
      if (
        !ALLOWED_FLIGHT_CODES.includes(flightLeg.origin) ||
        !ALLOWED_FLIGHT_CODES.includes(flightLeg.destination)
      ) {
        throw new ForbiddenException(
          `A flightleg contains invalid flight code/s [${flightLeg.origin}, ${flightLeg.destination}]. Allowed flight codes: [${ALLOWED_FLIGHT_CODES}]`,
        )
      }
    }

    // Make sure the flightLegs are chronological
    const chronoLogicallegs = flightLegs.sort((a, b) => {
      const adate = new Date(Date.parse(a.date.toString()))
      const bdate = new Date(Date.parse(b.date.toString()))
      return adate.getTime() - bdate.getTime()
    })

    let incomingLeg = {
      origin: chronoLogicallegs[0].origin,
      destination: chronoLogicallegs[0].destination,
      date: new Date(Date.parse(chronoLogicallegs[0].date.toString())),
    }

    // Validate the first chronological flightLeg of the connection flight
    let isConnectingFlight =
      await this.flightService.isFlightLegConnectingFlight(
        connectingId,
        incomingLeg as FlightLeg, // must have date, destination and origin
      )

    // If round-trip
    if (
      chronoLogicallegs[0].origin ===
      chronoLogicallegs[flightLegCount - 1].destination
    ) {
      // Find a valid connection for the return trip to Akureyri
      incomingLeg = {
        origin: chronoLogicallegs[flightLegCount - 1].origin,
        destination: chronoLogicallegs[flightLegCount - 1].destination,
        date: new Date(
          Date.parse(chronoLogicallegs[flightLegCount - 1].date.toString()),
        ),
      }
      // Lazy evaluation makes this cheap
      isConnectingFlight =
        isConnectingFlight &&
        (await this.flightService.isFlightLegConnectingFlight(
          connectingId,
          incomingLeg as FlightLeg,
        ))
    }

    if (!isConnectingFlight) {
      throw new ForbiddenException(
        'User does not meet the requirements for a connecting flight for this flight. Must be 48 hours or less between flight and connectingflight. Each connecting flight must go from/to Akureyri',
      )
    }
    return connectingId
  }

  @Post('discounts/:discountCode/isValidConnectionFlight')
  @ApiResponse({
    status: 200,
    description: 'Input flight is eligible for discount as a connection flight',
  })
  @ApiResponse({
    status: 400,
    description:
      'User does not have any flights that may correspond to connection flight',
  })
  @ApiResponse({
    status: 403,
    description:
      'The provided discount code is either not intended for connecting flights or is expired',
  })
  @HttpCode(200)
  @ApiOkResponse()
  async checkFlightStatus(
    @Param() params: CheckFlightParams,
    @Body() body: CheckFlightBody,
  ): Promise<void> {
    const discount = await this.discountService.getDiscountByDiscountCode(
      params.discountCode,
    )

    if (!discount) {
      throw new BadRequestException('Discount code is invalid')
    }

    await this.validateConnectionFlights(
      discount,
      params.discountCode,
      body.flightLegs as FlightLeg[],
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

    if (!discount.user) {
      throw new BadRequestException('No user associated with discount code')
    }

    if (
      new Date(flight.bookingDate).getFullYear().toString() !==
      new Date(Date.now()).getFullYear().toString()
    ) {
      throw new BadRequestException(
        'Flight cannot be booked outside the current year',
      )
    }

    let connectingFlight = false
    let isConnectable = true
    let connectingId = undefined

    const hasReykjavik = flight.flightLegs.some(
      (flightLeg) =>
        REYKJAVIK_FLIGHT_CODES.includes(flightLeg.origin) ||
        REYKJAVIK_FLIGHT_CODES.includes(flightLeg.destination),
    )

    const hasAkureyri = flight.flightLegs.some(
      (flightLeg) =>
        AKUREYRI_FLIGHT_CODES.includes(flightLeg.origin) ||
        AKUREYRI_FLIGHT_CODES.includes(flightLeg.destination),
    )

    if (!hasReykjavik && hasAkureyri) {
      connectingId = await this.validateConnectionFlights(
        discount,
        params.discountCode,
        flight.flightLegs as FlightLeg[],
      )
    } else if (hasReykjavik) {
      if (discount.discountCode !== params.discountCode) {
        throw new ForbiddenException(
          'This discount code is only intended for connecting flights',
        )
      }
      const { unused: flightLegsLeft } =
        await this.flightService.countThisYearsFlightLegsByNationalId(
          discount.nationalId,
        )
      if (flightLegsLeft < flight.flightLegs.length) {
        throw new ForbiddenException('Flight leg quota is exceeded')
      }
      if (!hasAkureyri) {
        isConnectable = false
      }
    } else {
      throw new ForbiddenException(
        'Eligible flights must be from/to Reykjavík or be connecting flights from/to Akureyri',
      )
    }

    if (connectingId) {
      connectingFlight = true
      isConnectable = false
    }

    const newFlight = await this.flightService.create(
      flight,
      discount.user,
      request.airline,
      isConnectable,
      connectingId,
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

    const flightLeg = await flight.flightLegs?.find(
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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.admin)
@Controller('api/private')
@ApiTags('Admin')
@ApiBearerAuth()
export class PrivateFlightAdminController {
  constructor(private readonly flightService: FlightService) {}

  @Get('flights')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [Flight] })
  get(): Promise<Flight[]> {
    return this.flightService.findAll()
  }

  @Post('flightLegs')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [FlightLeg] })
  getFlightLegs(@Body() body: GetFlightLegsBody): Promise<FlightLeg[]> {
    return this.flightService.findAllLegsByFilter(body)
  }

  @Post('flightLegs/confirmInvoice')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [FlightLeg] })
  async confirmInvoice(@Body() body: ConfirmInvoiceBody): Promise<FlightLeg[]> {
    let flightLegs = await this.flightService.findAllLegsByFilter(body)
    flightLegs = await this.flightService.finalizeCreditsAndDebits(flightLegs)
    return flightLegs
  }
}

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.default)
@Controller('api/private')
@ApiTags('Users')
@ApiBearerAuth()
export class PrivateFlightUserController {
  constructor(private readonly flightService: FlightService) {}

  @Get('users/:nationalId/flights')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [Flight] })
  getUserFlights(@Param() params: GetUserFlightsParams): Promise<Flight[]> {
    return this.flightService.findThisYearsFlightsByNationalId(
      params.nationalId,
    )
  }

  @Get('users/userAndRelationsFlights')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [Flight] })
  async getUserAndRelationsFlights(
    @CurrentUser() authUser: AuthUser,
  ): Promise<Flight[]> {
    return this.flightService.findThisYearsFlightsForUserAndRelations(authUser)
  }
}
