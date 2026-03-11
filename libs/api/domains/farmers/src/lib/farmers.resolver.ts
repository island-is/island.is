import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
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
import { LandsCollection } from './models/farmerLandsCollection.model'
import { LandBeneficiary } from './models/landBeneficiary.model'
import { LandRegistryEntry } from './models/landRegistryEntry.model'
import { FarmersService } from './farmers.service'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@FeatureFlag(Features.isServicePortalFarmersLandsPageEnabled)
@Audit({ namespace: '@island.is/api/farmers' })
@Resolver(() => FarmerLand)
export class FarmersResolver {
  constructor(private readonly farmersService: FarmersService) {}

  @Query(() => LandsCollection, { name: 'farmerLands', nullable: true })
  async farmerLandsList(@CurrentUser() user: User): Promise<LandsCollection> {
    return this.farmersService.getList(user)
  }

  @Query(() => FarmerLand, { name: 'farmerLand', nullable: true })
  async getFarmerLand(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<FarmerLand | null> {
    return this.farmersService.getLand(user, id)
  }

  @ResolveField('beneficiaries', () => [LandBeneficiary], { nullable: true })
  async resolveBeneficiaries(
    @CurrentUser() user: User,
    @Parent() land: FarmerLand,
  ): Promise<LandBeneficiary[]> {
    return this.farmersService.getBeneficiaries(user, String(land.id))
  }

  @ResolveField('landRegistry', () => [LandRegistryEntry], { nullable: true })
  async resolveLandRegistry(
    @CurrentUser() user: User,
    @Parent() land: FarmerLand,
  ): Promise<LandRegistryEntry[]> {
    return this.farmersService.getLandRegistry(user, String(land.id))
  }
}
