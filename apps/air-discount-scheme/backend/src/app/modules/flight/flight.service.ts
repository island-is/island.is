import { NotFoundException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { Flight, FlightLeg } from './flight.model'
import { FlightDto } from './dto/flight.dto'

const DEFAULT_AVAILABLE_LEGS = 6
const AVAILABLE_FLIGHT_LEGS = {
  '2020': 4,
  '2021': 6,
}

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(Flight)
    private flightModel: typeof Flight,
    @InjectModel(FlightLeg)
    private flightLegModel: typeof FlightLeg,
  ) {}

  async countFlightLegsLeftByNationalId(nationalId: string): Promise<number> {
    const currentYear = new Date(Date.now()).getFullYear().toString()
    let availableLegsThisYear = DEFAULT_AVAILABLE_LEGS
    if (Object.keys(AVAILABLE_FLIGHT_LEGS).includes(currentYear)) {
      availableLegsThisYear = AVAILABLE_FLIGHT_LEGS[currentYear]
    }

    const noFlightLegs = await this.flightModel.count({
      where: { nationalId, invalid: false },
      include: [this.flightLegModel],
    })
    return availableLegsThisYear - noFlightLegs
  }

  async findAll(): Promise<Flight[]> {
    return this.flightModel.findAll({ where: { invalid: false } })
  }

  async create(
    flight: FlightDto,
    nationalId: string,
    airline: string,
  ): Promise<Flight> {
    return this.flightModel.create(
      { ...flight, nationalId, airline },
      { include: [FlightLeg] },
    )
  }

  async findOne(flightId: string): Promise<Flight> {
    const flight = await this.flightModel.findOne({
      where: { id: flightId, invalid: false },
    })
    if (!flight) {
      throw new NotFoundException('Unable to find flight')
    }
    return flight
  }

  async delete(flight: Flight): Promise<Flight> {
    return flight.update({ invalid: true })
  }
}
