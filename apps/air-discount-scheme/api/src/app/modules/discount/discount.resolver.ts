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

type DiscountWithThjodskraUser = Discount & { user: ThjodskraUser }

@Resolver(() => Discount)
export class DiscountResolver {
  constructor(private readonly authService: AuthService) {}

  @Authorize()
  @Mutation(() => [Discount], { nullable: true })
  async fetchDiscounts(
    @CurrentUser() user: AuthUser,
    @Context('dataSources') { backendApi },
  ): Promise<DiscountWithThjodskraUser[]> {
    const relations: ThjodskraUser[] = await backendApi.getUserRelations(
      user.nationalId,
    )
    return relations.reduce(
      (
        promise: Promise<DiscountWithThjodskraUser[]>,
        relation: ThjodskraUser,
      ) => {
        return promise.then(async (acc) => {
          let discount: TDiscount = await backendApi.getDiscount(
            relation.nationalId,
          )
          if (!discount && relation.flightLegsLeft > 0) {
            discount = await backendApi.createDiscount(relation.nationalId)
          }
          return [...acc, { ...discount, user: relation }]
        })
      },
      Promise.resolve([]),
    ) as Promise<DiscountWithThjodskraUser[]>
  }

  @ResolveField('user')
  resolveUser(@Parent() discount: DiscountWithThjodskraUser): User {
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
