import { Context, Query, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { Discount } from './discount.model'
import { User } from '../user'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

type DiscountWithTUser = Discount & { user: TUser }

const TWO_HOURS = 7200 // seconds

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.full)
@Resolver(() => Discount)
export class DiscountResolver {
  @Query(() => [Discount], { nullable: true })
  async discounts(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<DiscountWithTUser[]> {
    let relations: TUser[] = await backendApi.getUserRelations(user.nationalId)

    // Should not generate discountcodes for users who do not meet requirements
    relations = relations.filter(
      (user) => user.fund.credit === user.fund.total - user.fund.used,
    )

    return relations.reduce(
      (promise: Promise<DiscountWithTUser[]>, relation: TUser) => {
        return promise.then(async (acc) => {
          let discount: TDiscount = await backendApi.getDiscount(
            relation.nationalId,
          )
          if (!discount || discount.expiresIn <= TWO_HOURS) {
            discount = await backendApi.createDiscount(relation.nationalId)
          }
          return [...acc, { ...discount, user: relation }]
        })
      },
      Promise.resolve([]),
    ) as Promise<DiscountWithTUser[]>
  }

  @ResolveField('user')
  resolveUser(@Parent() discount: DiscountWithTUser): User {
    const { user } = discount
    return {
      ...user,
      name: `${user.firstName} ${user.middleName} ${user.lastName}`.replace(
        /\s\s+/g,
        ' ',
      ),
    }
  }
}
