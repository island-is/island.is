import { UseGuards } from '@nestjs/common'
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FlightLegService } from './flight-leg.service'
import { FlightLeg, FlightLegWithoutTravel } from '../models/flightLeg.model'
import type { FlightLeg as TFlightLeg } from '@island.is/clients/air-discount-scheme'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => FlightLeg)
export class FlightLegResolver {
  constructor(private flightLegService: FlightLegService) {}

  @Query(() => [FlightLeg], {
    name: 'airDiscountSchemeUserAndRelationsFlights',
  })
  async getFlightLegs(
    @CurrentUser() user: User,
  ): Promise<FlightLegWithoutTravel[]> {
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }

  @ResolveField('travel')
  resolveTravel(@Parent() flightLeg: TFlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
