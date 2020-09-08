import {
  Context,
  Query,
  Parent,
  ResolveField,
  Resolver,
  Args,
} from '@nestjs/graphql'

import {
  User as TUser,
  Flight as TFlight,
  FlightLeg,
} from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Flight } from './flight.model'
import { FlightsInput } from './dto'
import { FlightWithUser } from './flight.types'
import { User } from '../user'

type FlightWithTUser = TFlight & { user: TUser }

@Resolver(() => Flight)
export class FlightResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize({ role: 'admin' })
  @Query(() => [Flight])
  flights(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => FlightsInput }) input,
  ): Promise<Flight[]> {
    return backendApi.getFlights(input)
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
