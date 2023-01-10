import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import { UsersApi } from '@island.is/clients/air-discount-scheme'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User as TUser } from '@island.is/air-discount-scheme/types'
import { FlightLeg } from '../models/flightLeg.model'
import { Flight } from '../models/flight.model'
import { User as FlightUser } from '../models/user.model'

@Injectable()
export class FlightLegService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private usersApi: UsersApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    this.handleError(error)
  }

  private getADSWithAuth(auth: Auth) {
    return this.usersApi.withMiddleware(
      new AuthMiddleware(auth, { forwardUserInfo: true }),
    )
  }

  async getThisYearsUserAndRelationsFlightLegs(
    auth: User,
  ): Promise<FlightLeg[]> {
    const flights = await this.getADSWithAuth(auth)
      .privateFlightUserControllerGetUserAndRelationsFlights()
      .catch((e) => {
        this.handle4xx(e)
      })

    if (!flights) {
      return []
    }

    const relations: TUser[] = await this.getUserRelations(auth)
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

  private async getUserRelations(auth: User): Promise<TUser[]> {
    const getRelationsResponse = await this.getADSWithAuth(auth)
      .privateUserControllerGetUserRelations({ nationalId: auth.nationalId })
      .catch((e) => {
        this.handleError(e)
      })

    if (!getRelationsResponse) {
      return []
    }

    return getRelationsResponse
  }
}
