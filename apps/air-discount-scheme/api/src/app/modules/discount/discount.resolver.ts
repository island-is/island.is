import {
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'

import {
  Discount as TDiscount,
  ThjodskraUser,
} from '@island.is/air-discount-scheme/types'
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
    const relations: ThjodskraUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
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

  @ResolveField('user')
  resolveUser(@Parent() discount: Discount): User {
    const { user } = discount
    return {
      ...user,
      name: `${user.firstName} ${user.middleName} ${user.lastName}`.replace(
        /\s\s+/g,
        ' ',
      ),
    }
  }

  @ResolveField('flightLegFund')
  resolveFlightLegFund(
    @Parent() discount: Discount,
    @Context('dataSources') { backendApi },
  ): FlightLegFund {
    return backendApi.getFlightLegFunds(discount.nationalId)
  }
}
