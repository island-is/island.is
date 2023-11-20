import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { NewDiscountService } from './newDiscount.service'
import { NewDiscount } from '../models/newDiscount.model'
import { CreateNewDiscountCodeInput } from './dto/createNewDiscountCode.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver(() => NewDiscount)
export class NewDiscountResolver {
  constructor(private newDiscountService: NewDiscountService) {}

  @Mutation(() => NewDiscount, {
    name: 'createAirDiscountSchemeNewDiscount',
  })
  createNewDiscount(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateNewDiscountCodeInput })
    input: CreateNewDiscountCodeInput,
  ): Promise<NewDiscount | null> {
    return this.newDiscountService.createDiscount(user, input)
  }

  @Query(() => [NewDiscount], { name: 'airDiscountSchemeNewDiscounts' })
  @Audit()
  async getDiscount(@CurrentUser() user: User): Promise<NewDiscount[]> {
    return this.newDiscountService.getCurrentDiscounts(user)
  }

  @Query(() => NewDiscount, {
    name: 'airDiscountSchemeNewDiscount',
    nullable: true,
  })
  @Audit()
  async getDiscountByNationalId(
    @CurrentUser() user: User,
  ): Promise<NewDiscount | null> {
    return this.newDiscountService.getCurrentDiscount(user)
  }
}
