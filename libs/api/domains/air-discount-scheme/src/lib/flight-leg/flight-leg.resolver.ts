import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
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
import { FlightLeg } from '../models/flightLeg.model'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver()
export class FlightLegResolver {
  constructor(
    private flightLegService: FlightLegService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Query(() => [FlightLeg], {
    name: 'airDiscountSchemeUserAndRelationsFlights',
  })
  @Audit()
  async getFlightLegs(@CurrentUser() user: User): Promise<FlightLeg[]> {
    //check status of feature flag
    const serviceDisabled = await this.featureFlagService.getValue(
      Features.isPortalAirDiscountPageDisabled,
      false,
      user,
    )
    if (serviceDisabled) {
      return []
    }
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }
}
