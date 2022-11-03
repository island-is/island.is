import {
  Args,
  Directive,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'

import { User } from './models/user.model'

import { BackendAPI } from './services'
import { Discount } from './models/discount.model'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
type DiscountWithTUser = Discount & { user: TUser }

const cacheControlDirective = () => `@cacheControl(maxAge: 0)`
const TWO_HOURS = 7200

@Resolver(() => Discount)
@Directive(cacheControlDirective())
export class AirDiscountSchemeResolver {
  constructor(private backendAPI: BackendAPI) {}

  @UseGuards(IdsUserGuard)
  @Query(() => [Discount], { nullable: true })
  async adsDiscounts(
    @CurrentUser() user: AuthUser,
  ): Promise<DiscountWithTUser[]> {
    let relations: TUser[] = await this.backendAPI.getUserRelations(
      user.nationalId,
      user.authorization,
    )

    // Should not generate discountcodes for users who do not meet requirements
    relations = relations.filter(
      (user) => user.fund.credit === user.fund.total - user.fund.used,
    )

    const discounts: DiscountWithTUser[] = []
    for (const relation of relations) {
      let discount: TDiscount | null = await this.backendAPI.getDiscount(
        relation.nationalId,
        user.authorization,
      )
      if (!discount || discount.expiresIn <= TWO_HOURS) {
        discount = await this.backendAPI.createDiscount(
          relation.nationalId,
          user.authorization,
        )
      }

      discounts.push({
        ...discount,
        user: {
          ...relation,
          name: relation.firstName,
        },
      })
    }
    return discounts
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
      meetsADSRequirements:
        user.fund.credit === user.fund.total - user.fund.used,
    }
  }
}
