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
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsUserGuard)
@Resolver(() => FlightLeg)
export class FlightLegResolver {

  // TODO AUTHORIZE ADMIN ONLY  @Authorize({ role: 'admin' })
  @Query(() => [FlightLeg])
  flightLegs(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => FlightLegsInput }) input,
  ): Promise<TFlightLeg[]> {
    return backendApi.getFlightLegs(input)
  }

  //TODO AUTHORIZE ADMIN ONLY@Authorize({ role: 'admin' })
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
