import { NotFoundException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FlightLegSummary } from './flight.types'
import { Flight, FlightLeg, financialStateMachine } from './flight.model'
import { FlightDto } from './dto/flight.dto'

const ADS_POSTAL_CODES = {
  Reykhólahreppur: 380,
  // from Reykhólahreppur to Þingeyri
  Þingeyri: 471,

  Hólmavík: 510,
  // from Hólmavík to Öræfi
  Öræfi: 785,

  Vestmannaeyjar: 900,
}
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

  isADSPostalCode(postalcode: number): boolean {
    if (
      postalcode >= ADS_POSTAL_CODES['Reykhólahreppur'] &&
      postalcode <= ADS_POSTAL_CODES['Þingeyri']
    ) {
      return true
    } else if (
      postalcode >= ADS_POSTAL_CODES['Hólmavík'] &&
      postalcode <= ADS_POSTAL_CODES['Öræfi']
    ) {
      return true
    } else if (postalcode === ADS_POSTAL_CODES['Vestmannaeyjar']) {
      return true
    }
    return false
  }

  async countFlightLegsByNationalId(
    nationalId: string,
  ): Promise<FlightLegSummary> {
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
      used: noFlightLegs,
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
      throw new NotFoundException(`Flight<${flightId}> not found`)
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
      throw new NotFoundException(
        `FlightLeg<${flightLegId}> not found for Flight<${flight.id}>`,
      )
    }
    const financialState = financialStateMachine
      .transition(flightLeg.financialState, 'REVOKE')
      .value.toString()
    return flightLeg.update({ financialState })
  }
}
