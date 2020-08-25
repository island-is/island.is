import { Mutation, Resolver, ResolveField, Context } from '@nestjs/graphql'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Discount } from './models'
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
    let discounts: TDiscount[] = await backendApi.getDiscounts(user.nationalId)
    const userDiscount: TDiscount = discounts.find(
      (discount) => discount.nationalId === user.nationalId,
    )
    if (!userDiscount) {
      discounts = [
        await backendApi.createDiscount(user.nationalId),
        ...discounts,
      ]
    }

    const relations = await backendApi.getUserRelations(user.nationalId)
    const funds = await backendApi.getFlightLegFunds(user.nationalId)
    return discounts.map((discount) => ({
      ...discount,
      user: relations.find(
        (relation) => relation.nationalId === discount.nationalId,
      ),
      flightLegFund: funds.find(
        (fund) => fund.nationalId === discount.nationalId,
      ),
    }))
  }
}
