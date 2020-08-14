import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Flight } from './flight.model'
import { FlightDto } from './dto/flight.dto'

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(Flight)
    private flightModel: typeof Flight,
  ) {}

  async create(flight: FlightDto): Promise<Flight> {
    return this.flightModel.create(flight)
  }

  async delete(flightId: string): Promise<number> {
    return this.flightModel.destroy({ where: { flightId } })
  }
}
