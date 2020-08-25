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
  Req,
  ForbiddenException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger'

import { Flight } from './flight.model'
import { FlightService } from './flight.service'
import { CreateFlightParams, DeleteFlightParams } from './flight.validator'
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
    @Req() request,
  ): Promise<Flight> {
    const nationalId = await this.discountService.validateDiscount(
      params.discountCode,
    )
    const flightLegsLeft = await this.flightService.countFlightLegsLeftByNationalId(
      nationalId,
    )
    if (flightLegsLeft < flight.flightLegs.length) {
      throw new FlightLimitExceeded()
    }
    await this.discountService.useDiscount(params.discountCode)
    return this.flightService.create(flight, nationalId, request.airline)
  }

  @Delete('flights/:flightId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(
    @Param() params: DeleteFlightParams,
    @Req() request,
  ): Promise<void> {
    const flight = await this.flightService.findOne(params.flightId)
    if (flight.airline !== request.airline) {
      throw new ForbiddenException('Flight belongs to other airline')
    }
    await this.flightService.delete(flight)
  }
}

@Controller('api/private')
export class PrivateFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('flights')
  @ApiExcludeEndpoint()
  async get(): Promise<Flight[]> {
    return this.flightService.findAll()
  }
}
