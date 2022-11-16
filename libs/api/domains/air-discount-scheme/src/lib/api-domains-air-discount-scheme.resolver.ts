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

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { Discount } from '../models/discount.model'

type DiscountWithTUser = Discount & { user: TUser }

const TWO_HOURS = 7200

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.airDiscountScheme)
@Audit({ namespace: '@island.is/air-discount-scheme' })
export class AirDiscountSchemeResolver {
  constructor(private airDiscountSchemeService: AirDiscountSchemeService) {}

  @Query(() => [Discount], { nullable: true })
  @Audit()
  async getDiscount(@CurrentUser() user: User) {
    const relations: TUser[] = (await this.airDiscountSchemeService.getUserRelations(
      user,
    )) as TUser[]

    const discounts: DiscountWithTUser[] = []
    for (const relation of relations) {
      let discount: TDiscount = (await this.airDiscountSchemeService.getDiscount(
        user,
        relation.nationalId,
      )) as TDiscount
      if (!discount || discount.expiresIn <= TWO_HOURS) {
        const createdDiscount = await this.airDiscountSchemeService.createDiscount(
          user,
          relation.nationalId,
        )

        if (createdDiscount) {
          discount = createdDiscount
        }
      }
      discounts.push({
        ...discount,
        user: { ...relation, name: relation.firstName },
      })
    }

    return discounts
  }
}
