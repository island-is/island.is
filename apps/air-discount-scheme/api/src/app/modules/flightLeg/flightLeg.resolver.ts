import {
  Context,
  Query,
  Parent,
  ResolveField,
  Resolver,
  Args,
} from '@nestjs/graphql'

import { FlightLeg as TFlightLeg } from '@island.is/air-discount-scheme/types'
import { Authorize, AuthService } from '../auth'
import { FlightLegsInput } from './dto'
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

  @ResolveField('travel')
  resolveTravel(@Parent() flightLeg: TFlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
