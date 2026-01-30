import { Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'

import { FarmerLand } from './models/farmerLand.model'
import { FarmerLandsCollection } from './models/farmerLandsCollection.model'
import { FarmersService } from './farmers.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@FeatureFlag(Features.isServicePortalFarmersLandsEnabled)
@Audit({ namespace: '@island.is/api/farmers' })
@Resolver(() => FarmerLand)
export class FarmersResolver {
  constructor(private readonly farmersService: FarmersService) {}

  @Query(() => FarmerLandsCollection, {
    name: 'farmerLands',
    nullable: true,
  })
  async farmerLandsList(
    @CurrentUser() user: User,
  ): Promise<FarmerLandsCollection> {
    return this.farmersService.getList(user)
  }
}
