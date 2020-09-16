import { Query, Resolver, Context, ResolveField, Parent } from '@nestjs/graphql'

import {
  User as TUser,
  Flight,
  FlightLeg as TFlightLeg,
} from '@island.is/air-discount-scheme/types'
import { FlightLeg } from '../flightLeg'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { User } from './models'

@Resolver(() => User)
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Authorize({ throwOnUnAuthorized: false })
  @Query(() => User, { nullable: true })
  user(@CurrentUser() user: AuthUser): User {
    if (!user) {
      return null
    }

    return user as User
  }

  @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('role')
  resolveRole(@CurrentUser() user: AuthUser): string {
    return this.authService.getRole(user)
  }

  @ResolveField('meetsADSRequirements')
  resolveMeetsADSRequirements(@Parent() user: TUser): boolean {
    if (user.fund) {
      return user.fund.credit === user.fund.total - user.fund.used
    }

    return false
  }

  @Authorize()
  @ResolveField('flightLegs', () => [FlightLeg])
  async resolveFlights(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<TFlightLeg[]> {
    const relations: TUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
    return relations.reduce(
      (promise: Promise<FlightLeg[]>, relation: TUser) => {
        return promise.then(async (acc) => {
          const flights: Flight[] = await backendApi.getUserFlights(
            relation.nationalId,
          )
          const flightLegs = flights.reduce((acc, flight) => {
            const legs = flight.flightLegs.map(
              ({ id, origin, destination }) => ({
                flight: {
                  ...flight,
                  user: relation,
                },
                id,
                origin,
                destination,
              }),
            )
            return [...acc, ...legs]
          }, [])
          return [...acc, ...flightLegs]
        })
      },
      Promise.resolve([]),
    ) as Promise<TFlightLeg[]>
  }
}
