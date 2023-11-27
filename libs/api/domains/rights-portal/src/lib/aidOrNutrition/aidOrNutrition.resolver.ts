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
import { PaginatedAidOrNutritionResponse } from './models/aidOrNutrition.model'
import { AidOrNutritionService } from './aidOrNutrition.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/aid-and-nutrition' })
export class AidOrNutritionResolver {
  constructor(private readonly service: AidOrNutritionService) {}

  @Scopes(ApiScope.health)
  @Query(() => PaginatedAidOrNutritionResponse, {
    name: 'rightsPortalPaginatedAidOrNutrition',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidOrNutrition(@CurrentUser() user: User) {
    return this.service.getAidOrNutrition(user)
  }
}
