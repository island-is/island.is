import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from './socialInsurance.service'
import { PaymentPlan } from './models/paymentPlan.model'
import { SocialInsurancePaymentPlanInput } from './dtos/paymentPlan.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.internal)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class SocialInsuranceResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PaymentPlan, {
    name: 'socialInsurancePaymentPlan',
    nullable: true,
  })
  @Audit()
  async getPaymentPlan(
    @CurrentUser() user: User,
    @Args('input') input: SocialInsurancePaymentPlanInput,
  ) {
    return this.service.getPaymentPlan(user, input.year)
  }
}
