import { Query, Resolver, Context, ResolveField, Parent } from '@nestjs/graphql'

import type { User as TUser } from '@island.is/air-discount-scheme/types'
import {
  Flight,
  FlightLeg as TFlightLeg,
} from '@island.is/air-discount-scheme/types'
import { FlightLeg } from '../flightLeg'
import { CurrentUser } from '../decorators'
import type { AuthUser } from '../auth/types'
import { User } from './models'
import { Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { getRole } from '../auth/roles'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

@Resolver(() => User)
export class UserResolver {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {}

  @Query(() => User, { nullable: true })
  async user(@CurrentUser() user: AuthUser): Promise<User | undefined> {
    if (!user) {
      return undefined
    }
    user.role = getRole(user)
    return user as User
  }

  @ResolveField('role')
  resolveRole(@CurrentUser() user: AuthUser): string {
    return getRole(user)
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AirDiscountSchemeScope.full)
  @ResolveField('meetsADSRequirements')
  resolveMeetsADSRequirements(@Parent() user: TUser): boolean {
    if (user.fund) {
      return user.fund.credit === user.fund.total - user.fund.used
    }
    return false
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AirDiscountSchemeScope.full)
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
