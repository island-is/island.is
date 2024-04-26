import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { DiscountAdminService } from './discount-admin.service'
import { Discount } from '../models/discount.model'
import { CreateExplicitDiscountCodeInput } from './dto/createExplicitDiscountCode.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.airDiscountScheme)
@Audit({ namespace: '@island.is/air-discount-scheme' })
@Resolver()
export class DiscountAdminResolver {
  constructor(private discountAdminService: DiscountAdminService) {}

  @Mutation(() => [Discount], {
    nullable: true,
    name: 'createAirDiscountSchemeExplicitDiscountCode',
  })
  createExplicitDiscountCode(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateExplicitDiscountCodeInput })
    input: CreateExplicitDiscountCodeInput,
  ): Promise<Array<Discount>> {
    return this.discountAdminService.createExplicitDiscountCode(user, input)
  }

  @Mutation(() => [Discount], {
    nullable: true,
    name: 'createAirDiscountSchemeSuperExplicitDiscountCode',
  })
  @Scopes(AdminPortalScope.explicitAirDiscountScheme)
  createSuperExplicitDiscountCode(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateExplicitDiscountCodeInput })
    input: CreateExplicitDiscountCodeInput,
  ): Promise<Array<Discount>> {
    return this.discountAdminService.createSuperExplicitDiscountCode(
      user,
      input,
    )
  }
}
