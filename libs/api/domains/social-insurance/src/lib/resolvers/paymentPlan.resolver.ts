import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  type User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from '../socialInsurance.service'
import { PaymentPlan } from '../models/payments/paymentPlan.model'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { Payments } from '../models/payments/payments.model'
import { TemporaryCalculation } from '../models/temporaryCalculation.model'
import { TemporaryCalculationInput } from '../dtos/temporaryCalculation.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PaymentPlanResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PaymentPlan, {
    name: 'socialInsurancePaymentPlan',
    nullable: true,
  })
  @FeatureFlag(Features.servicePortalSocialInsurancePageEnabled)
  @Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
  @Audit()
  async paymentPlan(@CurrentUser() user: User) {
    return this.service.getPaymentPlan(user)
  }

  @Query(() => Payments, {
    name: 'socialInsurancePayments',
    nullable: true,
  })
  @FeatureFlag(Features.servicePortalSocialInsurancePageEnabled)
  @Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
  @Audit()
  async(@CurrentUser() user: User): Promise<Payments | undefined> {
    return this.service.getPayments(user)
  }

  @Query(() => TemporaryCalculation)
  async getTemporaryCalculations(
    @Args('input') input: TemporaryCalculationInput,
    @CurrentUser() user: User,
  ) {
    return this.service.getTemporaryCalculations(user, input)
  }
}
