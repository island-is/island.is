import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { FlightLeg } from '../models/flightLeg.model'
import { isServiceDisabled } from '../shared/isServiceDisabled'
import { FlightLegService } from './flight-leg.service'

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
    if (await isServiceDisabled(this.featureFlagService, user)) {
      return []
    }
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }
}
