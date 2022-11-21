import { UseGuards } from '@nestjs/common'
import { Query } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { AirDiscountSchemeService } from './api-domains-air-discount-scheme.service'
import { Discount } from '../models/discount.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
export class AirDiscountSchemeResolver {
  constructor(private airDiscountSchemeService: AirDiscountSchemeService) {}

  @Query(() => [Discount], { nullable: true })
  async getDiscount(@CurrentUser() user: User) {
    return this.airDiscountSchemeService.getCurrentDiscounts(user)
  }
}
