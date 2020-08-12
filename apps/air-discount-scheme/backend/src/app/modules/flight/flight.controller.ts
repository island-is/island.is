import { Body, Controller, Param, Get, Post, Delete } from '@nestjs/common'
import { Flight } from './flight.model'
import { FlightService } from './flight.service'
import { FlightDto } from './dto/flight.dto'
import {
  ApiExcludeEndpoint,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('flight')
@Controller('public/flight')
export class PublicFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ApiCreatedResponse({ type: Flight })
  async create(@Body() flight: FlightDto): Promise<Flight> {
    return await this.flightService.create(flight)
  }

  @Delete(':flightId')
  @ApiOkResponse()
  async delete(@Param('flightId') flightId: string): Promise<number> {
    return await this.flightService.delete(flightId)
  }
}

@Controller('private/flight')
export class PrivateFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  @ApiExcludeEndpoint()
  async get(): Promise<string> {
    // TODO setup private routes
    return 'Implement me'
  }
}
