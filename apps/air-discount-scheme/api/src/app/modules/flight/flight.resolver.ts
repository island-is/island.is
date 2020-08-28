import { Context, Query, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  ThjodskraUser,
  Flight as TFlight,
  FlightLeg,
} from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Flight } from './flight.model'
import { User } from '../user'

type FlightWithThjodskraUser = TFlight & { user: ThjodskraUser }

@Resolver(() => Flight)
export class FlightResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Query(() => [Flight])
  async flights(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<FlightWithThjodskraUser[]> {
    const relations: ThjodskraUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
    return relations.reduce(
      (
        promise: Promise<FlightWithThjodskraUser[]>,
        relation: ThjodskraUser,
      ) => {
        return promise.then(async (acc) => {
          const flights: TFlight[] = await backendApi.getUserFlights(
            relation.nationalId,
          )
          const flightLegs = flights.reduce((acc, flight) => {
            const legs = flight.flightLegs.map(
              ({ id, origin, destination }) => ({
                ...flight,
                id,
                origin,
                destination,
                user: relation,
              }),
            )
            return [...acc, ...legs]
          }, [])
          return [...acc, ...flightLegs]
        })
      },
      Promise.resolve([]),
    ) as Promise<FlightWithThjodskraUser[]>
  }

  @ResolveField('user')
  resolveUser(@Parent() flight: FlightWithThjodskraUser): User {
    const { user } = flight
    return {
      ...user,
      name: `${user.firstName} ${user.middleName} ${user.lastName}`.replace(
        /\s\s+/g,
        ' ',
      ),
    }
  }

  @ResolveField('travel')
  resolveFlightLegFund(@Parent() flightLeg: FlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
