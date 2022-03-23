import { UseGuards } from '@nestjs/common'
import { Query, Args } from '@nestjs/graphql'
import type { User } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  GetRealEstateInput,
  GetPagingTypes,
  GetMultiPropertyInput,
} from '../dto/getRealEstateInput.input'
import { PropertyOwnersModel } from '../models/propertyOwners.model'
import { UnitsOfUseModel } from '../models/propertyUnitsOfUse.model'
import { PropertyDetail } from '../models/propertyDetail.model'
import {
  PropertyOverview,
  PropertyOverviewWithDetail,
} from '../models/propertyOverview.model'
import { AssetsXRoadService } from './api-domains-assets.service'

@UseGuards(IdsAuthGuard, IdsUserGuard, ScopesGuard)
@Scopes(ApiScope.assets)
@Audit({ namespace: '@island.is/api/assets' })
export class AssetsXRoadResolver {
  constructor(private assetsXRoadService: AssetsXRoadService) {}

  @Query(() => PropertyOverview, { nullable: true })
  @Audit()
  async assetsOverview(
    @Args('input') input: GetMultiPropertyInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstates(user, input.cursor)
  }

  @Query(() => PropertyDetail, { nullable: true })
  @Audit()
  async assetsDetail(
    @Args('input') input: GetRealEstateInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstateDetail(input.assetId, user)
  }

  @Query(() => PropertyOwnersModel, { nullable: true })
  @Audit()
  async assetsPropertyOwners(
    @Args('input') input: GetPagingTypes,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getPropertyOwners(
      input.assetId,
      user,
      input.cursor,
      input.limit,
    )
  }

  @Query(() => UnitsOfUseModel, { nullable: true })
  @Audit()
  async assetsUnitsOfUse(
    @Args('input') input: GetPagingTypes,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getUnitsOfUse(
      input.assetId,
      user,
      input.cursor,
      input.limit,
    )
  }

  @Query(() => PropertyOverviewWithDetail, { nullable: true })
  @Audit()
  async assetsOverviewWithDetail(
    @Args('input') input: GetMultiPropertyInput,
    @CurrentUser() user: User,
  ) {
    return this.assetsXRoadService.getRealEstatesWithDetail(user, input.cursor)
  }
}
