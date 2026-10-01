import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagService } from '@island.is/nest/feature-flags'

import { Discount } from '../models/discount.model'
import { isServiceDisabled } from '../shared/isServiceDisabled'
import { DiscountService } from './discount.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => Discount)
export class DiscountResolver {
  constructor(
    private discountService: DiscountService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  @Query(() => [Discount], { name: 'airDiscountSchemeDiscounts' })
  @Audit()
  async getDiscount(@CurrentUser() user: User): Promise<Discount[]> {
    if (await isServiceDisabled(this.featureFlagService, user)) {
      return []
    }

    return this.discountService.getCurrentDiscounts(user)
  }
}
