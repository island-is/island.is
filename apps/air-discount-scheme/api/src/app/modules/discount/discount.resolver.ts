import {
  Context,
  Query,
  Parent,
  ResolveField,
  Resolver,
  Mutation,
  Args,
} from '@nestjs/graphql'

import {
  Discount as TDiscount,
  Role,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { Discount } from './discount.model'
import { User } from '../user'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Roles } from '../decorators/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateExplicitDiscountCodeInput } from './dto/createExplicitDiscountCode.input'

type DiscountWithTUser = Discount & { user: TUser }

const TWO_HOURS = 7200 // seconds

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.default)
@Resolver(() => Discount)
export class DiscountResolver {
  @Query(() => [Discount], { nullable: true })
  async discounts(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<DiscountWithTUser[]> {
    let relations: TUser[] = await backendApi.getUserRelations(user.nationalId)

    // Check for explicit discount. If a discount exists but a person is ineligible
    // it means that an admin has created it explicitly and we report it back.
    const explicitDiscount = await backendApi.getDiscount(user.nationalId)
    const explicitDiscountWithUser = [
      {
        ...explicitDiscount,
        user: relations.find(
          (relation) => relation.nationalId === user.nationalId,
        ),
      },
    ]

    // Should not generate discountcodes for users who do not meet requirements
    relations = relations.filter(
      (user) => user.fund.credit === user.fund.total - user.fund.used,
    )

    if (explicitDiscount && relations.length === 0) {
      return explicitDiscountWithUser
    }

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

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Discount)
  createExplicitDiscountCode(
    @Context('dataSources') { backendApi },
    @Args('input', { type: () => CreateExplicitDiscountCodeInput }) input,
  ): Promise<Discount> {
    return backendApi.createExplicitDiscountCode(input)
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
