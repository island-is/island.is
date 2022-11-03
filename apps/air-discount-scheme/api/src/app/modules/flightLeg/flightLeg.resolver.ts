import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import type { FlightLeg as TFlightLeg } from '@island.is/air-discount-scheme/types'
import { FlightLegsInput, ConfirmInvoiceInput } from './dto'
import { FlightLeg } from './flightLeg.model'
import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '@island.is/air-discount-scheme/types'
import { RolesGuard } from '../auth/roles.guard'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

@Scopes(AirDiscountSchemeScope.full)
@Resolver(() => FlightLeg)
export class FlightLegResolver {
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [FlightLeg])
  flightLegs(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => FlightLegsInput }) input,
  ): Promise<TFlightLeg[]> {
    return backendApi.getFlightLegs(input)
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => [FlightLeg])
  confirmInvoice(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => ConfirmInvoiceInput }) input,
  ): Promise<TFlightLeg[]> {
    return backendApi.confirmInvoice(input)
  }

  @ResolveField('travel')
  resolveTravel(@Parent() flightLeg: TFlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
