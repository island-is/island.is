import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import * as kennitala from 'kennitala'

import {
  Actions,
  Airlines,
  States,
} from '@island.is/air-discount-scheme/consts'
import { FlightLegSummary } from './flight.types'
import { Flight, FlightLeg, financialStateMachine } from './flight.model'
import { CreateFlightBody, GetFlightLegsBody } from './dto'
import { NationalRegistryUser } from '../nationalRegistry'

export const ADS_POSTAL_CODES = {
  Reykhólahreppur: 380,
  // from Reykhólahreppur to Þingeyri
  Þingeyri: 471,

  Hólmavík: 510,
  // from Hólmavík to Öræfi
  Öræfi: 785,

  Vestmannaeyjar: 900,
}
const DEFAULT_AVAILABLE_LEGS = 6
const AVAILABLE_FLIGHT_LEGS: { [year: string]: number } = {
  '2020': 2,
  '2021': 6,
}

const availableFinancialStates = [
  financialStateMachine.states[States.awaitingDebit].key,
  financialStateMachine.states[States.sentDebit].key,
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

  findAll(): Promise<Flight[]> {
    return this.flightModel.findAll({
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })
  }

  findAllLegsByFilter(body: GetFlightLegsBody | any): Promise<FlightLeg[]> {
    return this.flightLegModel.findAll({
      where: {
        ...(body.airline ? { airline: body.airline } : {}),
        ...(body.cooperation ? { cooperation: body.cooperation } : {}),
        ...(body.state && body.state.length > 0
          ? { financialState: body.state }
          : {}),
        ...(body.flightLeg?.from ? { origin: body.flightLeg.from } : {}),
        ...(body.flightLeg?.to ? { destination: body.flightLeg.to } : {}),
      },
      include: [
        {
          model: this.flightModel,
          where: Sequelize.and(
            Sequelize.where(
              Sequelize.fn('date', Sequelize.col('booking_date')),
              '>=',
              body.period.from,
            ),
            Sequelize.where(
              Sequelize.fn('date', Sequelize.col('booking_date')),
              '<=',
              body.period.to,
            ),
            Sequelize.where(
              Sequelize.literal("(user_info->>'age')::numeric"),
              '>=',
              body.age.from,
            ),
            Sequelize.where(
              Sequelize.literal("(user_info->>'age')::numeric"),
              '<=',
              body.age.to,
            ),
            {
              ...(body.gender ? { 'userInfo.gender': body.gender } : {}),
              ...(body.postalCode
                ? { 'userInfo.postalCode': body.postalCode }
                : {}),
            },
          ),
        },
      ],
    })
  }

  findAllByNationalId(nationalId: string): Promise<Flight[]> {
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

  create(
    flight: CreateFlightBody,
    user: NationalRegistryUser,
    airline: ValueOf<typeof Airlines>,
  ): Promise<Flight> {
    const nationalId = user.nationalId
    return this.flightModel.create(
      {
        ...flight,
        flightLegs: flight.flightLegs.map((flightLeg) => ({
          ...flightLeg,
          airline,
        })),
        nationalId,
        userInfo: {
          age: kennitala.info(nationalId).age,
          gender: user.gender,
          postalCode: user.postalcode,
        },
      },
      { include: [this.flightLegModel] },
    )
  }

  findOne(
    flightId: string,
    airline: ValueOf<typeof Airlines>,
  ): Promise<Flight | null> {
    return this.flightModel.findOne({
      where: {
        id: flightId,
      },
      include: [
        {
          model: this.flightLegModel,
          where: {
            financialState: availableFinancialStates,
            airline,
          },
        },
      ],
    })
  }

  private updateFinancialState(
    flightLeg: FlightLeg,
    action: ValueOf<typeof Actions>,
  ): Promise<FlightLeg> {
    const financialState = financialStateMachine
      .transition(flightLeg.financialState, action)
      .value.toString()
    return flightLeg.update({
      financialState,
      financialStateUpdated: new Date(),
    })
  }

  delete(flight: Flight): Promise<FlightLeg[]> {
    return Promise.all(
      flight.flightLegs.map((flightLeg: FlightLeg) =>
        this.deleteFlightLeg(flightLeg),
      ),
    )
  }

  deleteFlightLeg(flightLeg: FlightLeg): Promise<FlightLeg> {
    return this.updateFinancialState(flightLeg, Actions.revoke)
  }
}
