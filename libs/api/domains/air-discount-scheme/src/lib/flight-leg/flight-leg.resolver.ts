import { UseGuards } from '@nestjs/common'
import { Args, Info, Query, Resolver } from '@nestjs/graphql'
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
import { detectGraphqlDepthFromInfo } from '../utils/detect-graphql-depth'
import { repeat } from 'lodash'
import { GraphQLError, GraphQLResolveInfo } from 'graphql'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver()
export class FlightLegResolver {
  constructor(private flightLegService: FlightLegService) {}

  @Query(() => [FlightLeg], {
    name: 'airDiscountSchemeUserAndRelationsFlights',
  })
  async getFlightLegs(
    @CurrentUser() user: User,
    @Info() info: GraphQLResolveInfo,
  ): Promise<FlightLeg[]> {
    // See Info()
    // https://docs.nestjs.com/graphql/resolvers#graphql-argument-decorators

    const depth = detectGraphqlDepthFromInfo(info)

    if (depth > 4) {
      throw new GraphQLError('Query Depth Limit exceeded')
    }
    return this.flightLegService.getThisYearsUserAndRelationsFlightLegs(user)
  }
}
