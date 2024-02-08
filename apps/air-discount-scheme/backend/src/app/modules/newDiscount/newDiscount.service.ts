import { Injectable } from '@nestjs/common'

import {
  AirDiscount,
  NewDiscount,
  DiscountedFlight,
  DiscountedFlightLeg,
} from './newDiscount.model'
import {
  AKUREYRI_FLIGHT_CODES,
  ALLOWED_CONNECTING_FLIGHT_CODES,
  REYKJAVIK_FLIGHT_CODES,
} from '../flight/flight.service'
import { User } from '../user/user.model'
import { InjectModel } from '@nestjs/sequelize'
import { UserService } from '../user/user.service'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

type CreationDiscountFlight = {
  isConnectionFlight: boolean
  flightLegs: { origin: string; destination: string }[]
}

export const DISCOUNT_CODE_LENGTH = 8

@Injectable()
export class NewDiscountService {
  constructor(
    @InjectModel(NewDiscount)
    private discountModel: typeof NewDiscount,

    @InjectModel(AirDiscount)
    private airDiscountModel: typeof AirDiscount,

    @InjectModel(DiscountedFlight)
    private discountedFlightModel: typeof DiscountedFlight,

    @InjectModel(DiscountedFlightLeg)
    private discountedFlightLegModel: typeof DiscountedFlightLeg,

    private readonly userService: UserService,
  ) {}

  private getRandomRange(min: number, max: number): number {
    return Math.random() * (max + 1 - min) + min
  }

  private generateDiscountCode(): string {
    return [...Array(DISCOUNT_CODE_LENGTH)]
      .map(() => {
        // We are excluding 0 and O because users mix them up
        const charCodes = [
          this.getRandomRange(49, 57), // 1 - 9
          this.getRandomRange(65, 78), // A - N
          this.getRandomRange(80, 90), // P - Z
        ]
        const randomCharCode =
          charCodes[Math.floor(Math.random() * charCodes.length)]
        return String.fromCharCode(randomCharCode)
      })
      .join('')
  }

  createFlightLegs(
    origin: string,
    destination: string,
    returningFlight: boolean,
  ) {
    const flightLegs = [
      {
        origin: origin,
        destination: destination,
      },
    ]

    if (returningFlight) {
      flightLegs.push({
        origin: destination,
        destination: origin,
      })
    }

    return flightLegs
  }

  generateAirDiscountCode(
    isConnectionCode: boolean,
    generateCode: () => string,
    validUntil: string,
    explicit = false,
  ) {
    return {
      code: generateCode(),
      validUntil,
      active: true,
      explicit,
      isConnectionCode,
    }
  }

  getDiscountFlightsFromCreateDiscountParams(
    origin: string,
    destination: string,
    returningFlight: boolean,
    explicit = false,
  ): CreationDiscountFlight[] {
    const isOriginReykjavik = REYKJAVIK_FLIGHT_CODES.includes(origin)
    const isDestinationReykjavik = REYKJAVIK_FLIGHT_CODES.includes(destination)
    const isOriginAkureyri = AKUREYRI_FLIGHT_CODES.includes(origin)
    const isDestinationAkureyri = AKUREYRI_FLIGHT_CODES.includes(destination)
    const isOriginAllowed = ALLOWED_CONNECTING_FLIGHT_CODES.includes(origin)
    const isDestinationAllowed =
      ALLOWED_CONNECTING_FLIGHT_CODES.includes(destination)

    if (
      (isOriginAkureyri && isDestinationReykjavik) ||
      (isOriginReykjavik && isDestinationAkureyri)
    ) {
      return [
        {
          isConnectionFlight: false,
          flightLegs: this.createFlightLegs(
            origin,
            destination,
            returningFlight,
          ),
        },
      ]
    }

    if (isOriginAllowed && isDestinationReykjavik) {
      return [
        {
          isConnectionFlight: true,
          flightLegs: this.createFlightLegs(
            origin,
            AKUREYRI_FLIGHT_CODES[0],
            returningFlight,
          ),
        },
        {
          isConnectionFlight: false,
          flightLegs: this.createFlightLegs(
            AKUREYRI_FLIGHT_CODES[0],
            destination,
            returningFlight,
          ),
        },
      ]
    }

    if (isDestinationAllowed && isOriginReykjavik) {
      return [
        {
          isConnectionFlight: false,
          flightLegs: this.createFlightLegs(
            origin,
            AKUREYRI_FLIGHT_CODES[0],
            returningFlight,
          ),
        },
        {
          isConnectionFlight: true,
          flightLegs: this.createFlightLegs(
            AKUREYRI_FLIGHT_CODES[0],
            destination,
            returningFlight,
          ),
        },
      ]
    }
    if (explicit) {
      return [
        {
          isConnectionFlight: false,
          flightLegs: this.createFlightLegs(
            origin,
            destination,
            returningFlight,
          ),
        },
      ]
    }
    return []
  }

  createDiscountFlights(flights: CreationDiscountFlight[], explicit = false) {
    return flights.map((flight) => {
      return {
        ...flight,
        discount: {
          ...this.generateAirDiscountCode(
            flight.isConnectionFlight,
            () => this.generateDiscountCode(),
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
            explicit,
          ),
          hasReturnFlight: flight.flightLegs.length > 1,
        },
      }
    })
  }

  async createNewDiscountCode(
    user: User,
    nationalId: string,
    origin: string,
    destination: string,
    returningFlight: boolean,
    explicit = false,
  ) {
    // If user does not have an active discount code model, we create a discount model with connection to a airdiscount model
    const flights = this.getDiscountFlightsFromCreateDiscountParams(
      origin,
      destination,
      returningFlight,
      explicit,
    )

    try {
      const discount = await this.discountModel.create(
        {
          user: user,
          nationalId,
          discountedFlights: this.createDiscountFlights(flights),
          active: true,
        },
        {
          include: [
            {
              model: this.discountedFlightModel,
              include: [this.discountedFlightLegModel, this.airDiscountModel],
            },
          ],
        },
      )
      return discount
    } catch (e) {
      // TODO: Log error
      return null
    }
  }

  async createNewExplicitDiscountCode(
    auth: AuthUser,
    nationalId: string,
    origin: string,
    destination: string,
    returningFlight: boolean,
  ) {
    const user = await this.userService.getUserInfoByNationalId(
      nationalId,
      auth,
    )
    if (!user) {
      return null
    }
    return this.createNewDiscountCode(
      user,
      nationalId,
      origin,
      destination,
      returningFlight,
      true,
    )
  }

  async getDiscountCodeForUser(auth: AuthUser, nationalId: string) {
    // Check if user already has an active discount code model
    const user = await this.userService.getUserInfoByNationalId(
      nationalId,
      auth,
    )
    const existingDiscount = await this.discountModel.findOne({
      where: {
        nationalId,
        active: true,
      },
      include: [
        {
          model: this.discountedFlightModel,
          include: [this.airDiscountModel, this.discountedFlightLegModel],
        },
      ],
    })
    // If user has an active discount code model, check if all connectable flights have a connection discount code and return current discount code
    if (existingDiscount && user) {
      existingDiscount.user = user
      return existingDiscount
    }
    return null
  }

  async getDiscountByCode(auth: AuthUser, code: string) {
    // We need to find the discountModel where the airDiscountModel of the discountedFlightModel has the code
    const discount = await this.discountModel.findOne({
      where: {
        active: true,
      },
      include: [
        {
          model: this.discountedFlightModel,
          include: [
            {
              model: this.airDiscountModel,
              where: {
                code,
              },
            },
            this.discountedFlightLegModel,
          ],
        },
      ],
    })
    // now we need to find the user that is connected to the discountModel
    if (!discount) {
      return null
    }

    const user = await this.userService.getUserInfoByNationalId(
      discount.nationalId,
      auth,
    )
    if (user) {
      discount.user = user
    }
    return discount
  }
}
