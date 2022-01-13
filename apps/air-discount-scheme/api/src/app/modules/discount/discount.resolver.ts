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
  User as AuthUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Roles } from '../decorators/roles.decorator'
import { Role } from '@island.is/air-discount-scheme/types'
import { RolesGuard } from '../auth/roles.guard'

type DiscountWithTUser = Discount & { user: TUser }

const TWO_HOURS = 7200 // seconds

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes('@vegagerdin.is/air-discount-scheme-scope')
@Resolver(() => Discount)
export class DiscountResolver {
  @UseGuards(RolesGuard)
  @Roles(Role.DEVELOPER)
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
