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
import { PaginatedAidsAndNutritionResponse } from './models/getAidsAndNutrition.model'
import { AidsAndNutritionService } from './aidsAndNutrition.service'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/aids-and-nutrition' })
export class AidsAndNutritionResolver {
  constructor(private readonly service: AidsAndNutritionService) {}

  @Scopes(ApiScope.health)
  @Query(() => PaginatedAidsAndNutritionResponse, {
    name: 'rightsPortalPaginatedAidsAndNutrition',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidsAndNutrition(@CurrentUser() user: User) {
    return this.service.getAidsAndNutrition(user)
  }
}
