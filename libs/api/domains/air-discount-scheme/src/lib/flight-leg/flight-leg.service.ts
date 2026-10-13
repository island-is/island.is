import { Inject, Injectable } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeClientService } from '@island.is/clients/air-discount-scheme'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Flight } from '../models/flight.model'
import { FlightLeg } from '../models/flightLeg.model'
import { User as FlightUser } from '../models/user.model'
import { handleError } from '../shared/handleError'

@Injectable()
export class FlightLegService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly airDiscountSchemeClientService: AirDiscountSchemeClientService,
  ) {}

  async getThisYearsUserAndRelationsFlightLegs(
    auth: User,
  ): Promise<FlightLeg[]> {
    try {
      return await this.buildFlightLegs(auth)
    } catch (error) {
      return handleError(this.logger, error)
    }
  }

  private async buildFlightLegs(auth: User): Promise<FlightLeg[]> {
    const flights =
      await this.airDiscountSchemeClientService.getUserAndRelationsFlights(auth)

    if (flights.length === 0) {
      return []
    }

    const relations =
      await this.airDiscountSchemeClientService.getUserRelations(auth)
    const flightLegs: FlightLeg[] = []

    // The expected return value for the graphql layers has some extra properties
    // We have to maintain circularity as well since the types are circular.
    // Therefore we do some interesting object surgery
    for (const flight of flights) {
      // Not strictly needed but good practice for type safety
      const relation = relations.find(
        (relation) => relation.nationalId === flight.nationalId,
      )
      if (!relation) {
        continue
      }

      // We construct new objects with the expected model properties
      const constructedUser: FlightUser = {
        ...relation,
        name: `${relation.firstName} ${relation.lastName}`,
      }
      const constructedFlightLegs: FlightLeg[] = []

      // UserInfo in flight.userInfo has gender as string in the generated schema
      // but is a string union type, hence the `as Flight` coercion
      const constructedFlight: Flight = {
        ...flight,
        user: constructedUser,
        flightLegs: [],
      } as Flight

      // We loop through the flightLegs and attach the extra information needed
      // as well as attaching a reference to the new constructed flight
      for (const flightLeg of flight.flightLegs ?? []) {
        const constructedFlightLeg: FlightLeg = {
          ...flightLeg,
          travel: `${flightLeg.origin} - ${flightLeg.destination}`,
          flight: constructedFlight,
        }

        // Now we attach the flightLeg to its flight reference
        constructedFlightLeg.flight.flightLegs.push(constructedFlightLeg)

        constructedFlightLegs.push(constructedFlightLeg)
      }
      // Add the flightlegs to the return pool
      flightLegs.push(...constructedFlightLegs)
    }

    return flightLegs
  }
}
