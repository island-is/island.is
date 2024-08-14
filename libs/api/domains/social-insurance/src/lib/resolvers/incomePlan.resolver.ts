import { Audit } from '@island.is/nest/audit'
import { Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { SocialInsuranceService } from '../socialInsurance.service'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { IncomePlan } from '../models/income/incomePlan.model'
import { ApiScope } from '@island.is/auth/scopes'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
export class IncomePlanResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => IncomePlan, {
    name: 'socialInsuranceIncomePlan',
    nullable: true,
  })
  @Scopes(ApiScope.internal)
  @Audit()
  async incomePlan(@CurrentUser() user: User) {
    return this.service.getIncomePlan(user)
  }
}
