import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { RehabilitationPlanModel } from '../models/medicalDocuments/rehabilitationPlan.model'
import { SocialInsuranceService } from '../socialInsurance.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/social-insurance' })
@Scopes(ApiScope.internal)
export class MedicalDocumentsResolver {
  constructor(private readonly service: SocialInsuranceService) {}

  @Query(() => RehabilitationPlanModel)
  async siaGetRehabilitationPlan(@CurrentUser() user: User) {
    return this.service.getRehabilitationPlan(user)
  }
}
