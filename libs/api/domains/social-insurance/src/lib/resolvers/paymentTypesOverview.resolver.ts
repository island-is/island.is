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
import { PaymentTypeOverview } from '../models/paymentTypes/paymentTypeOverview.model'
import { ChildBenefitInformation } from '../models/paymentTypes/childBenefitInformation.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
@FeatureFlag(Features.isServicePortalTRPaymentTypesOverviewPageEnabled)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class PaymentTypesOverviewResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => [PaymentTypeOverview], {
    name: 'socialInsurancePaymentTypes',
    nullable: true,
  })
  @Audit()
  getPaymentTypes(
    @CurrentUser() user: User,
  ): Promise<PaymentTypeOverview[] | null> {
    return this.service.getPaymentTypes(user)
  }

  @Query(() => [ChildBenefitInformation], {
    name: 'socialInsuranceChildBenefits',
    nullable: true,
  })
  @Audit()
  getChildBenefits(
    @CurrentUser() user: User,
  ): Promise<ChildBenefitInformation[] | null> {
    return this.service.getChildBenefits(user)
  }
}
