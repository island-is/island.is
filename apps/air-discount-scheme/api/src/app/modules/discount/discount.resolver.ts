import { UseGuards } from '@nestjs/common'
import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import { User } from '../user'

import { Discount } from './discount.model'

type DiscountWithTUser = Discount & { user: TUser }

const TWO_HOURS = 7200 // seconds

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
@Resolver(() => Discount)
export class DiscountResolver {
  @Query(() => [Discount], { nullable: true })
  async discounts(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<DiscountWithTUser[]> {
    const relations: TUser[] = await backendApi.getUserRelations(
      user.nationalId,
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
