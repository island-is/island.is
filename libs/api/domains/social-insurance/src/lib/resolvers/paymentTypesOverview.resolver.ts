import { Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { PaymentTypesOverviewResult } from '../models/paymentTypes/paymentTypesOverviewResult.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalMyPagesTRPaymentTypesOverviewPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PaymentTypesOverviewResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => PaymentTypesOverviewResult, {
    name: 'socialInsurancePaymentTypesOverview',
    nullable: true,
  })
  @Audit()
  getPaymentTypesOverview(
    @CurrentUser() user: User,
  ): Promise<PaymentTypesOverviewResult | null> {
    return this.service.getPaymentTypesOverview(user)
  }
}
