import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { Flight } from './flight.model'
import { FlightWithUser } from './flight.types'
import { User } from '../user'

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
