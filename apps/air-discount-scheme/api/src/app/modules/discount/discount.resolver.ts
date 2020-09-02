import {
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import {
  Discount as TDiscount,
  User as TUser,
} from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Discount } from './discount.model'
import { User } from '../user'

type DiscountWithTUser = Discount & { user: TUser }

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Mutation(() => [Discount], { nullable: true })
  async fetchDiscounts(
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
