import {
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import { Discount as TDiscount } from '@island.is/air-discount-scheme/types'
import { Authorize, CurrentUser, AuthService, AuthUser } from '../auth'
import { Discount, FlightLegFund } from './models'
import { User } from '../user'

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Mutation(() => [Discount], { nullable: true })
  async fetchDiscounts(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<Discount> {
    const relations = await backendApi.getUserRelations(user.nationalId)
    const discounts = await relations.reduce(async (acc, relation) => {
      let discount: TDiscount = await backendApi.getDiscount(
        relation.nationalId,
      )
      if (!discount && relation.flightLegsLeft > 0) {
        discount = await backendApi.createDiscount(relation.nationalId)
      }
      return [...acc, discount]
    }, [])

    return discounts.map((discount) => ({
      ...discount,
      user: relations.find(
        (relation) => relation.nationalId === discount.nationalId,
      ),
    }))
  }

  @ResolveField('flightLegFund')
  resolveFlightLegFund(
    @Parent() discount: Discount,
    @Context('dataSources') { backendApi },
  ): FlightLegFund {
    return backendApi.getFlightLegFunds(discount.nationalId)
  }
}
