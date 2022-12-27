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
import { DiscountService } from './discount.service'
import { Discount } from '../models/discount.model'
import { FlightLeg } from '../models/flightLeg.model'
import { User as Relation } from '../models/user.model'
import type { FlightLeg as TFlightLeg } from '@island.is/clients/air-discount-scheme'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private discountService: DiscountService) {}

  @Query(() => [Discount], { name: 'airDiscountSchemeDiscounts' })
  async getDiscount(@CurrentUser() user: User): Promise<Discount[]> {
    return this.discountService.getCurrentDiscounts(user)
  }

  @ResolveField('flightLegs', () => [FlightLeg])
  async resolveFlightLegs(
    @CurrentUser() user: User,
    @Parent() relation: Relation,
  ): Promise<TFlightLeg[]> {
    // AirDiscountSChemeDiscounts yields discounts for the authenticated user
    // and any eligible wards (relations).
    return this.discountService.getFlightLegsByNationalId(
      user,
      relation.nationalId,
    )
  }

  @ResolveField('travel')
  resolveTravel(@Parent() flightLeg: TFlightLeg): string {
    return `${flightLeg.origin} - ${flightLeg.destination}`
  }
}
