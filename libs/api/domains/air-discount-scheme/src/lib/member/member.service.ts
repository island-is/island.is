import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  AirDiscountSchemeClientService,
  type Discount,
} from '@island.is/clients/air-discount-scheme'

import { DiscountService } from '../discount/discount.service'
import { Benefit } from '../models/benefit.model'
import { Member } from '../models/member.model'
import { UsedFlightLeg } from '../models/usedFlightLeg.model'

@Injectable()
export class MemberService {
  constructor(
    private readonly airDiscountSchemeClientService: AirDiscountSchemeClientService,
    private readonly discountService: DiscountService,
  ) {}

  async getMembers(auth: User): Promise<Member[]> {
    const relations =
      await this.airDiscountSchemeClientService.getUserRelations(auth)

    return relations.map((relation) => ({
      name: `${relation.firstName} ${relation.lastName}`,
      nationalId: relation.nationalId,
    }))
  }

  async getBenefit(auth: User, nationalId: string): Promise<Benefit | null> {
    const discount =
      (await this.airDiscountSchemeClientService.getCurrentDiscount(
        auth,
        nationalId,
      )) ??
      (await this.airDiscountSchemeClientService.createDiscount(
        auth,
        nationalId,
      ))

    return discount ? this.toBenefit(discount) : null
  }

  async getUsedFlightLegsByNationalId(
    auth: User,
  ): Promise<Map<string, UsedFlightLeg[]>> {
    const flights =
      await this.airDiscountSchemeClientService.getUserAndRelationsFlights(auth)

    const result = new Map<string, UsedFlightLeg[]>()

    for (const flight of flights) {
      const legs = (flight.flightLegs ?? []).map((flightLeg) => ({
        travel: `${flightLeg.origin} - ${flightLeg.destination}`,
        bookingDate: flight.bookingDate,
      }))

      const nationalId = flight.nationalId
      const existing = result.get(nationalId) ?? []
      result.set(nationalId, [...existing, ...legs])
    }

    return result
  }

  private toBenefit(discount: Discount): Benefit | null {
    const { fund } = discount.user

    if (fund.credit === 0 && fund.used === 0) {
      return null
    }

    const processed = this.discountService.processDiscount(discount)

    return {
      fund,
      discountCode: processed.discountCode,
      connectionDiscountCodes: processed.connectionDiscountCodes,
    }
  }
}
