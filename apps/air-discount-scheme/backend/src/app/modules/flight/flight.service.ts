import { NotFoundException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Flight, FlightLeg } from './flight.model'
import { FlightDto } from './dto/flight.dto'

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(Flight)
    private flightModel: typeof Flight,
    @InjectModel(FlightLeg)
    private flightLegModel: typeof FlightLeg,
  ) {}

  async countFlightLegsByNationalId(nationalId: string): Promise<number> {
    return this.flightModel.count({
      where: { nationalId, invalid: false },
      include: [this.flightLegModel],
    })
  }

  async findAll(): Promise<Flight[]> {
    return this.flightModel.findAll({ where: { invalid: false } })
  }

  async create(flight: FlightDto): Promise<Flight> {
    return this.flightModel.create(flight, { include: [FlightLeg] })
  }

  async delete(flightId: string): Promise<Flight> {
    const flight = await this.flightModel.findOne({
      where: { id: flightId, invalid: false },
    })
    if (!flight) {
      throw new NotFoundException()
    }
    return flight.update({ invalid: true })
  }
}
