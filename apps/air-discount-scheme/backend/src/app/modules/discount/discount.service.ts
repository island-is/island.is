import { Injectable } from '@nestjs/common'
import { Discount } from './discount.model'
import { FlightService } from '../flight/flight.service'
import { DiscountLimitExceeded } from './discount.error'

const DEFAULT_AVAILABLE_LEGS = 6
const AVAILABLE_FLIGHT_LEGS = {
  '2020': 4,
  '2021': 6,
}

const DISCOUNT_CODE_LENGTH = 8

@Injectable()
export class DiscountService {
  constructor(private readonly flightService: FlightService) {}

  private async getFlightLegsLeft(nationalId: string) {
    const noFlightLegs = await this.flightService.countFlightLegsByNationalId(
      nationalId,
    )

    const currentYear = new Date(Date.now()).getFullYear().toString()
    let availableLegsThisYear = DEFAULT_AVAILABLE_LEGS
    if (Object.keys(AVAILABLE_FLIGHT_LEGS).includes(currentYear)) {
      availableLegsThisYear = AVAILABLE_FLIGHT_LEGS[currentYear]
    }
    const flightLegsLeft = availableLegsThisYear - noFlightLegs
    if (flightLegsLeft <= 0) {
      throw new DiscountLimitExceeded()
    }
    return flightLegsLeft
  }

  async findByDiscountCodeAndNationalId(
    discountCode: string,
    nationalId: string,
  ): Promise<Discount> {
    const flightLegsLeft = await this.getFlightLegsLeft(nationalId)
    // TODO: check redis if discountCode exists and belongs to the nationalId provided
    return new Discount(discountCode, nationalId, flightLegsLeft)
  }

  private generateDiscountCode() {
    return [...Array(DISCOUNT_CODE_LENGTH)]
      .map(() => String.fromCharCode(Math.random() * (90 - 65) + 65))
      .join('')
  }

  async createDiscountCode(nationalId: string): Promise<Discount> {
    const flightLegsLeft = await this.getFlightLegsLeft(nationalId)
    const discountCode = this.generateDiscountCode()
    // TODO save discountCode in redis
    return new Discount(discountCode, nationalId, flightLegsLeft)
  }
}
