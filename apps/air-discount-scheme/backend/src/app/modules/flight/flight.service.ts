import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Op } from 'sequelize'
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
    const awaitingCredit =
      financialStateMachine.states[States.awaitingCredit].key
    return this.flightLegModel.findAll({
      where: {
        ...(body.airline ? { airline: body.airline } : {}),
        ...(body.cooperation ? { cooperation: body.cooperation } : {}),
        ...(body.state && body.state.length > 0
          ? { financialState: body.state }
          : {}),
        ...(body.flightLeg?.from ? { origin: body.flightLeg.from } : {}),
        ...(body.flightLeg?.to ? { destination: body.flightLeg.to } : {}),
        // We want to show rows that are awaiting credit based on their
        // financial_state_updated instead of booking_date because if they
        // were booked long ago and have recently been cancelled they need
        // to show up on the correct monthly report
        [Op.or]: [
          {
            [Op.and]: [
              { financialState: { [Op.eq]: awaitingCredit } },
              {
                financialStateUpdated: { [Op.gte]: new Date(body.period.from) },
              },
              { financialStateUpdated: { [Op.lte]: new Date(body.period.to) } },
            ],
          },
          {
            [Op.and]: [
              { financialState: { [Op.ne]: awaitingCredit } },
              {
                '$flight.booking_date$': {
                  [Op.gte]: new Date(body.period.from),
                },
              },
              {
                '$flight.booking_date$': { [Op.lte]: new Date(body.period.to) },
              },
            ],
          },
        ],
      },
      include: [
        {
          model: this.flightModel,
          where: Sequelize.and(
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

  finalizeCreditsAndDebits(flightLegs: FlightLeg[]): Promise<FlightLeg[]> {
    return Promise.all(
      flightLegs.map((flightLeg) => {
        let { financialState } = flightLeg
        if (financialState === States.awaitingDebit) {
          financialState = financialStateMachine
            .transition(flightLeg.financialState, 'SEND')
            .value.toString()
        } else if (financialState === States.awaitingCredit) {
          financialState = financialStateMachine
            .transition(flightLeg.financialState, 'SEND')
            .value.toString()
        }

        return flightLeg.update({ financialState })
      }),
    )
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
