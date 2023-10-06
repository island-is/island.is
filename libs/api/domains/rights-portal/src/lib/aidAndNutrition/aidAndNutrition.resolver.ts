import { Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { PaginatedAidAndNutritionResponse } from './models/aidAndNutrition.model'
import { AidAndNutritionService } from './aidAndNutrition.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/aid-and-nutrition' })
export class AidAndNutritionResolver {
  constructor(private readonly service: AidAndNutritionService) {}

  @Scopes(ApiScope.health)
  @Query(() => PaginatedAidAndNutritionResponse, {
    name: 'rightsPortalPaginatedAidAndNutrition',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidAndNutrition(@CurrentUser() user: User) {
    return this.service.getAidAndNutrition(user)
  }
}
