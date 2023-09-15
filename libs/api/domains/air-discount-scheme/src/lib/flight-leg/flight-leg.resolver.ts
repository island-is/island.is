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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver()
export class FlightLegResolver {
  constructor(private flightLegService: FlightLegService) {}

  @Query(() => [FlightLeg], {
    name: 'airDiscountSchemeUserAndRelationsFlights',
  })
  @Audit()
  async getFlightLegs(@CurrentUser() user: User): Promise<FlightLeg[]> {
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }
}
