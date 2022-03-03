import { UseGuards } from '@nestjs/common'
import { Args,Query } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'

import {
  GetMultiPropertyInput,
  GetPagingTypes,
  GetRealEstateInput,
} from '../dto/getRealEstateInput.input'
import { PropertyDetail } from '../models/propertyDetail.model'
import { PropertyOverview } from '../models/propertyOverview.model'
import { PropertyOwnersModel } from '../models/propertyOwners.model'
import { UnitsOfUseModel } from '../models/propertyUnitsOfUse.model'

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
}
