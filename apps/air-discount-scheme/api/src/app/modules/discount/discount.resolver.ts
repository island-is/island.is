import { Mutation, Resolver, ResolveField, Context } from '@nestjs/graphql'

import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Discount } from './discount.model'
import { User } from '../user'

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Mutation(() => Discount, { nullable: true })
  async fetchDiscount(
    @CurrentUser() user,
    @Context('dataSources') { backendApi },
  ): Promise<Discount> {
    let discount = await backendApi.getDiscount(user.ssn)
    if (!discount) {
      discount = await backendApi.createDiscount(user.ssn)
    }

    return discount
  }

  @Authorize({ throwOnUnAuthorized: false })
  @ResolveField('user')
  resolveUser(@CurrentUser() user: AuthUser): User {
    return user as User
  }
}
