import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { FlightLeg as TFlightLeg } from '@island.is/air-discount-scheme/types'
import { Authorize, AuthService } from '../auth'
import { FlightLegsInput, ConfirmInvoiceInput } from './dto'
import { FlightLeg } from './flightLeg.model'

@Resolver(() => FlightLeg)
export class FlightLegResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize({ role: 'admin' })
  @Query(() => [FlightLeg])
  flightLegs(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => FlightLegsInput }) input,
  ): Promise<TFlightLeg[]> {
    return backendApi.getFlightLegs(input)
  }

  @Authorize({ role: 'admin' })
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
