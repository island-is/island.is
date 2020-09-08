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
  }

  @ResolveField('user', () => User)
  resolveUser(@Parent() flight: FlightWithUser): User {
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
