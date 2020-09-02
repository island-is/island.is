import { Context, Query, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  User as TUser,
  Flight as TFlight,
  FlightLeg,
} from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Flight } from './flight.model'
import { User } from '../user'

type FlightWithTUser = TFlight & { user: TUser }

@Resolver(() => Flight)
export class FlightResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Query(() => [Flight])
  async flights(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<FlightWithTUser[]> {
    const relations: TUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
    return relations.reduce(
      (promise: Promise<FlightWithTUser[]>, relation: TUser) => {
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
    ) as Promise<FlightWithTUser[]>
  }

  @ResolveField('user')
  resolveUser(@Parent() flight: FlightWithTUser): User {
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
  resolveTravel(@Parent() flightLeg: FlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
