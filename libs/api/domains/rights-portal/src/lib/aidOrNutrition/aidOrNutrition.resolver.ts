import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { ApiScope } from '@island.is/auth/scopes'
import { PaginatedAidOrNutritionResponse } from './models/aidOrNutrition.model'
import { AidOrNutritionService } from './aidOrNutrition.service'
import { RenewAidsOrNutritionInput } from './dto/renewInput.dto'
import { Renew } from './models/renewAidOrNutrition.model'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/rights-portal/aid-and-nutrition' })
export class AidOrNutritionResolver {
  constructor(private readonly service: AidOrNutritionService) {}

  @Scopes(ApiScope.healthAssistiveAndNutrition)
  @Query(() => PaginatedAidOrNutritionResponse, {
    name: 'rightsPortalPaginatedAidOrNutrition',
    nullable: true,
  })
  @Audit()
  async getRightsPortalAidOrNutrition(@CurrentUser() user: User) {
    return this.service.getAidOrNutrition(user)
  }

  @Scopes(ApiScope.healthAssistiveAndNutrition, ApiScope.health)
  @Mutation(() => Renew, {
    name: 'rightsPortalRenewAidOrNutrition',
    nullable: true,
  })
  @Audit()
  @FeatureFlag(Features.servicePortalHealthAidAndNutritionRenewalEnabled)
  async postRightsPortalRenewAidsOrNutrition(
    @CurrentUser() user: User,
    @Args('input') input: RenewAidsOrNutritionInput,
  ): Promise<Renew | null> {
    return this.service.postRenewAidsOrNutrition(user, input.id)
  }
}
