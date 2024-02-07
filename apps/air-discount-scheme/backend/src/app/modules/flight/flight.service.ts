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
import {
  NationalRegistryService,
  NationalRegistryUser,
} from '../nationalRegistry'
import { ExplicitCode } from '../discount/discount.model'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { ExplicitFlightLeg } from '../discount/dto/ExplicitFlight.dto'

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

// This doesn't need to be updated year by year
// unless deviations from the 6 default flightlegs occur
const AVAILABLE_FLIGHT_LEGS: { [year: string]: number } = {
  '2020': 2,
  '2021': 6,
  '2022': 6,
}

const availableFinancialStates = [
  financialStateMachine.states[States.awaitingDebit].key,
  financialStateMachine.states[States.sentDebit].key,
]

export const CONNECTING_FLIGHT_GRACE_PERIOD = 48 * (1000 * 60 * 60) // 48 hours in milliseconds
export const REYKJAVIK_FLIGHT_CODES = ['RKV', 'REK']
export const AKUREYRI_FLIGHT_CODES = ['AEY']
export const ALLOWED_CONNECTING_FLIGHT_CODES = ['VPN', 'GRY', 'THO']

@Injectable()
export class FlightService {
  constructor(
    @InjectModel(Flight)
    private flightModel: typeof Flight,
    @InjectModel(FlightLeg)
    private flightLegModel: typeof FlightLeg,
    @InjectModel(ExplicitCode)
    private explicitModel: typeof ExplicitCode,
    private readonly nationalRegistryService: NationalRegistryService,
  ) {}

  isADSPostalCode(postalcode: number): boolean {
    if (postalcode === null) {
      return false
    }
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

  hasConnectingFlightPotentialFromFlightLegs(
    firstFlight: FlightLeg | ExplicitFlightLeg,
    secondFlight: FlightLeg | ExplicitFlightLeg,
  ): boolean {
    // If neither flight is connected to Reykjavik in any way
    // then it is not eligible
    if (
      !REYKJAVIK_FLIGHT_CODES.includes(firstFlight.destination) &&
      !REYKJAVIK_FLIGHT_CODES.includes(firstFlight.origin) &&
      !REYKJAVIK_FLIGHT_CODES.includes(secondFlight.destination) &&
      !REYKJAVIK_FLIGHT_CODES.includes(secondFlight.origin)
    ) {
      return false
    }

    // If neither flight is connected to the allowed connecting flight places
    // then it is not eligible
    if (
      !ALLOWED_CONNECTING_FLIGHT_CODES.includes(firstFlight.destination) &&
      !ALLOWED_CONNECTING_FLIGHT_CODES.includes(firstFlight.origin) &&
      !ALLOWED_CONNECTING_FLIGHT_CODES.includes(secondFlight.destination) &&
      !ALLOWED_CONNECTING_FLIGHT_CODES.includes(secondFlight.origin)
    ) {
      return false
    }

    // Both flights need to touch Akureyri in some way, that is to say,
    // Akureyri has to be a common point, ex: Reykjavik-Akureyri > Akureyri-Grimsey
    // Logic: If not (Akureyri in destination or origin of strictly both flights) return false
    if (
      !(
        AKUREYRI_FLIGHT_CODES.includes(firstFlight.destination) ||
        AKUREYRI_FLIGHT_CODES.includes(firstFlight.origin)
      ) ||
      !(
        AKUREYRI_FLIGHT_CODES.includes(secondFlight.destination) ||
        AKUREYRI_FLIGHT_CODES.includes(secondFlight.origin)
      )
    ) {
      return false
    }

    let delta = secondFlight.date.getTime() - firstFlight.date.getTime()

    // The order must be flipped if we subtract the first intended chronological leg
    // from the second intended chronological leg
    if (
      REYKJAVIK_FLIGHT_CODES.includes(secondFlight.origin) ||
      REYKJAVIK_FLIGHT_CODES.includes(firstFlight.destination)
    ) {
      delta = -delta
    }

    if (delta >= 0 && delta <= CONNECTING_FLIGHT_GRACE_PERIOD) {
      return true
    }
    return false
  }

  async isFlightLegConnectingFlight(
    existingFlightId: string,
    incomingLeg: FlightLeg | ExplicitFlightLeg,
  ): Promise<boolean> {
    // Get the corresponding flight for the connection discount code
    const existingFlight = await this.flightModel.findOne({
      where: {
        id: existingFlightId,
      },
      include: [
        {
          model: this.flightLegModel,
          where: { financialState: availableFinancialStates },
        },
      ],
    })

    if (!existingFlight) {
      return false
    }

    // If a user flightLeg exists such that the incoming flightLeg makes a valid connection
    // pair, return true
    for (const flightLeg of existingFlight.flightLegs ?? []) {
      if (
        this.hasConnectingFlightPotentialFromFlightLegs(flightLeg, incomingLeg)
      ) {
        return true
      }
    }

    return false
  }

  async findThisYearsConnectableFlightsByNationalId(
    nationalId: string,
  ): Promise<Flight[]> {
    const flights = await this.findThisYearsFlightsByNationalId(nationalId)
    // Filter out non-Reykjavík and non-Akureyri flights
    return flights.filter((flight) => flight.connectable)
  }

  async countThisYearsFlightLegsByNationalId(
    nationalId: string,
  ): Promise<FlightLegSummary> {
    const currentYear = new Date(Date.now()).getFullYear().toString()
    let availableLegsThisYear = DEFAULT_AVAILABLE_LEGS
    if (Object.keys(AVAILABLE_FLIGHT_LEGS).includes(currentYear)) {
      availableLegsThisYear = AVAILABLE_FLIGHT_LEGS[currentYear]
    }

    const noFlightLegs = await this.flightModel.count({
      where: Sequelize.and(
        Sequelize.where(
          Sequelize.fn(
            'date_part',
            'year',
            Sequelize.fn('date', Sequelize.col('booking_date')),
          ),
          currentYear,
        ),
        { nationalId },
      ),
      include: [
        {
          model: this.flightLegModel,
          where: {
            financialState: availableFinancialStates,
            isConnectingFlight: false,
          },
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

  findAllLegsByFilter(body: GetFlightLegsBody): Promise<FlightLeg[]> {
    const awaitingCredit =
      financialStateMachine.states[States.awaitingCredit].key
    return this.flightLegModel.findAll({
      where: {
        ...(body.airline ? { airline: body.airline } : {}),
        ...(body.state && body.state.length > 0
          ? { financialState: body.state }
          : {}),
        ...(body.flightLeg?.from ? { origin: body.flightLeg.from } : {}),
        ...(body.flightLeg?.to ? { destination: body.flightLeg.to } : {}),
        ...(body.nationalId ? { '$flight.national_id$': body.nationalId } : {}),
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
          // If isExplicit is marked we do an INNER JOIN
          // on flight records, acting as a filter
          // hence, required: true
          ...(body.isExplicit
            ? {
                include: [
                  {
                    model: this.explicitModel,
                    required: true,
                  },
                ],
              }
            : {}),
        },
      ],
    })
  }

  findThisYearsFlightsByNationalId(nationalId: string): Promise<Flight[]> {
    const currentYear = new Date(Date.now()).getFullYear().toString()
    return this.findFlightsByYearAndNationalId(nationalId, currentYear)
  }

  async findThisYearsFlightsForUserAndRelations(
    authUser: AuthUser,
  ): Promise<Flight[]> {
    const relations = [
      authUser.nationalId,
      ...(await this.nationalRegistryService.getRelations(authUser)),
    ]
    const flights: Flight[] = []
    for (const relation of relations) {
      const relationFlights = await this.findThisYearsFlightsByNationalId(
        relation,
      )
      flights.push(...relationFlights)
    }
    return flights
  }

  findFlightsByYearAndNationalId(
    nationalId: string,
    year: string,
  ): Promise<Flight[]> {
    return this.flightModel.findAll({
      where: Sequelize.and(
        Sequelize.where(
          Sequelize.fn(
            'date_part',
            'year',
            Sequelize.fn('date', Sequelize.col('booking_date')),
          ),
          year,
        ),
        { nationalId },
      ),
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
    isConnectable: boolean,
    connectingId?: string,
  ): Promise<Flight> {
    const nationalId = user.nationalId

    if (!isConnectable && connectingId) {
      this.flightModel.update(
        {
          connectable: false,
        },
        {
          where: { id: connectingId },
        },
      )
    }

    return this.flightModel.create(
      {
        ...flight,
        flightLegs: flight.flightLegs.map((flightLeg) => ({
          ...flightLeg,
          airline,
          isConnectingFlight: !isConnectable && Boolean(connectingId),
        })),
        nationalId,
        userInfo: {
          age: kennitala.info(nationalId).age,
          gender: user.gender,
          postalCode: user.postalcode,
        },
        connectable: isConnectable,
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
    changeByAirline: boolean,
  ): Promise<FlightLeg> {
    const financialState = financialStateMachine
      .transition(flightLeg.financialState, action)
      .value.toString()
    return flightLeg.update({
      financialState,
      financialStateUpdated: changeByAirline
        ? new Date()
        : flightLeg.financialStateUpdated,
    })
  }

  finalizeCreditsAndDebits(flightLegs: FlightLeg[]): Promise<FlightLeg[]> {
    return Promise.all(
      flightLegs.map((flightLeg) => {
        const finalizingStates = [States.awaitingDebit, States.awaitingCredit]
        if (!finalizingStates.includes(flightLeg.financialState)) {
          return flightLeg
        }
        return this.updateFinancialState(flightLeg, Actions.send, false)
      }),
    )
  }

  delete(flight: Flight): Promise<FlightLeg[]> {
    return Promise.all(
      (flight.flightLegs ?? []).map((flightLeg: FlightLeg) =>
        this.deleteFlightLeg(flightLeg),
      ),
    )
  }

  deleteFlightLeg(flightLeg: FlightLeg): Promise<FlightLeg> {
    return this.updateFinancialState(flightLeg, Actions.revoke, true)
  }
}
