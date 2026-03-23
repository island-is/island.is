import { Audit } from '@island.is/nest/audit'
import { Query, ResolveField, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from '../socialInsurance.service'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { IncomePlan } from '../models/income/incomePlan.model'
import { ApiScope } from '@island.is/auth/scopes'
import { IncomePlanEligbility } from '../models/income/incomePlanEligibility.model'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Resolver(() => IncomePlan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class IncomePlanResolver {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly service: SocialInsuranceService,
  ) {}

  @Query(() => IncomePlan, {
    name: 'socialInsuranceIncomePlan',
    nullable: true,
  })
  @FeatureFlag(Features.servicePortalSocialInsuranceIncomePlanPageEnabled)
  @Scopes(ApiScope.internal, ApiScope.socialInsuranceAdministration)
  @Audit()
  async incomePlan(@CurrentUser() user: User) {
    return this.service.getIncomePlan(user)
  }

  @ResolveField('isEligibleForChange', () => IncomePlanEligbility)
  async resolveField(@CurrentUser() user: User): Promise<IncomePlanEligbility> {
    return this.service.getIncomePlanChangeEligibility(user)
  }
}
