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
import { DiscountService } from './discount.service'
import { Discount } from '../models/discount.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private discountService: DiscountService) {}

  @Query(() => [Discount], { name: 'airDiscountSchemeDiscounts' })
  @Audit()
  async getDiscount(@CurrentUser() user: User): Promise<Discount[]> {
    return this.discountService.getCurrentDiscounts(user)
  }
}
