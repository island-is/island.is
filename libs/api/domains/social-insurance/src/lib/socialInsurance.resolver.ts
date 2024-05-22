import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Int, Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  type User,
  BypassAuth,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from './socialInsurance.service'
import { PaymentPlan } from './models/paymentPlan.model'
import { PaymentPlanInput } from './dtos/paymentPlan.input'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { PensionCalculationInput } from './dtos/pensionCalculation.input'
import { PensionCalculationResponse } from './models/pensionCalculation.model'
import { Payments } from './models/payments.model'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class SocialInsuranceResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PaymentPlan, {
    name: 'socialInsurancePaymentPlan',
    nullable: true,
  })
  @FeatureFlag(Features.servicePortalSocialInsurancePageEnabled)
  @Scopes(ApiScope.internal)
  @Audit()
  async paymentPlan(
    @CurrentUser() user: User,
    @Args('input') input: PaymentPlanInput,
  ) {
    return this.service.getPaymentPlan(user, input.year)
  }

  @Query(() => Payments, {
    name: 'socialInsurancePayments',
    nullable: true,
  })
  @FeatureFlag(Features.servicePortalSocialInsurancePageEnabled)
  @Scopes(ApiScope.internal)
  @Audit()
  async(@CurrentUser() user: User): Promise<Payments | undefined> {
    return this.service.getPayments(user)
  }

  @Query(() => PensionCalculationResponse)
  @BypassAuth()
  async getPensionCalculation(@Args('input') input: PensionCalculationInput) {
    return this.service.getPensionCalculation(input)
  }
}
