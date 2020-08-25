import { NotFoundException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FlightLegFund } from '@island.is/air-discount-scheme/types'
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

  async countFlightLegsByNationalId(
    nationalId: string,
  ): Promise<FlightLegFund> {
    const currentYear = new Date(Date.now()).getFullYear().toString()
    let availableLegsThisYear = DEFAULT_AVAILABLE_LEGS
    if (Object.keys(AVAILABLE_FLIGHT_LEGS).includes(currentYear)) {
      availableLegsThisYear = AVAILABLE_FLIGHT_LEGS[currentYear]
    }

    const noFlightLegs = await this.flightModel.count({
      where: { nationalId, invalid: false },
      include: [this.flightLegModel],
    })
    return {
      nationalId,
      unused: availableLegsThisYear - noFlightLegs,
      total: availableLegsThisYear,
    }
  }

  async findAll(): Promise<Flight[]> {
    return this.flightModel.findAll({ where: { invalid: false } })
  }

  async findAllByNationalId(nationalId: string): Promise<Flight[]> {
    return this.flightModel.findAll({
      where: { invalid: false, nationalId },
      include: [this.flightLegModel],
    })
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

  async findOne(flightId: string, airline: string): Promise<Flight> {
    const flight = await this.flightModel.findOne({
      where: { id: flightId, airline, invalid: false },
      include: [this.flightLegModel],
    })
    if (!flight) {
      throw new NotFoundException('Flight not found')
    }
    return flight
  }

  async delete(flight: Flight): Promise<Flight> {
    return flight.update({ invalid: true })
  }
}
