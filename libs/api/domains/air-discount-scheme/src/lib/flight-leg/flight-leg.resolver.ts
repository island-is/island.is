import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import type { FlightLeg as TFlightLeg } from '@island.is/clients/air-discount-scheme'

import { FlightLegsInput } from './dto/flight-leg.input'
import { FlightLeg } from '../models/flightLeg.model'
import { FlightLegService } from './flight-leg.service'
import { Audit } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => FlightLeg)
export class FlightLegResolver {
  constructor(private readonly flightLegService: FlightLegService) {}

  @Query(() => [FlightLeg], { name: 'airDiscountSchemeUserFlightLegs' })
  flightLegs(
    @CurrentUser() user: User,
    @Args('input', { type: () => FlightLegsInput }) input: FlightLegsInput,
  ): Promise<TFlightLeg[]> {
    return this.flightLegService.getFlightLegsByUser(user, input)
  }

  @ResolveField('travel')
  resolveTravel(@Parent() flightLeg: TFlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
