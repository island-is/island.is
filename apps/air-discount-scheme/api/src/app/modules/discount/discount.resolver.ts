import { Mutation, Resolver, ResolveField, Context } from '@nestjs/graphql'

import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Discount } from './discount.model'
import { User } from '../user'

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Mutation(() => [Discount], { nullable: true })
  async fetchDiscounts(
    @CurrentUser() user,
    @Context('dataSources') { backendApi },
  ): Promise<Discount> {
    const discounts: TDiscount[] = await backendApi.getDiscounts(user.ssn)
    let userDiscount: TDiscount = discounts.find(
      (discount) => discount.nationalId === user.ssn,
    )
    if (!userDiscount) {
      userDiscount = await backendApi.createDiscount(user.ssn)
    }

    return [
      userDiscount,
      ...discounts.filter((discount) => discount.nationalId !== user.ssn),
    ]
  }

  @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('user')
  resolveUser(@CurrentUser() user: AuthUser): User {
    return user as User
  }
}
