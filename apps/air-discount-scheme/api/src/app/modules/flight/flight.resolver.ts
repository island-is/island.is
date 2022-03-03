import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { User } from '../user'

import { Flight } from './flight.model'
import type { FlightWithUser } from './flight.types'

@Resolver(() => Flight)
export class FlightResolver {
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
}
