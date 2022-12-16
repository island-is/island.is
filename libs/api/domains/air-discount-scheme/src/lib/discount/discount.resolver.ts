import { UseGuards } from '@nestjs/common'
import { Query, ResolveField, Resolver } from '@nestjs/graphql'
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

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private discountService: DiscountService) {}

  @Query(() => [Discount], { name: 'airDiscountSchemeDiscounts' })
  async getDiscount(@CurrentUser() user: User) {
    return this.discountService.getCurrentDiscounts(user)
  }

  @ResolveField('flightLegs', () => [FlightLeg])
  resolveFlightLegs(@CurrentUser() user: User) {
    return this.discountService.getFlightLegsByUser(user)
  }
}
