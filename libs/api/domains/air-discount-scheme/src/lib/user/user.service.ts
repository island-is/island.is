import { Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientService } from '@island.is/clients/air-discount-scheme'

import { MostFlownRoute } from '../models/mostFlownRoute.model'

@Injectable()
export class UserService {
  constructor(
    private readonly airDiscountSchemeClientService: AirDiscountSchemeClientService,
  ) {}

  async getMostFlownRoute(
    auth: User,
    nationalId: string,
  ): Promise<MostFlownRoute | null> {
    const flights = await this.airDiscountSchemeClientService
      .getUserAndRelationsFlights(auth)
      .catch(() => null)

    if (!flights) {
      return null
    }

    const legs = flights
      .filter((flight) => flight.nationalId === nationalId)
      .flatMap((flight) => flight.flightLegs ?? [])

    const counts = new Map<string, number>()
    let top: MostFlownRoute | null = null

    for (const leg of legs) {
      const route = `${leg.origin} - ${leg.destination}`
      const count = (counts.get(route) ?? 0) + 1
      counts.set(route, count)

      if (!top || count > top.count) {
        top = { route, count }
      }
    }

    return top
  }
}
