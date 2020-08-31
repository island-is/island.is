import { NotFoundException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FlightLegFund } from '@island.is/air-discount-scheme/types'
import { Flight, FlightLeg, financialStateMachine } from './flight.model'
import { FlightDto } from './dto/flight.dto'

const DEFAULT_AVAILABLE_LEGS = 6
const AVAILABLE_FLIGHT_LEGS = {
  '2020': 4,
  '2021': 6,
}

const availableFinancialStates = [
  financialStateMachine.states.awaitingDebit.key,
  financialStateMachine.states.sentDebit.key,
]

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
      where: { nationalId },
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })
    return {
      nationalId,
      unused: availableLegsThisYear - noFlightLegs,
      total: availableLegsThisYear,
    }
  }

  async findAll(): Promise<Flight[]> {
    return this.flightModel.findAll({
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })
  }

  async findAllByNationalId(nationalId: string): Promise<Flight[]> {
    return this.flightModel.findAll({
      where: { nationalId },
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })
  }

  async create(
    flight: FlightDto,
    nationalId: string,
    airline: string,
  ): Promise<Flight> {
    return this.flightModel.create(
      { ...flight, nationalId, airline },
      { include: [this.flightLegModel] },
    )
  }

  async findOne(flightId: string, airline: string): Promise<Flight> {
    const flight = await this.flightModel.findOne({
      where: {
        id: flightId,
        airline,
      },
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })
    if (!flight) {
      throw new NotFoundException('Flight not found')
    }
    return flight
  }

  delete(flight: Flight): Promise<FlightLeg[]> {
    return Promise.all(
      flight.flightLegs.map((flightLeg) => {
        const financialState = financialStateMachine
          .transition(flightLeg.financialState, 'REVOKE')
          .value.toString()
        return flightLeg.update({ financialState })
      }),
    )
  }

  async deleteFlightLeg(
    flight: Flight,
    flightLegId: string,
  ): Promise<FlightLeg> {
    const flightLeg = await flight.flightLegs.find(
      (flightLeg) => flightLeg.id === flightLegId,
    )
    if (!flightLeg) {
      throw new NotFoundException('Flight not found')
    }
    const financialState = financialStateMachine
      .transition(flightLeg.financialState, 'REVOKE')
      .value.toString()
    return flightLeg.update({ financialState })
  }
}
