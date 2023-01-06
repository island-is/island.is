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
import { Flight } from '../models/flight.model'
import { Flight as TFlight } from '@island.is/air-discount-scheme/types'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => [Flight])
export class FlightLegResolver {
  constructor(private flightLegService: FlightLegService) {}

  @Query(() => [Flight], {
    name: 'airDiscountSchemeUserAndRelationsFlightLegs',
  })
  async getFlightLegs(@CurrentUser() user: User): Promise<TFlight[]> {
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }
}
