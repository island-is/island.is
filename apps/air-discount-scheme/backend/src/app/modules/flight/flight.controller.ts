import {
  Get,
  HttpCode,
  Body,
  Controller,
  Param,
  Post,
  Delete,
} from '@nestjs/common'
import { Flight } from './flight.model'
import { FlightService } from './flight.service'
import { FlightDto } from './dto/flight.dto'
import { DeleteFlightParams } from './flight.validator'
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('flight')
@Controller('public/flight')
export class PublicFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ApiCreatedResponse({ type: Flight })
  async create(@Body() flight: FlightDto): Promise<Flight> {
    return this.flightService.create(flight)
  }

  @Delete(':flightId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(@Param() params: DeleteFlightParams): Promise<void> {
    await this.flightService.delete(params.flightId)
  }
}

@Controller('private/flight')
export class PrivateFlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  @ApiExcludeEndpoint()
  async get(): Promise<Flight[]> {
    return this.flightService.findAll()
  }
}
